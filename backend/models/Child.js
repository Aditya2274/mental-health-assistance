// backend/models/Child.js
import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,

  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  assignedTeacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    default: null 
  },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },
  consents: {
    parentalConsent: { type: Boolean, default: false },
    consentDate: Date,
  },
},{timestamps: true});

export default mongoose.model("Child", childSchema);
