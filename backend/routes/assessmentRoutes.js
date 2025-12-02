// backend/routes/assessmentRoutes.js
import express from "express";
import { submitAssessment } from "../controllers/assessmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", auth, submitAssessment);

export default router;
