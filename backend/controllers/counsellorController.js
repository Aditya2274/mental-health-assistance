// backend/controllers/counsellorController.js
import Alert from "../models/Alert.js";
import Assessment from "../models/Assessment.js";
import Child from "../models/Child.js";
import CaseNote from "../models/CaseNote.js";
import User from "../models/User.js";

/**
 * Get alerts relevant for counsellor:
 * - by default counsellor sees high severity alerts and unassigned alerts
 */
export const getCounsellorAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      $or: [
        { severity: "high" },
        { assignedTo: req.user._id },
        { assignedTo: null }
      ]
    })
      .populate("childId", "name age grade parentId")
      .populate("assessmentId")
      .sort({ createdAt: -1 });

    res.json({ alerts });
  } catch (err) {
    console.error("getCounsellorAlerts:", err);
    res.status(500).json({ msg: "Failed to load alerts" });
  }
};

export const getRecentAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("childId", "name age grade")
      .populate("raterId", "name role email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ assessments });
  } catch (err) {
    console.error("getRecentAssessments:", err);
    res.status(500).json({ msg: "Failed to load assessments" });
  }
};

export const getChild = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).populate("parentId", "name email");
    if (!child) return res.status(404).json({ msg: "Child not found" });
    const assessments = await Assessment.find({ childId: child._id }).sort({ createdAt: -1 });
    const notes = await CaseNote.find({ childId: child._id }).populate("counsellorId", "name");
    res.json({ child, assessments, notes });
  } catch (err) {
    console.error("getChild:", err);
    res.status(500).json({ msg: "Failed to load child profile" });
  }
};

/**
 * Get full assessment details (raw responses) for counsellor review
 */
export const getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate("childId", "name age grade parentId")
      .populate("raterId", "name email role");
    if (!assessment) return res.status(404).json({ msg: "Assessment not found" });
    res.json({ assessment });
  } catch (err) {
    console.error("getAssessment:", err);
    res.status(500).json({ msg: "Failed to load assessment" });
  }
};

/**
 * Create a case note (counsellor writes notes, intervention plan)
 */
export const createCaseNote = async (req, res) => {
  try {
    const { childId, assessmentId, note, actionPlan, followUpDate } = req.body;
    if (!childId || !note) return res.status(400).json({ msg: "childId and note required" });

    const cn = await CaseNote.create({
      childId,
      assessmentId: assessmentId || null,
      note,
      actionPlan: actionPlan || "",
      followUpDate: followUpDate || null,
      counsellorId: req.user._id
    });

    res.json({ msg: "Case note created", caseNote: cn });
  } catch (err) {
    console.error("createCaseNote:", err);
    res.status(500).json({ msg: "Failed to create case note" });
  }
};

/**
 * Assign alert to a counsellor (or to self)
 */
export const assignAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body; // optional; default -> req.user._id
    const alert = await Alert.findByIdAndUpdate(
      id,
      { assignedTo: assignedTo || req.user._id, status: "assigned" },
      { new: true }
    );
    res.json({ msg: "Alert assigned", alert });
  } catch (err) {
    console.error("assignAlert:", err);
    res.status(500).json({ msg: "Failed to assign alert" });
  }
};

/**
 * Resolve alert
 */
export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    const alert = await Alert.findByIdAndUpdate(
      id,
      { status: "resolved", resolutionNotes: resolutionNotes || "", resolvedAt: new Date() },
      { new: true }
    );
    res.json({ msg: "Alert resolved", alert });
  } catch (err) {
    console.error("resolveAlert:", err);
    res.status(500).json({ msg: "Failed to resolve alert" });
  }
};

/**
 * Search children or assessments by query (for counsellor quick search)
 */
export const search = async (req, res) => {
  try {
    const q = req.query.q || "";
    const children = await Child.find({ name: { $regex: q, $options: "i" } }).limit(30);
    const assessments = await Assessment.find({ "responses": { $exists: true } })
      .populate("childId", "name")
      .limit(30);
    res.json({ children, assessments });
  } catch (err) {
    console.error("counsellor search:", err);
    res.status(500).json({ msg: "Search failed" });
  }
};
