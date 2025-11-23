// backend/models/Child.js
import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,

  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  consents: {
    parentalConsent: { type: Boolean, default: false },
    consentDate: Date,
  },
});

export default mongoose.model("Child", childSchema);
