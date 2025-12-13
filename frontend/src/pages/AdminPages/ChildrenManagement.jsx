import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AssignTeacherModal from "@/components/AssignTeacherModal.jsx";
import api from "@/lib/api";

export default function ChildrenManagement() {
  const [children, setChildren] = useState([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [childTarget, setChildTarget] = useState(null);
  const load = async () => {
    try {
      const res = await api.get("/admin/children");
      setChildren(res.data.children || []);
    } catch (err) { console.error(err); alert("Failed to load children"); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete child?")) return;
    try {
      await api.delete(`/admin/children/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Children</h2>

      {children.length === 0 ? <p>No children</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {children.map(c => (
            <div key={c._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-slate-500">Grade: {c.grade} · Age: {c.age}</div>
                  <div className="text-sm text-slate-400 mt-2">Parent: {c.parentId?.name ?? "No Parent"} ({c.parentId?.email ?? "N/A"})</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`/admin/children/${c._id}/profile`} className="btn btn-sm">
                    View
                  </Link>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(c._id)}>Delete</button>
                  <button className="px-3 py-1 bg-indigo-500 text-white rounded"
                    onClick={() => {
                      setChildTarget(c);
                      setAssignOpen(true);
                    }}
                  >
                    Assign Teacher
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AssignTeacherModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        child={childTarget?? null}
        onUpdated={load}
      />
    </div>
  );
}
