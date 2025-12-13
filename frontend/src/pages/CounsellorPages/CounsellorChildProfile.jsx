// frontend/src/pages/CounsellorPages/CounsellorChildProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CounsellorChildProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ child: null, assessments: [], notes: [], alerts: [] });
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => { if (id) load(); }, [id]);

  const load = async () => {
  try {
    setLoading(true);

    const [childRes, checkinRes] = await Promise.all([
      api.get(`/counsellor/child/${id}`),
      api.get(`/counsellor/checkins?childId=${id}`)
    ]);

    setData({
      child: childRes.data.child,
      assessments: childRes.data.assessments || [],
      notes: childRes.data.notes || [],
      alerts: childRes.data.alerts || [],
    });

    setCheckins(checkinRes.data.checkins || []);

  } catch (err) {
    console.error("Failed to load child:", err);
    alert(err.response?.data?.msg || "Failed to load child");
    navigate("/counsellor/students");
  } finally {
    setLoading(false);
  }
};


  const assignToMe = async (alertId) => {
    try {
      await api.put(`/counsellor/alerts/${alertId}/assign`, {});
      alert("Alert assigned to you");
      load();
    } catch (err) {
      console.error(err);
      alert("Assign failed");
    }
  };

  const resolveAlert = async (alertId) => {
    const notes = prompt("Add resolution notes (optional)");
    try {
      await api.put(`/counsellor/alerts/${alertId}/resolve`, { resolutionNotes: notes || "" });
      alert("Alert resolved");
      load();
    } catch (err) {
      console.error(err);
      alert("Resolve failed");
    }
  };

  if (loading) return <div className="p-6">Loading child...</div>;
  if (!data.child) return <div className="p-6">Child not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Child Profile — {data.child.name}</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="text-lg font-semibold">{data.child.name}</div>
        <div className="text-sm text-gray-600">Age: {data.child.age} • Grade: {data.child.grade}</div>
        <div className="text-sm text-gray-500">Parent: {data.child.parentId?.name} ({data.child.parentId?.email})</div>
      </div>
       <h3 className="font-semibold mt-4">Teacher Weekly Check-ins</h3>
      
       {checkins.length === 0 ? (
        <p className="text-sm text-gray-500">No check-ins recorded</p>
       ) : (
        checkins.map(ci => (
          <div key={ci._id} className="bg-white p-3 rounded shadow mb-2">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{ci.teacherId?.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(ci.date).toLocaleDateString()}
                </div>
              </div>
              <div className="font-bold">{ci.rating}/10</div>
            </div>
            <div className="text-sm mt-2"><b>Notes:</b> {ci.notes}</div>
            <div className="text-sm"><b>Actions:</b> {ci.actions}</div>
          </div>
        ))
        )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Assessments</h3>
          {data.assessments.length === 0 ? <p>No assessments yet</p> : data.assessments.map(a => (
            <div key={a._id} className="border rounded p-3 mb-2 bg-gray-50">
              <div className="font-medium">{a.instrument} — {new Date(a.createdAt).toLocaleString()}</div>
              <div>Score: {a.totalScore} • Risk: {a.riskLevel}</div>
              <div className="mt-2">
                <button className="btn btn-xs mr-2" onClick={() => navigate(`/counsellor/review/${a._id}`)}>Review</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Alerts</h3>
          {data.alerts.length === 0 ? <p>No alerts</p> : data.alerts.map(alert => (
            <div key={alert._id} className="border rounded p-3 mb-2 bg-white">
              <div className="font-medium">Severity: {alert.severity}</div>
              <div>Status: {alert.status} • Assigned: {alert.assignedTo?.name || "Unassigned"}</div>
              <div className="mt-2 flex gap-2">
                {!alert.assignedTo && <button className="btn btn-sm" onClick={() => assignToMe(alert._id)}>Assign to me</button>}
                {alert.status !== "resolved" && <button className="btn btn-sm btn-ghost" onClick={() => resolveAlert(alert._id)}>Resolve</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
       
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Case Notes</h3>
        {data.notes.length === 0 ? <p>No case notes</p> : data.notes.map(n => (
          <div key={n._id} className="border rounded p-3 mb-2 bg-gray-50">
            <div className="font-medium">By {n.counsellorId?.name} — {new Date(n.createdAt).toLocaleString()}</div>
            <div>{n.note}</div>
            {n.actionPlan && <div className="text-sm text-gray-600">Plan: {n.actionPlan}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
