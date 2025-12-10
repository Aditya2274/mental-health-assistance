import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  raterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  instrument: { type: String, required: true }, // PHQ-A, GAD-7, SDQ, etc.
  responses: { type: Object, required: true },
  totalScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ["low", "medium", "high"], default: "low" },
}, { timestamps: true });

export default mongoose.model("Assessment", assessmentSchema);
