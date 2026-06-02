import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
dotenv.config();
  export const createDefaultAdmin = async () => {
    try {
      const existing = await User.findOne({ role: "admin" });

      if (existing) {
        console.log("Admin already exists:", existing.email);
        return;
      }

      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const admin = await User.create({
        name: process.env.ADMIN_USER,
        email: process.env.ADMIN_MAIL,
        password: hashed,
        role: "admin"
      });

      console.log("Default admin created:", admin.email);
    } catch (err) {
      console.error("Failed to create default admin:", err);
    }
  };
