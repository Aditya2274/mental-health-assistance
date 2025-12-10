// backend/models/Checkin.js
import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: () => new Date() }, // date of check-in (week)
  rating: { type: Number, min: 0, max: 10, default: 5 }, // teacher rating 0-10
  notes: { type: String, default: "" },
  actions: { type: String, default: "" } // suggested actions / follow-up
}, { timestamps: true });

export default mongoose.model("Checkin", checkinSchema);
