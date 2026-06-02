// src/pages/Teachers/WeeklyCheckins.jsx
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function WeeklyCheckins() {
  const [children, setChildren] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [form, setForm] = useState({ childId: "", date: "", rating: 5, notes: "", actions: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadChildren(); loadCheckins(); }, []);

  const loadChildren = async () => {
    try {
      const res = await api.get("/teacher/children");
      const list = res.data?.children || res.data || [];
      setChildren(list);
    } catch (err) {
      console.error(err);
      alert("Failed to load children");
    }
  };

  const loadCheckins = async () => {
    try {
      const res = await api.get("/teacher/checkins");
      setCheckins(res.data.checkins || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load checkins");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.childId) return alert("Select a child");
    setSaving(true);
    try {
      await api.post("/teacher/checkin", {
        childId: form.childId,
        date: form.date || new Date(),
        rating: Number(form.rating),
        notes: form.notes,
        actions: form.actions
      });
      alert("Check-in saved");
      setForm({ childId: "", date: "", rating: 5, notes: "", actions: "" });
      loadCheckins();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Weekly Check-ins</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
          <h3 className="font-semibold">Create Check-in</h3>

          <select name="childId" value={form.childId} onChange={handleChange} className="input input-bordered w-full">
            <option value="">Select child</option>
            {children.map(c => <option key={c._id} value={c._id}>{c.name} — Grade {c.grade}</option>)}
          </select>

          <input type="date" name="date" value={form.date} onChange={handleChange} className="input input-bordered w-full" />

          <label className="block">Rating (0–10)</label>
          <input type="number" name="rating" min="0" max="10" value={form.rating} onChange={handleChange} className="input input-bordered w-full" />

          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="textarea textarea-bordered w-full" />
          <textarea name="actions" value={form.actions} onChange={handleChange} placeholder="Suggested actions" className="textarea textarea-bordered w-full" />

          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Check-in"}</button>
        </form>

        <div>
          <h3 className="font-semibold mb-2">Recent Check-ins</h3>
          {checkins.length === 0 ? <p>No check-ins yet</p> : (
            <div className="space-y-3">
              {checkins.map(ci => (
                <div key={ci._id} className="bg-white p-3 rounded shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{ci.childId?.name}</div>
                      <div className="text-sm text-gray-500">{new Date(ci.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{ci.rating}/10</div>
                      <div className="text-sm">{ci.teacherId?.name}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm">
                    <div><strong>Notes:</strong> {ci.notes}</div>
                    <div><strong>Actions:</strong> {ci.actions}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
