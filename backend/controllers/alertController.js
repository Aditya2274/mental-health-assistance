// backend/controllers/alertController.js
import Alert from "../models/Alert.js";
import Child from "../models/Child.js";
import User from "../models/User.js";

/**
 * Helper: generic list queries
 */
const findAlertsForChildren = async (childIds = []) => {
  return await Alert.find({ childId: { $in: childIds } }).sort({ createdAt: -1 }).lean();
};

/**
 * Parent: alerts for their children
 * GET /alerts/parent
 */
export const getAlertsForParent = async (req, res) => {
  try {
    const children = await Child.find({ parentId: req.user._id }).select("_id").lean();
    const childIds = children.map((c) => c._id);
    const alerts = await findAlertsForChildren(childIds);
    return res.json({ alerts });
  } catch (err) {
    console.error("getAlertsForParent:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Teacher: alerts for assigned students
 * GET /alerts/teacher
 * - For now returns all alerts. Later filter by teacher->students mapping.
 */
export const getAlertsForTeacher = async (req, res) => {
  try {
    // TODO: implement teacher->students mapping
    const alerts = await Alert.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ alerts });
  } catch (err) {
    console.error("getAlertsForTeacher:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Counsellor: alerts for their roster
 * GET /alerts/counsellor
 */
export const getAlertsForCounsellor = async (req, res) => {
  try {
    // TODO: implement counsellor-specific filtering
    const alerts = await Alert.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ alerts });
  } catch (err) {
    console.error("getAlertsForCounsellor:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Admin: system wide alerts
 * GET /alerts/admin
 */
export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({}).sort({ createdAt: -1 }).lean();
    return res.json({ alerts });
  } catch (err) {
    console.error("getAllAlerts:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Create alert manually (optional admin/auto)
 * POST /alerts
 * body: { childId, message, level } 
 */
export const createAlert = async (req, res) => {
  try {
    const { childId, message, level } = req.body;
    const alert = await Alert.create({ childId, message, level });
    return res.status(201).json({ alert });
  } catch (err) {
    console.error("createAlert:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/**
 * Mark as read / resolve
 * PATCH /alerts/:id/read
 */
export const markAlertRead = async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ msg: "Marked as read" });
  } catch (err) {
    console.error("markAlertRead:", err);
    return res.status(500).json({ msg: err.message });
  }
};
/**
 * Counsellor: Counsellor alerts
 * PUT /alerts/admin
 */
export const adminalertupdate=async(req,res)=>{
  try{
const { assignedTo, resolved, resolutionNotes } = req.body;

  const updated = await Alert.findByIdAndUpdate(
    req.params.id,
    { assignedTo, resolved, resolutionNotes },
    { new: true }
  );

  res.json({ msg: "Alert updated", alert: updated });
  }
  catch{
    console.log("Admin ALert Update:",err);
    return res.status(500).json({ msg: err.message });
  }
}
/**
 * Delete alert
 * DELETE /alerts/:id
 */
export const deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    return res.json({ msg: "Alert deleted" });
  } catch (err) {
    console.error("deleteAlert:", err);
    return res.status(500).json({ msg: err.message });
  }
};
