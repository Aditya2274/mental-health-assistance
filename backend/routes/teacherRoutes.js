// backend/routes/teacherRoutes.js
import express from "express";
import {
  submitTeacherAssessment,
  getRecentTeacherAssessments,
  createCheckin,
  listCheckins,
  updateCheckin,
  deleteCheckin,
  childrenassessment,
  assessment
} from "../controllers/teacherController.js";
import { auth, requireAuth, teacherOnly } from "../middleware/auth.js";

const teacherRouter = express.Router();

teacherRouter.use(auth);
teacherRouter.use(requireAuth);
teacherRouter.use(teacherOnly);

// assessments by teacher
teacherRouter.get("/children",childrenassessment);
teacherRouter.post("/assessment", submitTeacherAssessment);
teacherRouter.get("/assessments",assessment)
teacherRouter.get("/assessments/recent", getRecentTeacherAssessments);

// checkins
teacherRouter.post("/checkin", createCheckin);
teacherRouter.get("/checkins", listCheckins);
teacherRouter.put("/checkin/:id", updateCheckin);
teacherRouter.delete("/checkin/:id", deleteCheckin);

export default teacherRouter;
