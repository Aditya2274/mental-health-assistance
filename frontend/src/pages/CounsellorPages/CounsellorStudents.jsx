// frontend/src/pages/CounsellorPages/CounsellorStudents.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

export default function CounsellorStudents() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get("/counsellor/children");
      const list = res.data?.children || res.data || [];
       console.log("Children list:", list);
      setChildren(list);
    } catch (err) {
      console.error("load counsellor children:", err);
      alert("Failed to load students"+ (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Students</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children.map((c) => (
          <div key={c._id} className="card bg-white p-4 shadow">
             <div className="font-semibold text-lg">{c.name}</div>
              <div className="text-sm text-gray-500">Age {c.age} • Grade {c.grade}</div>
              <div className="text-sm text-slate-400 mt-2">Parent: {c.parentId?.name} ({c.parentId?.email})</div>

            <div className="mt-3 flex gap-2">
              <Link
                to={`/counsellor/child/${c._id}`}
                className="btn btn-sm btn-primary"
              >
                View Profile
              </Link>

              {c.lastAssessment ? (
                <Link
                  to={`/counsellor/review/${c.lastAssessment._id}`}
                  className="btn btn-sm btn-secondary"
                >
                  Review Last Assessment
                </Link>
              ) : (
                <span className="text-sm text-gray-400">No assessments yet</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
