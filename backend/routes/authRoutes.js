// backend/routes/authRoutes.js
import express from "express";
import { register, login, me, logout, googleAuth, googleCallback } from "../controllers/authController.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/logout", auth, logout);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
