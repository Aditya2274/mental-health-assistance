import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TeacherChildren() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/teacher/children");
      setChildren(res.data.children || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load children");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">My Students</h2>

      {children.length === 0 ? (
        <p>No students assigned.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((c) => (
            <div key={c._id} className="bg-white p-4 shadow rounded">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-gray-500">Grade {c.grade}</div>
              <p className="text-xs mt-2">
                Parent: {c.parentId?.name} ({c.parentId?.email})
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
