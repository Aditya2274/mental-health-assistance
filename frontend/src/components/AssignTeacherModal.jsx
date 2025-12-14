import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import api from "@/lib/api";

export default function AssignTeacherModal({ open, onClose, child, onUpdated }) {
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (child) {
      setSelected(child.assignedTeacher?._id || "");
    }
    loadTeachers();
  }, [child]);

  const loadTeachers = async () => {
    const res = await api.get("/admin/users");
    setTeachers(res.data.users.filter((u) => u.role === "teacher"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.put(`/admin/children/${child._id}/assign-teacher`, {
      teacherId: selected,
    });

    onUpdated();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Assign Teacher</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">None</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </Modal>
  );
}
