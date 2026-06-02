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
  const children=await Child.find()
  .populate("parentId", "name email")
  .populate("assignedTeacher", "name email");

  res.json({ children });
});
adminRouter.get("/children/:id", async (req, res) => {
  const child = await Child.findById(req.params.id)
    .populate("parentId", "name email")
    .populate("assignedTeacher", "name email");

  if (!child) return res.status(404).json({ msg: "Child not found" });

  res.json({ child });
});

// Assign teacher to a child
adminRouter.put("/children/:id/assign-teacher", async (req, res) => {
  try {
    const { teacherId } = req.body;

    if (!teacherId)
      return res.status(400).json({ msg: "teacherId is required" });

    const child = await Child.findByIdAndUpdate(
      req.params.id,
      { assignedTeacher: teacherId },
      { new: true }
    ).populate("assignedTeacher", "name email");

    if (!child) return res.status(404).json({ msg: "Child not found" });

    res.json({ msg: "Teacher assigned successfully", child });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to assign teacher" });
  }
});

// Delete child
adminRouter.delete("/children/:id", async (req, res) => {
  try {
    const childId = req.params.id;

    // 1. Verify child exists
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ msg: "Child not found" });
    }

    // 2. Cascade delete
    await Promise.all([
      Assessment.deleteMany({ childId }),
      Alert.deleteMany({ childId }),
      CaseNote.deleteMany({ childId }),
      Task.deleteMany({ childId }),
      Checkin.deleteMany({ childId })
    ]);

    // 3. Delete child
    await Child.findByIdAndDelete(childId);

    res.json({ msg: "Child and all related data deleted" });
  } catch (err) {
    console.error("Admin delete child:", err);
    res.status(500).json({ msg: "Failed to delete child" });
  }
});


// System alerts
adminRouter.get("/alerts", async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "childId",
        populate: { path: "parentId", select: "name email" }
      })
      .populate("assessmentId")
      .populate("assignedTo", "name email role");
     const cleanalerts=alerts.filter(a=>a.childId)
    res.json({ alerts: cleanalerts});
  } catch (err) {
    console.error("Admin Alerts Error:", err);
    res.status(500).json({ msg: "Failed to load alerts" });
  }
});
//Edit Alerts
adminRouter.put("/alerts/:id", async (req, res) => {
  try {
    const { assignedTo, status, resolutionNotes } = req.body;

    const updated = await Alert.findByIdAndUpdate(
      req.params.id,
      { assignedTo, status, resolutionNotes },
      { new: true }
    )
      .populate("childId")
      .populate("assignedTo", "name email")
      .populate("assessmentId");

    res.json({ msg: "Alert updated", alert: updated });
  } catch (err) {
    console.error("Admin Update Alert:", err);
    res.status(500).json({ msg: "Failed to update alert" });
  }
});

adminRouter.get("/children/:id/profile",async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid child ID" });

    const child = await Child.findById(id)
      .populate("parentId", "name email")
      .populate("assignedTeacher", "name email");

    if (!child) return res.status(404).json({ msg: "Child not found" });

    const assessments = await Assessment.find({ childId: id })
      .sort({ createdAt: -1 })
      .select("instrument totalScore riskLevel createdAt");

    const alerts = await Alert.find({ childId: id })
      .sort({ createdAt: -1 })
      .select("severity status createdAt");

    res.json({ child, assessments, alerts });

  } catch (err) {
    console.error("Admin child profile:", err);
    res.status(500).json({ msg: "Failed to load child profile" });
  }
});
export default adminRouter;
