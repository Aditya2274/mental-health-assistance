import express from "express";
import { auth, requireAuth, parentOnly } from "../middleware/auth.js";
import { getParentReport,getMyChildren} from "../controllers/parentReportController.js";
import {
  getParentAlerts,
  markAlertRead
} from "../controllers/parentReportController.js";
const router = express.Router();

router.use(auth);
router.use(requireAuth);
router.use(parentOnly);

// Parent children list
router.get("/children", getMyChildren);
// Reports
router.get("/reports/:childId", getParentReport);
router.get("/alerts", getParentAlerts);
router.put("/alerts/:id/read", markAlertRead);
export default router;
