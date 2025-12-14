import express from "express";
import Task from "../models/Task.js";
import { auth, teacherOnly, counsellorOnly } from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

// Teacher creates task
router.post("/", teacherOnly, async (req, res) => {
  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id
  });
  res.json({ task });
});

// Get tasks for teachers/counsellors
router.get("/", async (req, res) => {
  const tasks = await Task.find().populate("childId assignedTo");
  res.json({ tasks });
});

// Update task status
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ task: updated });
});

export default router;