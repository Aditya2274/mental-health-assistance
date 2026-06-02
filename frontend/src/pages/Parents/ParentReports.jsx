import { useEffect, useState } from "react";
import api from "@/lib/api";

/**
 * Parent Reports Page
 * Read-only, aggregated insights for parents
 */
export default function ParentReports() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load parent's children
  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const res = await api.get("/parent/children");
      const list = res.data.children || [];
      setChildren(list);

      if (list.length === 1) {
        setSelectedChild(list[0]._id);
        loadReport(list[0]._id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async (childId) => {
    try {
      setLoading(true);
      const res = await api.get(`/parent/reports/${childId}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleChildChange = (e) => {
    const id = e.target.value;
    setSelectedChild(id);
    if (id) loadReport(id);
  };

  if (loading) return <div className="p-6">Loading reports...</div>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Reports</h2>

      {/* Child Selector */}
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

      {!report && <p className="text-gray-500">Select a child to view report.</p>}

      {report && (
        <>
          {/* Mental Health Trend */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">📈 Mental Health Trend</h3>
            {report.trend.length === 0 ? (
              <p className="text-sm text-gray-500">No assessments yet</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {report.trend.map((t, i) => (
                  <li key={i}>
                    {new Date(t.date).toLocaleDateString()} — Score: {t.score} (
                    {t.risk})
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Current Status */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">🧠 Current Status</h3>
            <p>Risk Level: <b>{report.currentRisk}</b></p>
            <p>Last Assessment: {report.lastAssessment || "N/A"}</p>
            <p>Trend: {report.trendDirection}</p>
          </section>

          {/* Teacher Check-ins */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              🏫 Teacher Weekly Observations
            </h3>
            {report.checkins.count === 0 ? (
              <p className="text-sm text-gray-500">No check-ins yet</p>
            ) : (
              <>
                <p>Average Rating: {report.checkins.average}/10</p>
                <p>Total Check-ins: {report.checkins.count}</p>
              </>
            )}
          </section>

          {/* Support & Actions */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">🛟 Support & Actions</h3>
            <ul className="list-disc list-inside text-sm">
              <li>Counsellor monitoring: {report.support.counsellor ? "Active" : "—"}</li>
              <li>Teacher check-ins: {report.support.teacher ? "Active" : "—"}</li>
            </ul>
          </section>

          {/* Alerts Summary */}
          <section className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">⚠️ Alerts</h3>
            <p>Active Alerts: {report.alerts.active}</p>
            <p>Resolved Alerts: {report.alerts.resolved}</p>
          </section>
        </>
      )}
    </div>
  );
}
