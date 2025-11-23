// backend/middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Expects Authorization header to contain the token (just the token string)
 * Example: Authorization: eyJhbGciOi...
 */
export default function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contains { id, role, iat, exp }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid" });
  }
}
