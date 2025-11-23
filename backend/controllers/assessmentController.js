// backend/controllers/assessmentController.js
import Assessment from "../models/Assessment.js";
import Alert from "../models/Alert.js";
import { calculateRisk } from "../utils/scoring.js";

export const submitAssessment = async (req, res) => {
  try {
    const { childId, instrument, responses, totalScore } = req.body;

    const risk = calculateRisk(instrument, totalScore);

    const assessment = await Assessment.create({
      childId,
      raterId: req.user.id,
      instrument,
      responses,
      totalScore,
      riskLevel: risk,
    });

    // If risk is medium or high, create an alert
    if (risk !== "low") {
      await Alert.create({
        childId,
        assessmentId: assessment._id,
        severity: risk,
      });
    }

    res.json({ message: "Assessment submitted", assessment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
