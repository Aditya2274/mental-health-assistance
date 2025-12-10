import CaseNote from "../models/CaseNote.js";
import Assessment from "../models/Assessment.js";

export const getAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate("childId", "name age grade")
      .populate("raterId", "name role email");

    if (!assessment)
      return res.status(404).json({ msg: "Assessment not found" });

    res.json({ assessment });
  } catch (err) {
    console.error("getAssessment:", err);
    res.status(500).json({ msg: "Failed to load assessment" });
  }
};

export const createCaseNote = async (req, res) => {
  try {
    const { childId, assessmentId, note, actionPlan, followUpDate } = req.body;

    if (!childId || !note)
      return res.status(400).json({ msg: "childId and note required" });

    const cn = await CaseNote.create({
      childId,
      assessmentId: assessmentId || null,
      note,
      actionPlan,
      followUpDate,
      counsellorId: req.user._id
    });

    res.json({ msg: "Case note created", caseNote: cn });

  } catch (err) {
    console.error("createCaseNote:", err);
    res.status(500).json({ msg: "Failed to create case note" });
  }
};

export const getCaseNotesForChild = async (req, res) => {
  try {
    const notes = await CaseNote.find({ childId: req.params.childId })
      .populate("counsellorId", "name email")
      .sort({ createdAt: -1 });

    res.json({ notes });
  } catch (err) {
    console.error("get case notes:", err);
    res.status(500).json({ msg: "Failed to load case notes" });
  }
};
