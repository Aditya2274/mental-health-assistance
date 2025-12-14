import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import api from "@/lib/api";

export default function EditAlertModal({ open, onClose, alert, onUpdated }) {
  const [form, setForm] = useState({
    assignedTo: "",
    resolved: false,
    resolutionNotes: "",
  });

  const [counsellors, setCounsellors] = useState([]);

  useEffect(() => {
    if (alert) {
      setForm({
        assignedTo: alert.assignedTo?._id || "",
        resolved: alert.resolved || false,
        resolutionNotes: alert.resolutionNotes || "",
      });
    }
    loadCounsellors();
  }, [alert]);

  const loadCounsellors = async () => {
    const res = await api.get("/admin/users");
    setCounsellors(res.data.users.filter((u) => u.role === "counsellor"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/alerts/${alert._id}`, form);
    onUpdated();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit Alert</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <select
          name="assignedTo"
          className="select select-bordered w-full"
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
        >
          <option value="">Unassigned</option>
          {counsellors.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.resolved}
            onChange={(e) =>
              setForm({ ...form, resolved: e.target.checked })
            }
          />
          Mark as resolved
        </label>

        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Resolution notes..."
          value={form.resolutionNotes}
          onChange={(e) =>
            setForm({ ...form, resolutionNotes: e.target.value })
          }
        />

        <button className="btn btn-primary w-full">Save</button>
      </form>
    </Modal>
  );
}
