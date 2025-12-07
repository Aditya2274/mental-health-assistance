// backend/routes/adminRoutes.js
import express from "express";
import { auth, requireAuth, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Child from "../models/Child.js";
import Alert from "../models/Alert.js";

const adminRouter = express.Router();

// Load user from session cookie
adminRouter.use(auth);

// Only allow authenticated users
adminRouter.use(requireAuth);

// Only allow admins
adminRouter.use(adminOnly);

// Get all users
adminRouter.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

// Delete a user
adminRouter.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

// Get all children
adminRouter.get("/children", async (req, res) => {
  const children = await Child.find().populate("parentId", "name email");
  res.json({ children });
});

// Delete child
adminRouter.delete("/children/:id", async (req, res) => {
  await Child.findByIdAndDelete(req.params.id);
  res.json({ msg: "Child deleted" });
});

// System alerts
adminRouter.get("/alerts", async (req, res) => {
  const alerts = await Alert.find()
  .populate({
    path: "childId",               // STEP 1: replace ObjectId with full Child
    populate: {
      path: "parentId",            // STEP 2: inside the Child document, populate parentId
      select: "name email"
    }
  });

  res.json({ alerts });
});

export default adminRouter;
