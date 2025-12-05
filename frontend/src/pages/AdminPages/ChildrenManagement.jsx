import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function ChildrenManagement() {
  const [children, setChildren] = useState([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await api.get("/admin/children");
    setChildren(res.data.children);
  };

  const del = async (id) => {
    if (!confirm("Delete child?")) return;
    await api.delete(`/admin/children/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Children</h2>
      {children.map(c => (
        <div key={c._id} className="bg-white p-4 shadow mb-2">
          <p>{c.name} ({c.grade})</p>
          <p>Parent: {c.parentId?.name}</p>
          <button className="text-red-500" onClick={() => del(c._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
