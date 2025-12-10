// backend/routes/alertRoutes.js
import express from "express";
import { auth, requireAuth, parentOnly, teacherOnly, counsellorOnly, adminOnly } from "../middleware/auth.js";
import {
  getAlertsForParent,
  getAlertsForTeacher,
  getAlertsForCounsellor,
  getAllAlerts,
  createAlert,
  markAlertRead,
  deleteAlert,
  adminalertupdate
} from "../controllers/alertController.js";

const router = express.Router();

// Load session user (auth sets req.user if session exists)
router.use(auth);

// Require logged-in for all alert endpoints
router.use(requireAuth);

/** Parent */
router.get("/parent", parentOnly, getAlertsForParent);

/** Teacher */
router.get("/teacher", teacherOnly, getAlertsForTeacher);

/** Counsellor */
router.get("/counsellor", counsellorOnly, getAlertsForCounsellor);

/** Admin */
router.get("/admin", adminOnly, getAllAlerts);

/** Create (admin/auto) */
router.post("/", adminOnly, createAlert);

/** Mark read — any logged-in user who can view the alert can mark */
router.patch("/:id/read", markAlertRead);

/** Delete (admin) */
router.delete("/:id", adminOnly, deleteAlert);

/** Update alert (admin / counsellor) */
router.put("/:id", adminOnly, adminalertupdate);
export default router;
