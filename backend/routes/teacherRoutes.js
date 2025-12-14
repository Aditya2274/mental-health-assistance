// backend/routes/teacherRoutes.js
import express from "express";
import {
  submitTeacherAssessment,
  getRecentTeacherAssessments,
  createCheckin,
  listCheckins,
  updateCheckin,
  deleteCheckin,
  getAssignedChildren,
  getTeacherChildProfile
} from "../controllers/teacherController.js";
import { auth, requireAuth, teacherOnly } from "../middleware/auth.js";

const teacherRouter = express.Router();

teacherRouter.use(auth);
teacherRouter.use(requireAuth);
teacherRouter.use(teacherOnly);

teacherRouter.get("/children", getAssignedChildren);
teacherRouter.get("/children/:id", getTeacherChildProfile);
// assessments by teacher
teacherRouter.post("/assessment", submitTeacherAssessment);
teacherRouter.get("/assessments/recent", getRecentTeacherAssessments);

// checkins
teacherRouter.post("/checkin", createCheckin);
teacherRouter.get("/checkins", listCheckins);
teacherRouter.put("/checkin/:id", updateCheckin);
teacherRouter.delete("/checkin/:id", deleteCheckin);

export default teacherRouter;
