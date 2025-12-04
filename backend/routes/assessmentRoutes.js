// backend/routes/assessmentRoutes.js
import express from "express";
import { getChildAssessments, submitAssessment } from "../controllers/assessmentController.js";
import auth from "../middleware/auth.js";

const assessmentRoutes = express.Router();

assessmentRoutes.post("/submit", auth, submitAssessment);
assessmentRoutes.get("/child/:childId", getChildAssessments);

export default assessmentRoutes;
