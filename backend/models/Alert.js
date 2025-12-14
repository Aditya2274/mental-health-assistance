// backend/models/Alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },

    severity: { type: String, enum: ["medium", "high"], required: true },

    status: {
      type: String,
      enum: ["pending", "assigned", "resolved"],
      default: "pending"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    orphaned: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },
    resolutionNotes: { type: String, default: "" }
  },
  { timestamps: true } 
);

export default mongoose.model("Alert", alertSchema);
