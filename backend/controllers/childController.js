// backend/controllers/childController.js
import Child from "../models/Child.js";
import Assessment from "../models/Assessment.js";
import Alert from "../models/Alert.js";
import mongoose from "mongoose";

export const addChild = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    const { name, age, grade } = req.body;
    if (!name || !age || !grade) return res.status(400).json({ msg: "Missing fields" });

    const child = await Child.create({
      name,
      age,
      grade,
      parentId: req.user._id,
      consents: { parentalConsent: true, consentDate: new Date() }
    });

    return res.status(201).json({ msg: "Child added", child });
  } catch (err) {
    console.error("Add child error:", err);
    return res.status(500).json({ msg: err.message });
  }
};
export const getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id).lean();

    if (!child) return res.status(404).json({ msg: "Child not found" });

    res.json({ child });   // ← IMPORTANT FIX
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getMyChildren = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    const children = await Child.find({ parentId: req.user._id }).sort({ name: 1 });
    return res.json({children});
  } catch (err) {
    console.error("Get children error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const getChildDetails = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid id" });

    const child = await Child.findById(id);
    if (!child) return res.status(404).json({ msg: "Child not found" });
    if (String(child.parentId) !== String(req.user._id)) return res.status(403).json({ msg: "Forbidden" });

    // fetch assessments and alerts for this child
    const assessments = await Assessment.find({ childId: id }).sort({ createdAt: -1 });
    const alerts = await Alert.find({ childId: id }).sort({ createdAt: -1 });

    return res.json({ child, assessments, alerts });
  } catch (err) {
    console.error("Get child details error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const updateChild = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    const { id } = req.params;
    const { name, age, grade } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid id" });

    const child = await Child.findById(id);
    if (!child) return res.status(404).json({ msg: "Child not found" });
    if (String(child.parentId) !== String(req.user._id)) return res.status(403).json({ msg: "Forbidden" });

    child.name = name ?? child.name;
    child.age = age ?? child.age;
    child.grade = grade ?? child.grade;
    await child.save();

    return res.json({ msg: "Child updated", child });
  } catch (err) {
    console.error("Update child error:", err);
    return res.status(500).json({ msg: err.message });
  }
};

export const deleteChild = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "Invalid id" });

    const child = await Child.findById(id);
    if (!child) return res.status(404).json({ msg: "Child not found" });
    if (String(child.parentId) !== String(req.user._id)) return res.status(403).json({ msg: "Forbidden" });

    // optional: remove assessments & alerts for the child (or keep for audit)
    await Assessment.deleteMany({ childId: id });
    await Alert.deleteMany({ childId: id });

    await child.deleteOne();

    return res.json({ msg: "Child deleted" });
  } catch (err) {
    console.error("Delete child error:", err);
    return res.status(500).json({ msg: err.message });
  }
};
