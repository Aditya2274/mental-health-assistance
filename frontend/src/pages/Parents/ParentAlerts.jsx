import { useEffect, useState } from "react";
import api from "@/lib/api";
import AlertCard from "@/components/AlertCard";

export default function ParentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/alerts/parent");
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load alerts");
    } finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts(prev => prev.map(a => a._id === id ? { ...a, read: true } : a));
    } catch (err) { console.error(err); alert("Failed"); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Alerts</h2>
      {loading ? <p>Loading...</p> : alerts.length === 0 ? <p>No alerts</p> : alerts.map(a => (
        <AlertCard key={a._id} alert={a} onMarkRead={markRead} />
      ))}
    </div>
  );
}
