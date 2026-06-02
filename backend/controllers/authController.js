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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

/**
 * Google OAuth - Initiate login
 * Redirects user to Google OAuth consent screen
 */
export const googleAuth = async (req, res) => {
  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ msg: "Google OAuth not configured" });
    }

    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = "openid email profile";
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

    res.json({ authUrl: googleAuthUrl });
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Google OAuth - Handle callback
 * Exchange code for token, get user info, create/login user
 */
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    const redirectUri = process.env.GOOGLE_CALLBACK_URL

    if (!code) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=no_code`);
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=not_configured`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();
    const { access_token } = tokens;

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoResponse.ok) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=user_info_failed`);
    }

    const googleUser = await userInfoResponse.json();
    const { email, name, picture } = googleUser;

    if (!email) {
      return res.redirect(`${FRONTEND_ORIGIN}/login?error=no_email`);
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Create new user with Google OAuth (no password required)
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase().trim(),
        password: "", // Google OAuth users don't need password
        role: "parent", // Default role, can be changed later
      });
    }

    // Create session
    const sessionId = uuidv4();
    const redisKey = `sess:${sessionId}`;

    await redisClient.set(redisKey, JSON.stringify({ userId: String(user._id), role: user.role }), {
      EX: 60 * 60 * 24 * (Number(process.env.COOKIE_MAX_AGE_DAYS) || 7),
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    };

    res.cookie(COOKIE_NAME, sessionId, cookieOptions);

    // Redirect based on role
    const roleRedirect = {
      parent: "/parent",
      teacher: "/teacher",
      counsellor: "/counsellor",
      admin: "/admin",
    };

    res.redirect(`${FRONTEND_ORIGIN}${roleRedirect[user.role] || "/parent"}`);
  } catch (err) {
    console.error("Google callback error:", err);
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
    return res.redirect(`${FRONTEND_ORIGIN}/login?error=server_error`);
  }
};
