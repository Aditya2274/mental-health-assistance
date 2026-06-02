import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function TeacherTaskBoard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/alerts/teacher");
    setAlerts(res.data.alerts || []);
  };

  const column = (title, filterFn) => (
    <div className="w-1/3 bg-gray-100 p-3 rounded">
      <h3 className="font-semibold mb-2">{title}</h3>

      {alerts.filter(filterFn).map(a => (
        <div key={a._id} className="bg-white p-2 shadow mb-2 rounded">
          <div className="font-medium">{a.childId?.name}</div>
          <div className="text-xs text-gray-500">
            {a.childId?.parentId?.name}
          </div>
          <div className="text-xs">Severity: {a.severity}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 flex gap-4">
      {column("To Do", a => a.status === "pending")}
      {column("In Progress", a => a.status === "assigned")}
      {column("Done", a => a.status === "resolved")}
    </div>
  );
}
