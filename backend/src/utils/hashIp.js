const crypto = require("crypto");

function hashIp(req) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown";
  return crypto.createHash("sha256").update(ip).digest("hex");
}

module.exports = hashIp;
