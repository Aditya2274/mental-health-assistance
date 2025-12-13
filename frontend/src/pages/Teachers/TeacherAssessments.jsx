// src/pages/Teachers/TeacherAssessments.jsx
import { useEffect, useState } from "react";
import api from "@/lib/api";
import TeacherBehaviourForm from "@/components/TeacherBehaviourForm";
import { Link } from "react-router-dom";

export default function TeacherAssessments() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      // This endpoint returns ONLY the teacher’s assigned children
      const res = await api.get("/teacher/children");

      const list = res.data?.children || [];
      setChildren(list);
    } catch (err) {
      console.error("load children:", err);
      alert("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Teacher — Behaviour Assessments</h2>

      {children.length === 0 ? (
        <p>No children assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map(c => (
            <div key={c._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold">{c.name}</div>
                  <div className="text-sm text-gray-500">
                    Age {c.age} • Grade {c.grade}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link to={`/teacher/children/${c._id}`} className="btn btn-sm">
                    Profile
                  </Link>
                </div>
              </div>

              <div className="mt-3">
                <TeacherBehaviourForm childId={c._id} onSubmitted={load} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
