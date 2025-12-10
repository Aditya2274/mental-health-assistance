// backend/routes/counsellorRoutes.js
import express from "express";
import {
  getCounsellorAlerts,
  getRecentAssessments,
  getChild,
  assignAlert,
  resolveAlert,
  search,
  getAllChildrenForCounsellor
} from "../controllers/counsellorController.js";
import { getAssessment,createCaseNote,getCaseNotesForChild } from "../controllers/caseNoteController.js";
import { auth, counsellorOnly, requireAuth } from "../middleware/auth.js";

const router = express.Router();

// load session & require logged-in
router.use(auth);
router.use(requireAuth);
router.use(counsellorOnly);

// endpoints
router.get("/alerts", getCounsellorAlerts);
router.get("/assessments/recent", getRecentAssessments);
router.get("/assessment/:id",auth, counsellorOnly, getAssessment);
router.get("/child/:id", getChild);
router.get("/children", getAllChildrenForCounsellor);

router.post("/casenote", createCaseNote);
router.get("/casenotes/:childId", getCaseNotesForChild);
router.put("/alerts/:id/assign", assignAlert);
router.put("/alerts/:id/resolve", resolveAlert);

router.get("/search", search);

export default router;
