// backend/controllers/teacherController.js
import Assessment from "../models/Assessment.js";
import Checkin from "../models/Checkin.js";
import Child from "../models/Child.js";
import mongoose from "mongoose";

/**
 * Teacher behaviour assessment: creates an Assessment (instrument = "Teacher-Behavior")
 * POST /teacher/assessment
 * body: { childId, responses, totalScore }
 */
export const submitTeacherAssessment = async (req, res) => {
  try {
    const teacher = req.user;
    if (!teacher) return res.status(401).json({ msg: "Not authenticated" });

    const { childId, responses, totalScore } = req.body;
    if (!childId || !responses) return res.status(400).json({ msg: "Missing fields" });

    // ensure valid child id
    if (!mongoose.Types.ObjectId.isValid(childId)) return res.status(400).json({ msg: "Invalid childId" });

    const assessment = await Assessment.create({
      childId,
      raterId: teacher._id,
      instrument: "Teacher-Behavior",
      responses,
      totalScore,
      // you might calculate risk with existing scoring util; default low if not provided
      riskLevel: req.body.riskLevel || "low",
    });

    return res.status(201).json({ msg: "Teacher assessment submitted", assessment });
  } catch (err) {
    console.error("submitTeacherAssessment:", err);
    return res.status(500).json({ msg: "Failed to submit teacher assessment" });
  }
};

/**
 * Get recent teacher assessments (optionally filter by teacher)
 * GET /teacher/assessments/recent?teacherId=&limit=
 */
export const getRecentTeacherAssessments = async (req, res) => {
  try {
    const { teacherId } = req.query;
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const filter = {};
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) filter.raterId = teacherId;

    const assessments = await Assessment.find(filter)
      .populate("childId", "name age grade")
      .populate("raterId", "name email role")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ assessments });
  } catch (err) {
    console.error("getRecentTeacherAssessments:", err);
    res.status(500).json({ msg: "Failed to load assessments" });
  }
};
export const assessment=async (req, res) => {
  try {
    const assessments = await Assessment.find({ raterId: req.user._id })
      .populate("childId", "name age grade");

    res.json({ assessments });
  } catch (err) {
    console.error("Teacher assessments:", err);
    res.status(500).json({ msg: "Failed to load assessments" });
  }
}
/**
 * Create a weekly check-in
 * POST /teacher/checkin
 * body: { childId, date, rating, notes, actions }
 */
export const createCheckin = async (req, res) => {
  try {
    const teacher = req.user;
    if (!teacher) return res.status(401).json({ msg: "Not authenticated" });

    const { childId, date, rating, notes, actions } = req.body;
    if (!childId) return res.status(400).json({ msg: "childId required" });
    if (!mongoose.Types.ObjectId.isValid(childId)) return res.status(400).json({ msg: "Invalid childId" });

    const checkin = await Checkin.create({
      childId,
      teacherId: teacher._id,
      date: date ? new Date(date) : new Date(),
      rating: typeof rating === "number" ? rating : Number(rating || 0),
      notes: notes || "",
      actions: actions || ""
    });

    res.status(201).json({ msg: "Check-in created", checkin });
  } catch (err) {
    console.error("createCheckin:", err);
    res.status(500).json({ msg: "Failed to create checkin" });
  }
};

/**
 * Get all checkins (optionally filter by childId)
 * GET /teacher/checkins?childId=
 */
export const listCheckins = async (req, res) => {
  try {
    const { childId } = req.query;
    const filter = {};
    // By default teachers should see their own checkins
    if (req.user && req.user.role === "teacher") {
      filter.teacherId = req.user._id;
    }
    if (childId && mongoose.Types.ObjectId.isValid(childId)) filter.childId = childId;

    const checkins = await Checkin.find(filter)
      .populate("childId", "name age grade")
      .populate("teacherId", "name email")
      .sort({ date: -1, createdAt: -1 });

    res.json({ checkins });
  } catch (err) {
    console.error("listCheckins:", err);
    res.status(500).json({ msg: "Failed to load checkins" });
  }
};


export const updateCheckin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid id" });

    const update = req.body;
    const checkin = await Checkin.findByIdAndUpdate(id, update, { new: true });
    if (!checkin) return res.status(404).json({ msg: "Checkin not found" });

    res.json({ msg: "Checkin updated", checkin });
  } catch (err) {
    console.error("updateCheckin:", err);
    res.status(500).json({ msg: "Failed to update checkin" });
  }
};

export const deleteCheckin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid id" });

    await Checkin.findByIdAndDelete(id);
    res.json({ msg: "Checkin deleted" });
  } catch (err) {
    console.error("deleteCheckin:", err);
    res.status(500).json({ msg: "Failed to delete checkin" });
  }
};
export const childrenassessment=async (req, res) => {
  try {
    const children = await Child.find({ assignedTeacher: req.user._id })
      .populate("parentId", "name email");

    res.json({ children });
  } catch (err) {
    console.error("Teacher get children:", err);
    res.status(500).json({ msg: "Failed to load children" });
  }
};