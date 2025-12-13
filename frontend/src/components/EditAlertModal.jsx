import { useEffect, useState } from "react";
import api from "@/lib/api";
import Modal from "./ui/Modal";

export default function EditAlertModal({ open, onClose, alertData, onUpdated }) {
  const [counsellors, setCounsellors] = useState([]);
  const [form, setForm] = useState({
    assignedTo: "",
    status: "",
    resolutionNotes: ""
  });

  useEffect(() => {
    if (alertData) {
      setForm({
        assignedTo: alertData.assignedTo?._id || "",
        status: alertData.status,
        resolutionNotes: alertData.resolutionNotes || ""
      });
    }
    loadCounsellors();
  }, [alertData]);

  const loadCounsellors = async () => {
    const res = await api.get("/admin/users");
    setCounsellors(res.data.users.filter((u) => u.role === "counsellor"));
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveChanges = async (e) => {
    e.preventDefault();
    await api.put(`/admin/alerts/${alertData._id}`, form);
    onUpdated();
    onClose();
  };

  if (!alertData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit Alert</h2>

      <div className="text-sm mb-3">
        <p><strong>Child:</strong> {alertData.childId?.name}</p>
        <p><strong>Parent:</strong> {alertData.childId?.parentId?.name} ({alertData.childId?.parentId?.email})</p>
        <p><strong>Severity:</strong> {alertData.severity}</p>
        <p><strong>Assessment Score:</strong> {alertData.assessmentId?.totalScore}</p>
      </div>

      <form className="space-y-4" onSubmit={saveChanges}>
        {/* Assign Counsellor */}
        <div>
          <label className="font-medium">Assign Counsellor</label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">None</option>
            {counsellors.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Resolution Notes */}
        <textarea
          name="resolutionNotes"
          value={form.resolutionNotes}
          onChange={handleChange}
          placeholder="Add resolution notes..."
          className="w-full border rounded px-3 py-2"
        />

        <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </Modal>
  );
}
