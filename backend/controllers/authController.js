// backend/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../config/redisClient.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "session_id";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // ms

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email + password required" });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashed,
      role: role || "parent",
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.status(201).json({ msg: "Registered", user: safeUser });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email + password required" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // IMPORTANT: await bcrypt.compare so that password is actually verified.
    // Without await, `match` is a Promise which is always truthy, allowing any password.
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    // Create session id and store in Redis
    const sessionId = uuidv4();
    const redisKey = `sess:${sessionId}`;

    // Store user id and role (you can store whole user snapshot or small payload)
    await redisClient.set(redisKey, JSON.stringify({ userId: String(user._id), role: user.role }), {
      EX: 60 * 60 * 24 * (Number(process.env.COOKIE_MAX_AGE_DAYS) || 7), // expire in days
    });

    // Set secure cookie with session id
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    };

    res.cookie(COOKIE_NAME, sessionId, cookieOptions);

    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };

    return res.json({ msg: "Logged in", user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const me = async (req, res) => {
  try {
    // auth middleware attaches req.user
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

    const safeUser = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };

    return res.json({ user: safeUser });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const COOKIE_NAME_LOCAL = process.env.COOKIE_NAME || "session_id";
    const sessionId = req.cookies?.[COOKIE_NAME_LOCAL];

    if (sessionId) {
      const redisKey = `sess:${sessionId}`;
      await redisClient.del(redisKey);
    }

    // Clear cookie
    res.clearCookie(COOKIE_NAME_LOCAL, { path: "/" });
    return res.json({ msg: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ msg: err.message });
  }
};
