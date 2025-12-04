// frontend/src/pages/Parents/Children.jsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link, useNavigate } from "react-router-dom";
import AddChild from "./AddChild"; // relative path may vary

export default function ChildrenPage() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const res = await api.get("/children/mine");
      const list = Array.isArray(res.data) ? res.data : res.data.children || [];
      setChildren(list);
    } catch (err) {
      console.error("Load children error:", err);
      alert(err.response?.data?.msg || "Failed to load children");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this child and all related data? This cannot be undone.");
    if (!ok) return;
    try {
      await api.delete(`/children/${id}`);
      alert("Child deleted");
      loadChildren();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Children Page</h2>

      <div className="mb-6">
        {/* reuse your AddChild component */}
        <AddChild onAdded={loadChildren} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : children.length === 0 ? (
        <p className="text-gray-500">No children yet. Add one above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((c) => (
            <div key={c._id} className="card bg-base-100 shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="text-sm text-gray-600">Age: {c.age} • Grade: {c.grade}</p>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-sm" onClick={() => navigate(`/parent/children/${c._id}`)}>View</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/parent/children/${c._id}/edit`)}>Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(c._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
