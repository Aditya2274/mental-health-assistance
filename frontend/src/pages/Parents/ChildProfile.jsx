import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatBox from "@/components/ChatBox.jsx";
import api from "../../lib/api";

export default function ChildProfile() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChild();
    loadAssessments();
  }, []);

  const loadChild = async () => {
    try {
      const res = await api.get(`/children/${id}`);
      setChild(res.data.child);
    } catch (err) {
      console.error(err);
      alert("Failed to load child info");
    }
  };

  const loadAssessments = async () => {
    try {
      const res = await api.get(`/assessment/child/${id}`);
      setAssessments(res.data.assessments);
    } catch (err) {
      console.error(err);
      alert("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!child) return <p className="p-6">Child not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Child Profile</h2>

      {/* Child Details */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h3 className="text-xl font-semibold">{child.name}</h3>
        <p>Age: {child.age}</p>
        <p>Grade: {child.grade}</p>
      </div>

      {/* Assessment List */}
      <h3 className="text-xl font-semibold mb-3">Assessment History</h3>

      {assessments.length === 0 ? (
        <p className="text-gray-500">No assessments yet.</p>
      ) : (
        assessments.map((a) => (
          <div key={a._id} className="border bg-gray-100 p-3 rounded mb-3">
            <div className="font-semibold">{a.instrument}</div>
            <div>Score: {a.totalScore}</div>
            <div>Risk: {a.riskLevel}</div>
            <div>Date: {new Date(a.createdAt).toLocaleDateString()}</div>
          </div>
        ))
      )}
      {/* Parent ↔ Counsellor Chat */}
      <ChatBox childId={child._id} />
    </div>
  );
}
