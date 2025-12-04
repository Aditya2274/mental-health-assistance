// backend/controllers/assessmentController.js
import Assessment from "../models/Assessment.js";
import Alert from "../models/Alert.js";
import { calculateRisk } from "../utils/scoring.js";

export const submitAssessment = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    const { childId, instrument, responses, totalScore } = req.body;

    if (!childId || !instrument || !responses) {
      return res.status(400).json({ msg: "Missing assessment data" });
    }

    // Calculate risk level from scoring.js
    const riskLevel = calculateRisk(instrument, totalScore);

    // Save assessment
    const assessment = await Assessment.create({
      childId,
      raterId: user._id,
      instrument,
      responses,
      totalScore,
      riskLevel,
    });

    // If medium or high, create an alert
    if (riskLevel !== "low") {
      await Alert.create({
        childId,
        assessmentId: assessment._id,
        severity: riskLevel,
        status: "pending",
      });
    }

    return res.status(201).json({
      msg: "Assessment submitted successfully",
      assessment,
    });
  } catch (err) {
    console.error("Assessment submit error:", err);
    return res.status(500).json({ msg: err.message });
  }
};
export const getChildAssessments = async (req, res) => {
  try {
    const { childId } = req.params;

    const assessments = await Assessment.find({ childId })
      .sort({ createdAt: -1 });

    res.json({ assessments });
  } catch (err) {
    console.error("Get assessments error:", err);
    res.status(500).json({ msg: "Failed to fetch assessments" });
  }
};
