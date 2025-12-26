const crypto = require("crypto");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const globalKeypair = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" }
});

let lastMockAuth = null;

const buildAuthPayload = (auth) => {
  const clientUuid = crypto.randomUUID();
  const authToken = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    client_uuid: clientUuid,
    session_public_key: "mock-session-key",
    auth_token: authToken,
    expires_at: expiresAt,
    client_netid: auth.netid,
    client_affiliation: auth.affiliation,
    client_name: auth.name
  };
};

const encryptPayload = (aesKey, clientUuid, payload) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
  cipher.setAAD(Buffer.from(clientUuid));

  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  return {
    nonce: iv.toString("base64"),
    encrypted_data: Buffer.concat([ciphertext, authTag]).toString("base64")
  };
};

app.get("/api/auth/mock-init", (req, res) => {
  const netid = req.get("uid");
  const name = req.get("displayname");
  const affiliation = req.get("affiliation");

  if (!netid) {
    return res.status(401).json({ error: "Mock Authentication is required" });
  }

  lastMockAuth = {
    netid,
    name: name || "Mock User",
    affiliation: affiliation || "student"
  };

  return res.json({
    status: "authenticated",
    global_public_key: globalKeypair.publicKey
  });
});

app.post("/api/auth/key-exchange", (req, res) => {
  const encryptedKey = req.body?.AES_key;

  if (!encryptedKey) {
    return res.status(400).json({ error: "AES_key is required" });
  }

  if (!lastMockAuth) {
    return res.status(401).json({ error: "Mock Authentication is required" });
  }

  try {
    const aesKey = crypto.privateDecrypt(
      {
        key: globalKeypair.privateKey,
        oaepHash: "sha256"
      },
      Buffer.from(encryptedKey, "base64")
    );

    const payload = buildAuthPayload(lastMockAuth);
    const encrypted = encryptPayload(aesKey, payload.client_uuid, payload);

    return res.json({
      client_uuid: payload.client_uuid,
      nonce: encrypted.nonce,
      encrypted_data: encrypted.encrypted_data
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/mock/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/mock-login.html"));
});

app.get("/mock/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/mock-dashboard.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
  console.log(`Mock login server running on http://localhost:${port}`);
});
