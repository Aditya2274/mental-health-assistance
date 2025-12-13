import Assessment from "../models/Assessment.js";
import Alert from "../models/Alert.js";
import { calculateRisk } from "../utils/scoring.js";
import mongoose from "mongoose";

/**
 * Submit an assessment
 */
export const submitAssessment = async (req, res) => {
  try {
    const user = req.user;
    const { childId, instrument, responses, totalScore } = req.body;

    if (!childId || !instrument || !responses)
      return res.status(400).json({ msg: "Missing assessment data" });

    // Calculate risk level
    const riskLevel = calculateRisk(instrument, totalScore || 0);

    // Save in DB
    const assessment = await Assessment.create({
      childId,
      raterId: user._id,
      instrument,
      responses,
      totalScore,
      riskLevel,
    });

    // Auto-create alerts for counsellors
    if (riskLevel === "medium" || riskLevel === "high") {
      await Alert.create({
        childId,
        assessmentId: assessment._id,
        severity: riskLevel,
        status: "pending",
      });
    }

    res.status(201).json({
      msg: "Assessment submitted",
      assessment,
    });

  } catch (err) {
    console.error("Assessment submit error:", err);
    res.status(500).json({ msg: "Failed to submit assessment" });
  }
};


/**
 * Get one assessment by ID (for counsellor review)
 */
export const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid assessment ID"});

    const assessment = await Assessment.findById(id)
      .populate("childId", "name age grade parentId")
      .populate("raterId", "name role email");

    if (!assessment)
      return res.status(404).json({ msg: "Assessment not found" });

    res.json({ assessment });

  } catch (err) {
    console.error("Get assessment error:", err);
    res.status(500).json({ msg: "Failed to load assessment" });
  }
};


/**
 * Get all assessments for a child
 */
export const getAssessmentsForChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId))
      return res.status(400).json({ msg: "Invalid child ID" });

    const assessments = await Assessment.find({ childId })
      .populate("raterId", "name role")
      .sort({ createdAt: -1 });

    res.json({ assessments });

  } catch (err) {
    console.error("Get assessments error:", err);
    res.status(500).json({ msg: "Failed to load assessments" });
  }
};
/**
 * Counsellor dashboard – get recent risky assessments
 */
export const getRecentAssessments = async (req, res) => {
  try {
    const result = await Assessment.find({
      riskLevel: { $in: ["medium", "high"] }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("childId", "name age grade")
      .populate("raterId", "name role");
     const cleanassessment=result.filter(a=>a.childId);
    res.json({ assessments: cleanassessment });

  } catch (err) {
    console.error("Recent assessments error:", err);
    res.status(500).json({ msg: "Failed to load assessments" });
  }
};
