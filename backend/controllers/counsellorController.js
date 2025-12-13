// backend/controllers/counsellorController.js
import Alert from "../models/Alert.js";
import Assessment from "../models/Assessment.js";
import Child from "../models/Child.js";
import CaseNote from "../models/CaseNote.js";
import User from "../models/User.js";
import Checkin from "../models/Checkin.js"
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
      .populate({
        path: "childId",
        select: "name age grade parentId"
      })
      .populate({
        path: "assessmentId",
        select: "instrument totalScore riskLevel createdAt"
      })
      .sort({ createdAt: -1 })
      .lean();

    // Attach lastAssessment safe fallback
    const alertsWithLast = alerts.map(a => {
      return {
        ...a,
        lastAssessment: a.assessmentId || null
      };
    });
    const cleanAlerts = alertsWithLast.filter(a => a.childId);
    res.json({ alerts: cleanAlerts });

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
      // Filter out orphan assessments
      const validAssessments = assessments.filter(a => a.childId);
      res.json({ assessments: validAssessments });
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
export const getCheckinsForCounsellor = async (req, res) => {
  try {
    const { childId } = req.query;

    const filter = {};
    if (childId) filter.childId = childId;

    const checkins = await Checkin.find(filter)
      .populate("childId", "name age grade")
      .populate("teacherId", "name email")
      .sort({ date: -1 });

    res.json({ checkins });
  } catch (err) {
    console.error("Counsellor get checkins:", err);
    res.status(500).json({ msg: "Failed to load check-ins" });
  }
};

export const getAllChildrenForCounsellor = async (req, res) => {
  try {
    // Fetch all children (you can later filter by assigned counsellor)
    const children = await Child.find()
      .populate("parentId", "name email")
      .populate("assignedTeacher", "name email")
      .lean();  // lean() returns plain JS objects → easier to attach fields

    // For each child, fetch their most recent assessment
    const enhanced = await Promise.all(
      children.map(async (child) => {
        const last = await Assessment.findOne({ childId: child._id })
          .sort({ createdAt: -1 })
          .select("_id riskLevel totalScore createdAt");

        return {
          ...child,
          lastAssessment: last || null,
        };
      })
    );

    return res.json({ children: enhanced });

  } catch (err) {
    console.error("Counsellor get children error:", err);
    res.status(500).json({ msg: "Failed to load children" });
  }
};