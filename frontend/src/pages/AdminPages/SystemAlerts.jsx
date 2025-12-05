import { useEffect, useState } from "react";
import api from "@/lib/api";
import AlertCard from "@/components/AlertCard";

export default function SystemAlerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const res = await api.get("/alerts/admin");
      setAlerts(res.data.alerts || []);
    } catch (err) { console.error(err); }
  };

  const markRead = async (id) => {
    await api.patch(`/alerts/${id}/read`);
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, read: true } : a));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete alert?")) return;
    await api.delete(`/alerts/${id}`);
    setAlerts(prev => prev.filter(a => a._id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">System Alerts</h2>
      {alerts.length === 0 ? <p>No alerts</p> : alerts.map(a => (
        <AlertCard key={a._id} alert={a} onMarkRead={markRead} onDelete={handleDelete} />
      ))}
    </div>
  );
}
