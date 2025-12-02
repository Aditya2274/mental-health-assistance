// frontend/src/pages/Parents/EditChild.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function EditChild() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", grade: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/children/${id}/details`);
      const child = res.data.child;
      setForm({ name: child.name || "", age: child.age || "", grade: child.grade || "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to load child");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/children/${id}`, form);
      alert("Child updated");
      navigate(`/parent/children/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Child</h2>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="input input-bordered w-full mb-3" />
        <input name="age" value={form.age} onChange={handleChange} required type="number" placeholder="Age" className="input input-bordered w-full mb-3" />
        <input name="grade" value={form.grade} onChange={handleChange} required placeholder="Grade" className="input input-bordered w-full mb-3" />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">Save</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
