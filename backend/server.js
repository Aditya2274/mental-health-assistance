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
import teacherRouter from "./routes/teacherRoutes.js";
import counsellorRoutes from "./routes/counsellorRoutes.js";
import parentRoutes from "./routes/parentRoutes.js"
import chatRoutes from "./routes/ChatRoutes.js";
console.log(1);
dotenv.config();
createDefaultAdmin();
console.log(2);
const app = express();
app.use(express.json());
console.log(3);
app.use(express.urlencoded({ extended: true }));
console.log(4);
app.use(cookieParser());
console.log(5);
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
console.log(6);
app.options(/.*/, cors());
console.log(7);
async function start() {
  try {
    await connectDB();
    await connectRedis();
    console.log(8);
    app.get("/", (req, res) => {
     res.send("Mental Health Assistance Backend is running");
    });
    app.use("/admin", adminRoutes);
    app.use("/auth", authRoutes);
    console.log(9);
    app.use("/assessment", assessmentRoutes);
    console.log(10);
    app.use("/alerts", alertRoutes);
    app.use("/parent", parentRoutes);
    app.use("/children", childRoutes);
    app.use("/tasks", taskRoutes);
    app.use("/teacher",teacherRouter);
    app.use("/counsellor", counsellorRoutes);
    app.use("/chat", chatRoutes);
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
