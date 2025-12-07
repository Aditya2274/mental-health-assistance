import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);