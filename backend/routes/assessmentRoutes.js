import express from "express";
import {
  submitAssessment,
  getAssessmentById,
  getAssessmentsForChild,
  getRecentAssessments,
} from "../controllers/assessmentController.js";

import { auth, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth);
router.use(requireAuth);

// Parent/Teacher/Counsellor submit an assessment
router.post("/submit", submitAssessment);

// Get full details of a single assessment
router.get("/:id", getAssessmentById);
console.log(11);
// Get all assessments for one child (parent/counsellor/teacher)
router.get("/child/:childId", getAssessmentsForChild);

// Counsellor dashboard – recent assessments with risk flagged
router.get("/recent/list", getRecentAssessments);
export default router;
