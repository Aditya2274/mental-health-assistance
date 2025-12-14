// frontend/src/pages/Counsellor/CounsellorDashboard.jsx
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Link } from "react-router-dom";

function AlertCard({ a, onAssign, onResolve }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{a.childId?.name ?? "Unknown child"}</div>
          <div className="text-sm text-gray-500">{a.severity} • {a.status}</div>
          <div className="text-sm mt-2">{a.assessmentId?.instrument ?? "Assessment"}</div>
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn btn-sm" onClick={() => onAssign(a)}>Assign</button>
          <button className="btn btn-sm btn-ghost" onClick={() => onResolve(a)}>Resolve</button>
          <Link to={`/counsellor/assessment/${a.assessmentId?._id || ""}`} className="text-xs text-blue-600">Review</Link>
        </div>
      </div>
    </div>
  );
}

export default function CounsellorDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, rRes] = await Promise.all([
        api.get("/counsellor/alerts"),
        api.get("/counsellor/assessments/recent")
      ]);
      setAlerts(aRes.data.alerts || []);
      setRecent(rRes.data.assessments || []);
    } catch (err) {
      console.error("load counsellor dashboard", err);
      alert("Failed to load dashboard");
    } finally { setLoading(false); }
  };

  const handleAssign = async (a) => {
    try {
      await api.put(`/counsellor/alerts/${a._id}/assign`, { assignedTo: null }); // assign to self
      load();
    } catch (err) { console.error(err); alert("Assign failed"); }
  };

  const handleResolve = async (a) => {
    const notes = prompt("Resolution notes (optional):");
    try {
      await api.put(`/counsellor/alerts/${a._id}/resolve`, { resolutionNotes: notes });
      load();
    } catch (err) { console.error(err); alert("Resolve failed"); }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Counsellor Dashboard</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Alerts (High / Unassigned)</h3>
          <div className="space-y-3">
            {alerts.length === 0 ? <p>No alerts.</p> :
              alerts.map(a => <AlertCard key={a._id} a={a} onAssign={handleAssign} onResolve={handleResolve} />)
            }
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Assessments</h3>
          <div className="space-y-3">
            {recent.length === 0 ? <p>No recent assessments.</p> :
              recent.map(r => (
                <div key={r._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
                  <div>
                    <div className="font-medium">{r.childId?.name}</div>
                    <div className="text-xs text-gray-500">{r.instrument} • Score: {r.totalScore}</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/counsellor/assessment/${r._id}`} className="btn btn-sm">Review</Link>
                    <Link to={`/counsellor/child/${r.childId?._id}`} className="btn btn-sm btn-ghost">Profile</Link>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
