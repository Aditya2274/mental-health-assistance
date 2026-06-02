import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/lib/api";

export default function TeacherChildProfile() {
  const { id } = useParams();
  const [data, setData] = useState({ child: null, assessments: [], checkins: [], alerts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/teacher/children/${id}`);
      setData({
        child: res.data.child,
        assessments: res.data.assessments || [],
        checkins: res.data.checkins || [],
        alerts: res.data.alerts || [],
      });
    } catch (err) {
      console.error("Failed to load child:", err);
      alert(err.response?.data?.msg || "Failed to load child profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data.child) return <div className="p-6">Child not found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Child Profile — {data.child.name}</h2>

      {/* Child Details */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="text-lg font-semibold">{data.child.name}</div>
        <div className="text-sm text-gray-600">Age: {data.child.age} • Grade: {data.child.grade}</div>
        <div className="text-sm text-gray-500">Parent: {data.child.parentId?.name} ({data.child.parentId?.email})</div>
      </div>

      {/* Assessments */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Assessments</h3>
        {data.assessments.length === 0 ? (
          <p className="text-sm text-gray-500">No assessments yet</p>
        ) : (
          <div className="space-y-2">
            {data.assessments.map((a) => (
              <div key={a._id} className="border p-2 rounded text-sm">
                <div className="font-medium">{a.instrument}</div>
                <div>Score: {a.totalScore} • Risk: {a.riskLevel}</div>
                <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-ins */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Weekly Check-ins</h3>
        {data.checkins.length === 0 ? (
          <p className="text-sm text-gray-500">No check-ins yet</p>
        ) : (
          <div className="space-y-2">
            {data.checkins.map((c) => (
              <div key={c._id} className="border p-2 rounded text-sm">
                <div className="font-medium">Rating: {c.rating}/10</div>
                <div>{c.notes}</div>
                <div className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Alerts</h3>
        {data.alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No alerts</p>
        ) : (
          <div className="space-y-2">
            {data.alerts.map((a) => (
              <div key={a._id} className="border p-2 rounded text-sm">
                <div className="font-medium">{a.message || a.title || "Alert"}</div>
                <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

