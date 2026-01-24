# CircuLink API 文档（当前实现）

本文档描述 `server/src` 当前已实现的 REST API。基础约定与错误格式请见 `docs/foundation.md`。

## Base URL
- 本地：`http://localhost:4000/api`

## 通用
- 认证：`Authorization: Bearer <accessToken>`
- 分页：`page`、`pageSize`

## 版本与指标
### GET /version
返回当前版本与运行信息。

示例响应：
```json
{
  "data": {
    "version": "0.0.0",
    "node": "v22.x",
    "uptime": 123
  }
}
```

### GET /metrics
返回请求量/耗时统计。

示例响应：
```json
{
  "data": {
    "startedAt": "2026-01-24T00:00:00.000Z",
    "totalRequests": 42,
    "averageMs": 12.5,
    "maxMs": 88.1,
    "routes": [
      { "route": "GET /api/items", "count": 10, "averageMs": 9.2, "maxMs": 21.4 }
    ]
  }
}
```

## 认证 Auth
### POST /auth/register
请求：
```json
{ "email": "user@demo.dev", "password": "password123", "name": "User" }
```
响应：
```json
{ "user": { "id": "...", "email": "...", "name": "...", "role": "USER" },
  "tokens": { "accessToken": "...", "refreshToken": "..." } }
```

### POST /auth/login
请求：
```json
{ "email": "user@demo.dev", "password": "password123" }
```
响应同 register。

### POST /auth/refresh
请求：
```json
{ "refreshToken": "..." }
```
响应：
```json
{ "tokens": { "accessToken": "...", "refreshToken": "..." } }
```

### POST /auth/logout
请求：
```json
{ "refreshToken": "..." }
```
响应：204

### GET /auth/me
需要登录。响应：
```json
{ "user": { "id": "...", "email": "...", "name": "...", "role": "USER" } }
```

### POST /auth/verify/request
请求：
```json
{ "email": "user@demo.dev" }
```
响应：
```json
{ "data": { "token": "...", "expiresAt": "..." } }
```

### POST /auth/verify
请求：
```json
{ "token": "..." }
```
响应：204

### POST /auth/password/forgot
请求：
```json
{ "email": "user@demo.dev" }
```
响应：
```json
{ "data": { "token": "...", "expiresAt": "..." } }
```

### POST /auth/password/reset
请求：
```json
{ "token": "...", "password": "newpassword123" }
```
响应：204

## 分类 Categories
### GET /categories
响应：
```json
{ "data": [ { "id": "...", "name": "...", "slug": "..." } ] }
```

## 商品 Items
### GET /items
查询参数：`categoryId` `q` `minPrice` `maxPrice` `condition` `status` `sellerId` `sort` `order` `page` `pageSize`

### GET /items/:id

### POST /items
需要登录。
请求：
```json
{ "title": "...", "description": "...", "price": 99, "condition": "GOOD", "status": "ACTIVE", "categoryId": "...", "images": [] }
```

### PATCH /items/:id
需要登录。

### DELETE /items/:id
需要登录。

## 收藏 Favorites
### GET /favorites
需要登录。

### POST /favorites
请求：
```json
{ "itemId": "..." }
```

### DELETE /favorites/:id

## 消息 Messages
### GET /messages
需要登录。
- 若传 `threadId`：返回消息列表
- 不传 `threadId`：返回会话列表

### POST /messages
请求：
```json
{ "threadId": "...", "body": "..." }
```
或创建新会话：
```json
{ "itemId": "...", "recipientId": "...", "body": "..." }
```

### PATCH /messages/:id/read

## 订单 Orders
### POST /orders
请求：
```json
{ "itemId": "...", "total": 99 }
```

### GET /orders
查询参数：`role`(buyer|seller) `status` `page` `pageSize`

### PATCH /orders/:id/status
请求：
```json
{ "status": "ACCEPTED" }
```

## 上传 Uploads
### POST /uploads
需要登录，`multipart/form-data`，字段名：`file`。
响应：
```json
{ "data": { "path": "/uploads/2026/01/24/xxx.png" } }
```

## 枚举（当前后端）
- Condition: `NEW` `LIKE_NEW` `GOOD` `FAIR`
- ItemStatus: `DRAFT` `ACTIVE` `SOLD` `ARCHIVED`
- OrderStatus: `PENDING` `ACCEPTED` `REJECTED` `PAID` `SHIPPED` `COMPLETED` `CANCELLED`
