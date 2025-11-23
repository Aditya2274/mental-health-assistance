// backend/models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },

  severity: { type: String, enum: ["medium", "high"] },
  status: { type: String, enum: ["pending", "assigned", "resolved"], default: "pending" },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Alert", alertSchema);
