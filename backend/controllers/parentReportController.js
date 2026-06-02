import mongoose from "mongoose";
import Child from "../models/Child.js";
import Assessment from "../models/Assessment.js";
import Alert from "../models/Alert.js";
import Checkin from "../models/Checkin.js";

export const getMyChildren = async (req, res) => {
  try {
    const children = await Child.find({ parentId: req.user._id })
      .select("name age grade")
      .sort({ name: 1 });

    res.json({ children });
  } catch (err) {
    console.error("Parent get children:", err);
    res.status(500).json({ msg: "Failed to load children" });
  }
};

/**
 * GET /parent/reports/combined
 * Combined report for all children (Alerts only)
 */
export const getCombinedParentReport = async (req, res) => {
  try {
    // Get all children for this parent
    const children = await Child.find({ parentId: req.user._id }).select("_id").lean();
    const childIds = children.map((c) => c._id);

    if (childIds.length === 0) {
      return res.json({
        alerts: {
          active: 0,
          resolved: 0,
        },
      });
    }

    /* -------------------------
       Alerts Summary - All children combined
    --------------------------*/
    const alerts = await Alert.find({
      childId: { $in: childIds },
      orphaned: { $ne: true },
    }).lean();

    const activeAlerts = alerts.filter((a) => a.status !== "resolved").length;
    const resolvedAlerts = alerts.filter((a) => a.status === "resolved").length;

    /* -------------------------
       Response
    --------------------------*/
    res.json({
      alerts: {
        active: activeAlerts,
        resolved: resolvedAlerts,
      },
    });
  } catch (err) {
    console.error("Combined parent report error:", err);
    res.status(500).json({ msg: "Failed to generate combined report" });
  }
};
/**
 * GET /parent/reports/:childId
 * Parent aggregated report (READ-ONLY)
 */
export const getParentReport = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ msg: "Invalid child ID" });
    }

    // Ensure parent owns the child
    const child = await Child.findOne({
      _id: childId,
      parentId: req.user._id,
    });

    if (!child) {
      return res.status(404).json({ msg: "Child not found" });
    }

    /* -------------------------
       Assessments (Trend) - Child specific (not used in combined view)
    --------------------------*/
    const assessments = await Assessment.find({
      childId,
      orphaned: { $ne: true },
    })
      .sort({ createdAt: 1 })
      .select("totalScore riskLevel createdAt");

    const trend = assessments.map((a) => ({
      date: a.createdAt,
      score: a.totalScore,
      risk: a.riskLevel,
    }));

    const lastAssessment = assessments.at(-1);

    /* -------------------------
       Trend Direction
    --------------------------*/
    let trendDirection = "Stable";
    if (assessments.length >= 2) {
      const prev = assessments.at(-2).totalScore;
      const curr = assessments.at(-1).totalScore;

      if (curr > prev) trendDirection = "Worsening";
      else if (curr < prev) trendDirection = "Improving";
    }

    /* -------------------------
       Teacher Weekly Check-ins
    --------------------------*/
    const checkins = await Checkin.find({ childId });

    const checkinCount = checkins.length;
    const avgRating =
      checkinCount === 0
        ? null
        : Math.round(
            (checkins.reduce((s, c) => s + (c.rating || 0), 0) / checkinCount) *
              10
          ) / 10;

    /* -------------------------
       Alerts Summary - Child specific (not used in combined view)
    --------------------------*/
    const alerts = await Alert.find({
      childId,
      orphaned: { $ne: true },
    });

    const activeAlerts = alerts.filter((a) => a.status !== "resolved").length;
    const resolvedAlerts = alerts.filter((a) => a.status === "resolved").length;

    /* -------------------------
       Support Status
    --------------------------*/
    const support = {
      counsellor: alerts.length > 0,
      teacher: checkinCount > 0,
    };

    /* -------------------------
       Response - Child-specific data
    --------------------------*/
    res.json({
      trend,
      currentRisk: lastAssessment?.riskLevel || "unknown",
      lastAssessment: lastAssessment ? lastAssessment.createdAt : null,
      trendDirection,
      checkins: {
        count: checkinCount,
        average: avgRating,
      },
      support,
    });
  } catch (err) {
    console.error("Parent report error:", err);
    res.status(500).json({ msg: "Failed to generate report" });
  }
};
export const getParentAlerts = async (req, res) => {
  try {
    const parentId = req.user._id;

    const alerts = await Alert.find({ parentId })
      .populate("childId", "name")
      .sort({ createdAt: -1 });

    res.json({ alerts });
  } catch (err) {
    console.error("getParentAlerts:", err);
    res.status(500).json({ msg: "Failed to load alerts" });
  }
};

export const markAlertRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Invalid alert id" });

    await Alert.findByIdAndUpdate(id, {
      isReadByParent: true
    });

    res.json({ msg: "Alert marked as read" });
  } catch (err) {
    console.error("markAlertRead:", err);
    res.status(500).json({ msg: "Failed" });
  }
};