// backend/middleware/auth.js
import User from "../models/User.js";
import { redisClient } from "../config/redisClient.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "session_id";

/**
 * Load user from Redis + cookie
 */
export const auth = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.[COOKIE_NAME];
    if (!sessionId) {
      req.user = null;
      return next();
    }

    const redisKey = `sess:${sessionId}`;
    const data = await redisClient.get(redisKey);

    if (!data) {
      req.user = null;
      return next();
    }

    const parsed = JSON.parse(data);
    const userId = parsed.userId;

    const user = await User.findById(userId).select("-password");

    req.user = user || null;
    req.session = { id: sessionId, ...parsed };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    req.user = null;
    next();
  }
};

/**
 * Require authentication
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Not authenticated" });
  }
  next();
};

/**
 * Role-based restrictions
 */
export const parentOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "parent") {
    return res.status(403).json({ msg: "Parents only" });
  }
  next();
};

export const teacherOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({ msg: "Teachers only" });
  }
  next();
};

export const counsellorOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "counsellor") {
    return res.status(403).json({ msg: "Counsellors only" });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admins only" });
  }
  next();
};
