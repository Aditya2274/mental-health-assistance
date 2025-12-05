import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data.users);
  };

  const del = async (id) => {
    if (!confirm("Delete user?")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users</h2>
      {users.map(u => (
        <div key={u._id} className="bg-white p-4 shadow mb-2">
          <p>{u.name} ({u.role})</p>
          <button className="text-red-500" onClick={() => del(u._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
