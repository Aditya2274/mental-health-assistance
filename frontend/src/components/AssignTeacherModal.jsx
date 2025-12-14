import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import api from "@/lib/api";

export default function AssignTeacherModal({ open, onClose, child, onUpdated, userRole = "admin" }) {
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (child) {
      setSelected(child.assignedTeacher?._id || "");
    }
    loadTeachers();
  }, [child]);

  const loadTeachers = async () => {
    const endpoint = userRole === "counsellor" ? "/counsellor/teachers" : "/admin/users";
    const res = await api.get(endpoint);
    const teacherList = userRole === "counsellor" 
      ? res.data.teachers 
      : res.data.users.filter((u) => u.role === "teacher");
    setTeachers(teacherList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = userRole === "counsellor" 
      ? `/counsellor/children/${child._id}/assign-teacher`
      : `/admin/children/${child._id}/assign-teacher`;

    await api.put(endpoint, {
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
