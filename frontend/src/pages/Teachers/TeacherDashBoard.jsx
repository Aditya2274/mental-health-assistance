// src/pages/Teachers/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TeacherDashBoard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingAssessments: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [childrenRes, assessmentsRes, alertsRes] = await Promise.all([
        api.get("/teacher/children"),
        api.get("/teacher/assessments/recent"),
        api.get("/alerts/teacher"),
      ]);

      const totalStudents = childrenRes.data?.children?.length || 0;
      const assessments = assessmentsRes.data?.assessments || [];
      
      // Pending assessments could be children without recent assessments
      // For now, we'll show children who need assessments (no assessment in last 30 days)
      const children = childrenRes.data?.children || [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const pendingAssessments = children.filter((child) => {
        if (!child.lastAssessment) return true;
        return new Date(child.lastAssessment.createdAt) < thirtyDaysAgo;
      }).length;

      const alerts = alertsRes.data?.alerts?.filter(
        (a) => a.status !== "resolved"
      ).length || 0;

      setStats({
        totalStudents,
        pendingAssessments,
        alerts,
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-slate-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-slate-800">
        Teacher Dashboard
      </h1>

      <p className="mt-2 text-slate-600">
        Welcome! Here you can manage students, assessments, and alerts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Overview Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition border border-blue-200">
          <h2 className="text-lg font-semibold text-slate-700">Total Students</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow hover:shadow-lg transition border border-yellow-200">
          <h2 className="text-lg font-semibold text-slate-700">Pending Assessments</h2>
          <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pendingAssessments}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow hover:shadow-lg transition border border-red-200">
          <h2 className="text-lg font-semibold text-slate-700">Alerts</h2>
          <p className="text-4xl font-bold text-red-500 mt-2">{stats.alerts}</p>
        </div>
      </div>
    </div>
  );
}