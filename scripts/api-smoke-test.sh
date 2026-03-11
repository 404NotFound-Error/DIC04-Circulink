#!/usr/bin/env bash
set -u

BASE_URL=${BASE_URL:-"http://localhost:4000/api"}
TS=$(date +%s)
SELLER_EMAIL="seller+${TS}@example.com"
BUYER_EMAIL="buyer+${TS}@example.com"
PASS="password123"

get_field() {
  RESP="$1" EXPR="$2" python - <<'PY'
import json, os, sys
resp = os.environ.get("RESP", "").strip()
expr = os.environ.get("EXPR", "")
if not resp:
    sys.exit(2)
try:
    obj = json.loads(resp)
    val = eval("obj" + expr)
    print("" if val is None else val)
except Exception as e:
    sys.stderr.write(f"JSON parse error: {e}\n")
    sys.exit(3)
PY
}

section() {
  echo "== $1 =="
}

request() {
  local method=$1
  local path=$2
  local data=${3:-""}
  local token=${4:-""}
  if [ -n "$token" ]; then
    curl -s -X "$method" "$BASE_URL$path" -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data"
  else
    if [ -n "$data" ]; then
      curl -s -X "$method" "$BASE_URL$path" -H "Content-Type: application/json" -d "$data"
    else
      curl -s -X "$method" "$BASE_URL$path"
    fi
  fi
}

section "GET /version"
request GET "/version"
echo

section "GET /metrics"
request GET "/metrics"
echo

section "POST /auth/register (seller)"
SELLER_REG=$(request POST "/auth/register" "{\"email\":\"$SELLER_EMAIL\",\"password\":\"$PASS\",\"name\":\"Seller Test\"}")
echo "$SELLER_REG"
SELLER_ID=$(get_field "$SELLER_REG" "['user']['id']") || {
  echo "ERROR: seller id missing"
  echo "$SELLER_REG"
  exit 1
}

section "POST /auth/register (buyer)"
BUYER_REG=$(request POST "/auth/register" "{\"email\":\"$BUYER_EMAIL\",\"password\":\"$PASS\",\"name\":\"Buyer Test\"}")
echo "$BUYER_REG"
BUYER_ID=$(get_field "$BUYER_REG" "['user']['id']") || {
  echo "ERROR: buyer id missing"
  echo "$BUYER_REG"
  exit 1
}

section "POST /auth/login (seller)"
SELLER_LOGIN=$(request POST "/auth/login" "{\"email\":\"$SELLER_EMAIL\",\"password\":\"$PASS\"}")
echo "$SELLER_LOGIN"
SELLER_TOKEN=$(get_field "$SELLER_LOGIN" "['tokens']['accessToken']") || {
  echo "ERROR: seller token missing"
  echo "$SELLER_LOGIN"
  exit 1
}
SELLER_REFRESH=$(get_field "$SELLER_LOGIN" "['tokens']['refreshToken']") || {
  echo "ERROR: seller refresh token missing"
  echo "$SELLER_LOGIN"
  exit 1
}

section "POST /auth/login (buyer)"
BUYER_LOGIN=$(request POST "/auth/login" "{\"email\":\"$BUYER_EMAIL\",\"password\":\"$PASS\"}")
echo "$BUYER_LOGIN"
BUYER_TOKEN=$(get_field "$BUYER_LOGIN" "['tokens']['accessToken']") || {
  echo "ERROR: buyer token missing"
  echo "$BUYER_LOGIN"
  exit 1
}
BUYER_REFRESH=$(get_field "$BUYER_LOGIN" "['tokens']['refreshToken']") || {
  echo "ERROR: buyer refresh token missing"
  echo "$BUYER_LOGIN"
  exit 1
}

section "GET /auth/me"
request GET "/auth/me" "" "$SELLER_TOKEN"
echo

section "POST /auth/refresh"
request POST "/auth/refresh" "{\"refreshToken\":\"$BUYER_REFRESH\"}"
echo

section "POST /auth/logout"
request POST "/auth/logout" "{\"refreshToken\":\"$BUYER_REFRESH\"}"
echo

section "POST /auth/verify/request"
VERIFY_REQ=$(request POST "/auth/verify/request" "{\"email\":\"$SELLER_EMAIL\"}")
echo "$VERIFY_REQ"
VERIFY_TOKEN=$(get_field "$VERIFY_REQ" "['data']['token']") || {
  echo "ERROR: verify token missing"
  echo "$VERIFY_REQ"
  exit 1
}

section "POST /auth/verify"
request POST "/auth/verify" "{\"token\":\"$VERIFY_TOKEN\"}"
echo

