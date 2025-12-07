// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redisClient.js";
import authRoutes from "./routes/authRoutes.js";
import {auth} from "./middleware/auth.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import { createDefaultAdmin } from "./utils/createDefaultAdmin.js";
import adminRoutes from "./routes/adminRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import counsellorRoutes from "./routes/counsellorRoutes.js";
dotenv.config();
createDefaultAdmin();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

async function start() {
  try {
    await connectDB();
    await connectRedis();
    
    app.use("/admin", adminRoutes);
    app.use("/auth", authRoutes);
    app.use("/assessment", assessmentRoutes);
    app.use("/alerts", alertRoutes);
    app.use("/children", childRoutes);
    app.use("/tasks", taskRoutes);
    app.use("/counsellor", counsellorRoutes);
    // Example protected endpoint
    app.get("/protected", auth, (req, res) => {
      if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
      res.json({ msg: "You reached a protected endpoint", user: req.user });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
