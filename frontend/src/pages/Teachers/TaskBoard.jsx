import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TeacherTaskBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Task load failed", err);
      alert("Failed to load tasks");
    }
  };

  const move = async (task, status) => {
    try {
      await api.put(`/tasks/${task._id}`, { status });
      load();
    } catch (err) {
      console.error("Move failed", err);
      alert("Failed to update task");
    }
  };

  const column = (title, status) => (
    <div className="w-1/3 bg-gray-100 p-3 rounded">
      <h3 className="font-semibold mb-2">{title}</h3>

      {tasks
        .filter(t => t.status === status)
        .map(t => (
          <div key={t._id} className="bg-white p-2 shadow mb-2 rounded">
            <div>{t.title || "Untitled Task"}</div>
            <div className="text-xs text-gray-500">
              {t.childId?.name || "No child assigned"}
            </div>

            <div className="flex gap-2 mt-2">
              {status !== "inprogress" && (
                <button className="btn btn-xs" onClick={() => move(t, "inprogress")}>
                  → In Progress
                </button>
              )}
              {status !== "done" && (
                <button className="btn btn-xs" onClick={() => move(t, "done")}>
                  ✔ Done
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="p-6 flex gap-4">
      {column("To Do", "todo")}
      {column("In Progress", "inprogress")}
      {column("Done", "done")}
    </div>
  );
}
