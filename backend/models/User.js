// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, default: "" }, // Empty for Google OAuth users
  role: { type: String, enum: ["parent", "teacher", "counsellor", "admin"], default: "parent" },
  googleId: { type: String, sparse: true }, // Optional Google ID
});

export default mongoose.model("User", userSchema);