section "POST /auth/password/forgot"
FORGOT=$(request POST "/auth/password/forgot" "{\"email\":\"$SELLER_EMAIL\"}")
echo "$FORGOT"
RESET_TOKEN=$(get_field "$FORGOT" "['data']['token']") || {
  echo "ERROR: reset token missing"
  echo "$FORGOT"
  exit 1
}

section "POST /auth/password/reset"
request POST "/auth/password/reset" "{\"token\":\"$RESET_TOKEN\",\"password\":\"password456\"}"
echo

section "GET /categories"
CATS=$(request GET "/categories")
echo "$CATS"
CAT_ID=$(get_field "$CATS" "['data'][0]['id']" 2>/dev/null || true)
if [ -z "${CAT_ID:-}" ]; then
  echo "No categories found. Creating one for smoke test..."
  CAT_ID=$(node --input-type=module -e 'import { PrismaClient } from "@prisma/client"; const prisma = new PrismaClient(); const slug = `smoke-${Date.now()}`; const category = await prisma.category.create({ data: { name: "Smoke Test", slug } }); console.log(category.id); await prisma.$disconnect();' 2>/dev/null)
fi
if [ -z "${CAT_ID:-}" ]; then
  echo "ERROR: category id missing and auto-create failed"
  echo "$CATS"
  exit 1
fi

section "POST /items"
ITEM=$(request POST "/items" "{\"title\":\"Test Item $TS\",\"description\":\"Seeded test item\",\"price\":99,\"condition\":\"GOOD\",\"status\":\"ACTIVE\",\"categoryId\":\"$CAT_ID\",\"images\":[]}" "$SELLER_TOKEN")
echo "$ITEM"
ITEM_ID=$(get_field "$ITEM" "['data']['id']") || {
  echo "ERROR: item id missing"
  echo "$ITEM"
  exit 1
}

section "GET /items"
request GET "/items?page=1&pageSize=2"
echo

section "GET /items/:id"
request GET "/items/$ITEM_ID"
echo

section "PATCH /items/:id"
request PATCH "/items/$ITEM_ID" "{\"title\":\"Test Item $TS Updated\"}" "$SELLER_TOKEN"
echo

section "POST /favorites"
FAV=$(request POST "/favorites" "{\"itemId\":\"$ITEM_ID\"}" "$BUYER_TOKEN")
echo "$FAV"
FAV_ID=$(get_field "$FAV" "['data']['id']") || {
  echo "ERROR: favorite id missing"
  echo "$FAV"
  exit 1
}

section "GET /favorites"
request GET "/favorites" "" "$BUYER_TOKEN"
echo

section "DELETE /favorites/:id"
request DELETE "/favorites/$FAV_ID" "" "$BUYER_TOKEN"
echo

section "POST /messages"
MSG=$(request POST "/messages" "{\"itemId\":\"$ITEM_ID\",\"recipientId\":\"$BUYER_ID\",\"body\":\"Hello from seller\"}" "$SELLER_TOKEN")
echo "$MSG"

section "GET /messages (threads)"
THREADS=$(request GET "/messages" "" "$BUYER_TOKEN")
echo "$THREADS"
THREAD_ID=$(get_field "$THREADS" "['data'][0]['id']") || {
  echo "ERROR: thread id missing"
  echo "$THREADS"
  exit 1
}

section "GET /messages?threadId"
MSGS=$(request GET "/messages?threadId=$THREAD_ID" "" "$BUYER_TOKEN")
echo "$MSGS"
MSG_ID=$(get_field "$MSGS" "['data'][0]['id']") || {
  echo "ERROR: message id missing"
  echo "$MSGS"
  exit 1
}

section "PATCH /messages/:id/read"
request PATCH "/messages/$MSG_ID/read" "" "$BUYER_TOKEN"
echo

section "POST /orders"
ORDER=$(request POST "/orders" "{\"itemId\":\"$ITEM_ID\",\"total\":99}" "$BUYER_TOKEN")
echo "$ORDER"
ORDER_ID=$(get_field "$ORDER" "['data']['id']") || {
  echo "ERROR: order id missing"
  echo "$ORDER"
  exit 1
}

section "GET /orders?role=buyer"
request GET "/orders?role=buyer" "" "$BUYER_TOKEN"
echo

section "PATCH /orders/:id/status"
request PATCH "/orders/$ORDER_ID/status" "{\"status\":\"ACCEPTED\"}" "$SELLER_TOKEN"
echo

section "DELETE /items/:id"
request DELETE "/items/$ITEM_ID" "" "$SELLER_TOKEN"
echo
