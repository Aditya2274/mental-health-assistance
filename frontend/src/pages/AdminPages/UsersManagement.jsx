import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-slate-500">{u.email} · <span className="capitalize">{u.role}</span></div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={() => alert("Edit user - implement")} >Edit</button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(u._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
