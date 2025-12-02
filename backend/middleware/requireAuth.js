// backend/middleware/requireAuth.js
export default function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
  next();
}
