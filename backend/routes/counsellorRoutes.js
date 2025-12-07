// backend/routes/counsellorRoutes.js
import express from "express";
import {
  getCounsellorAlerts,
  getRecentAssessments,
  getChild,
  getAssessment,
  createCaseNote,
  assignAlert,
  resolveAlert,
  search
} from "../controllers/counsellorController.js";
import { auth, counsellorOnly, requireAuth } from "../middleware/auth.js";

const router = express.Router();

// load session & require logged-in
router.use(auth);
router.use(requireAuth);
router.use(counsellorOnly);

// endpoints
router.get("/alerts", getCounsellorAlerts);
router.get("/assessments/recent", getRecentAssessments);
router.get("/assessment/:id", getAssessment);
router.get("/child/:id", getChild);

router.post("/casenote", createCaseNote);
router.put("/alerts/:id/assign", assignAlert);
router.put("/alerts/:id/resolve", resolveAlert);

router.get("/search", search);

export default router;
