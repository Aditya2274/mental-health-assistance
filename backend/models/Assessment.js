// backend/models/Assessment.js
import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  raterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  instrument: { type: String, enum: ["SDQ", "PHQ-A", "GAD-7", "PSC-17"] },

  responses: Object,
  totalScore: Number,

  riskLevel: { type: String, enum: ["low", "medium", "high"] },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Assessment", assessmentSchema);
