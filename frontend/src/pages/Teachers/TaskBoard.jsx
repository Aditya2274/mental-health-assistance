import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  const load = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.tasks);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (taskId, status) => {
    await api.put(`/tasks/${taskId}`, { status });
    load();
  };

  const onDrop = (e, status) => {
    const taskId = e.dataTransfer.getData("taskId");
    updateStatus(taskId, status);
  };

  return (
    <div className="p-6 grid grid-cols-3 gap-4">

      {["todo", "in-progress", "done"].map((status) => (
        <div
          key={status}
          className="bg-gray-100 p-4 rounded-lg min-h-[300px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, status)}
        >
          <h3 className="text-lg font-bold capitalize mb-4">{status.replace("-", " ")}</h3>

          {tasks
            .filter((t) => t.status === status)
            .map((task) => (
              <div
                key={task._id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
                className="bg-white p-3 rounded shadow mb-3 cursor-move"
              >
                <div className="font-medium">{task.title}</div>
                <div
                  className="text-sm text-gray-600"
                >{task.description}</div>
              </div>
            ))}
        </div>
      ))}

    </div>
  );
}
