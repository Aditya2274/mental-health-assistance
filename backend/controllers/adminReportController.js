// backend/controllers/adminReportsController.js
import User from "../models/User.js";
import Child from "../models/Child.js";
import Assessment from "../models/Assessment.js";
import Alert from "../models/Alert.js";
import mongoose from "mongoose";

export const getAdminReports = async (req, res) => {
  try {
    /* =========================
       KPI COUNTS
    ========================= */
    const [
      totalUsers,
      totalChildren,
      totalAssessments,
      activeAlerts
    ] = await Promise.all([
      User.countDocuments(),
      Child.countDocuments(),
      Assessment.countDocuments(),
      Alert.countDocuments({ status: "pending" })
    ]);

    /* =========================
       RISK DISTRIBUTION
    ========================= */
    const riskAgg = await Assessment.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 }
        }
      }
    ]);

    const riskDistribution = { low: 0, medium: 0, high: 0 };
    riskAgg.forEach(r => {
      riskDistribution[r._id] = r.count;
    });

    /* =========================
       ASSESSMENT TREND (LAST 6 MONTHS)
    ========================= */
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const trendAgg = await Assessment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const assessmentTrend = trendAgg.map(t => ({
      month: `${t._id.month}/${t._id.year}`,
      count: t.count
    }));

    /* =========================
       ALERTS OVERVIEW
    ========================= */
    const alertsAgg = await Alert.aggregate([
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 }
        }
      }
    ]);

    const alertsOverview = {};
    alertsAgg.forEach(a => {
      alertsOverview[a._id] = a.count;
    });

    /* =========================
       DATA INTEGRITY CHECKS
    ========================= */
    const orphanAssessments = await Assessment.countDocuments({
      childId: { $nin: await Child.distinct("_id") }
    });

    const orphanAlerts = await Alert.countDocuments({
      childId: { $nin: await Child.distinct("_id") }
    });

    /* =========================
       RESPONSE
    ========================= */
    res.json({
      kpis: {
        totalUsers,
        totalChildren,
        totalAssessments,
        activeAlerts
      },
      riskDistribution,
      assessmentTrend,
      alertsOverview,
      dataIntegrity: {
        orphanAssessments,
        orphanAlerts
      }
    });

  } catch (err) {
    console.error("Admin reports error:", err);
    res.status(500).json({ msg: "Failed to load admin reports" });
  }
};