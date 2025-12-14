import { useEffect, useState } from "react";
import EditAlertModal from "@/components/EditAlertModal.jsx";
import api from "@/lib/api";

export default function SystemAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const load = async () => {
    try {
      const res = await api.get("/admin/alerts");
      setAlerts(res.data.alerts || []);
    } catch (err) { console.error(err); alert("Failed to load alerts"); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete alert?")) return;
    try {
      await api.delete(`/alerts/${id}`); // admin route allowed to delete alerts
      setAlerts(prev => prev.filter(a => a._id !== id));
    } catch (err) { console.error(err); alert("Delete failed"); }
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">System Alerts</h2>

      {alerts.length === 0 ? <p>No alerts</p> : (
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a._id} className="bg-white p-4 rounded shadow flex justify-between">
              <div>
                <div className="font-medium">{a.message}</div>
                <div className="text-sm text-slate-500">Child: {a.childId?.name ?? a.childId} • Level: {a.level ?? a.riskLevel}</div>
                <div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(a._id)}>Delete</button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded"
       onClick={() => {
       setSelectedAlert(a);
       setEditOpen(true);
        }}>
        Edit
      </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <EditAlertModal
  open={editOpen}
  onClose={() => setEditOpen(false)}
  alert={selectedAlert}
  onUpdated={load}
  />
    </div>
  );
}
