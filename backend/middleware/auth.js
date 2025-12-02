// backend/middleware/auth.js
import User from "../models/User.js";
import { redisClient } from "../config/redisClient.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "session_id";

export default async function auth(req, res, next) {
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
    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    req.session = { id: sessionId, ...parsed };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    req.user = null;
    next();
  }
}
