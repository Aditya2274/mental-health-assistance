import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminChildProfile() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get(`/admin/children/${id}`);
      setChild(res.data.child);
    } catch (err) {
      console.error("Load child error", err);
      alert("Failed to load child");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!child) return <p>Child not found</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {child.name}'s Profile
      </h2>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Age:</strong> {child.age}</p>
        <p><strong>Grade:</strong> {child.grade}</p>
        <p><strong>Parent:</strong> {child.parentId?.name} ({child.parentId?.email})</p>

        <p><strong>Assigned Teacher:</strong> 
          {child.assignedTeacher?.name ?? "None"}
        </p>
      </div>
    </div>
  );
}
