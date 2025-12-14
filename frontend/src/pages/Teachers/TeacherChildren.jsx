import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TeacherChildren() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/teacher/children"); // ✅ CORRECT API
      setChildren(res.data.children || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assigned Children</h2>

      {children.length === 0 ? (
        <p>No children assigned yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {children.map(c => (
            <div key={c._id} className="bg-white p-4 rounded shadow">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-500">
                Age {c.age} • Grade {c.grade}
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Parent: {c.parentId?.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
