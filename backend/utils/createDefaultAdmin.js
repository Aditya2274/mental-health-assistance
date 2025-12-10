  import User from "../models/User.js";
  import bcrypt from "bcryptjs";

  export const createDefaultAdmin = async () => {
    try {
      const existing = await User.findOne({ role: "admin" });

      if (existing) {
        console.log("Admin already exists:", existing.email);
        return;
      }

      const hashed = await bcrypt.hash("Adityaismyname@22", 10);

      const admin = await User.create({
        name: "Aditya2274",
        email: "adityaashoksingh7@gmail.com",
        password: hashed,
        role: "admin"
      });

      console.log("Default admin created:", admin.email);
    } catch (err) {
      console.error("Failed to create default admin:", err);
    }
  };
