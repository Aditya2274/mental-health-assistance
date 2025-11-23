// backend/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import main from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
// other imports...

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
main();

// mount
app.use("/auth", authRoutes);

// mount other api routes...
// app.use("/children", childRoutes);
// app.use("/assessment", assessmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
