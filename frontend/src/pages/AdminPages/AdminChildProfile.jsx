import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminChildProfile() {
  const { id } = useParams();
  const [child, setChild] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/admin/children/${id}/profile`);
      setChild(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load child profile");
    }
  };

  if (!child) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Child Profile</h2>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="text-lg font-semibold">{child.child.name}</h3>
        <p>Age: {child.child.age}</p>
        <p>Grade: {child.child.grade}</p>
        <p>Parent: {child.child.parentId?.name} ({child.child.parentId?.email})</p>
        <p>Teacher: {child.child.assignedTeacher?.name || "Not assigned"}</p>
      </div>

      <h3 className="font-semibold mb-2">Assessments</h3>
      <div className="space-y-2">
        {child.assessments.map(a => (
          <div key={a._id} className="bg-gray-100 p-3 rounded">
            <div>{a.instrument}</div>
            <div>Score: {a.totalScore}</div>
            <div>Risk: {a.riskLevel}</div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mt-4 mb-2">Alerts</h3>
      <div className="space-y-2">
        {child.alerts.map(al => (
          <div key={al._id} className="bg-red-100 p-3 rounded">
            <div>Severity: {al.severity}</div>
            <div>Status: {al.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
