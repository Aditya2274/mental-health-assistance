// backend/models/CaseNote.js
import mongoose from "mongoose";

const caseNoteSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment", default: null },
  note: { type: String, required: true },
  actionPlan: { type: String, default: "" },
  followUpDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("CaseNote", caseNoteSchema);
