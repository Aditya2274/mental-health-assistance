import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * Parent Reports Page
 * Read-only, aggregated insights for parents
 */
export default function ParentReports() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [combinedReport, setCombinedReport] = useState(null); // Mental Health Trend, Current Status, Alerts
  const [childReport, setChildReport] = useState(null); // Teacher Weekly Observations, Support & Actions
  const [loading, setLoading] = useState(true);

  // Load parent's children and combined report
  useEffect(() => {
    loadChildren();
    loadCombinedReport();
  }, []);

  const loadChildren = async () => {
    try {
      const res = await api.get("/parent/children");
      const list = res.data.children || [];
      setChildren(list);

      if (list.length === 1) {
        setSelectedChild(list[0]._id);
        loadChildReport(list[0]._id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const loadCombinedReport = async () => {
    try {
      const res = await api.get("/parent/reports/combined");
      setCombinedReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load combined report");
    }
  };

  const loadChildReport = async (childId) => {
    try {
      const res = await api.get(`/parent/reports/${childId}`);
      setChildReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load child report");
    }
  };

  const handleChildChange = (e) => {
    const id = e.target.value;
    setSelectedChild(id);
    if (id) {
      loadChildReport(id);
    } else {
      setChildReport(null);
    }
  };

  if (loading) return <div className="p-6">Loading reports...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Reports</h2>

      {/* Child Selector - Only for child-specific sections */}
      <div className="max-w-sm">
        <label className="block text-sm font-medium mb-1">Select Child</label>
        <select
          value={selectedChild}
          onChange={handleChildChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select</option>
          {children.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} — Grade {c.grade}
            </option>
          ))}
        </select>
      </div>

      {/* Combined Data Sections (All Children) - Only Alerts */}
      {combinedReport && (
        <section className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">⚠️ Alerts</h3>
          <p>Active Alerts: {combinedReport.alerts.active}</p>
          <p>Resolved Alerts: {combinedReport.alerts.resolved}</p>
        </section>
      )}

      {/* Child-Specific Data Sections */}
      {!selectedChild && (
        <p className="text-gray-500">Select a child to view child-specific information.</p>
      )}

      {selectedChild && childReport && (
        <>
          {/* Mental Health Trend - Child Specific */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">📈 Mental Health Trend</h3>
            {childReport.trend && childReport.trend.length === 0 ? (
              <p className="text-sm text-gray-500">No assessments yet</p>
            ) : childReport.trend ? (
              <ul className="space-y-1 text-sm">
                {childReport.trend.map((t, i) => (
                  <li key={i}>
                    {new Date(t.date).toLocaleDateString()} — Score: {t.score} (
                    {t.risk})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No assessments yet</p>
            )}
          </section>

          {/* Current Status - Child Specific */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">🧠 Current Status</h3>
            <p>Risk Level: <b>{childReport.currentRisk || "unknown"}</b></p>
            <p>Last Assessment: {childReport.lastAssessment ? new Date(childReport.lastAssessment).toLocaleString() : "N/A"}</p>
            <p>Trend: {childReport.trendDirection || "Stable"}</p>
          </section>

          {/* Teacher Check-ins - Child Specific */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              🏫 Teacher Weekly Observations
            </h3>
            {childReport.checkins.count === 0 ? (
              <p className="text-sm text-gray-500">No check-ins yet</p>
            ) : (
              <>
                <p>Average Rating: {childReport.checkins.average}/10</p>
                <p>Total Check-ins: {childReport.checkins.count}</p>
              </>
            )}
          </section>

          {/* Support & Actions - Child Specific */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">🛟 Support & Actions</h3>
            <ul className="list-disc list-inside text-sm">
              <li>Counsellor monitoring: {childReport.support.counsellor ? "Active" : "—"}</li>
              <li>Teacher check-ins: {childReport.support.teacher ? "Active" : "—"}</li>
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
