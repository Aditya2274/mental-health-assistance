import { useEffect, useState } from "react";
import api from "@/lib/api";
import EditAlertModal from "@/components/EditAlertModal.jsx";

export default function SystemAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/admin/alerts");
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load alerts");
    }
  };

  const markResolved = async (a) => {
    const notes = prompt("Resolution notes? (optional)") || "";
    await api.put(`/admin/alerts/${a._id}`, {
      status: "resolved",
      resolutionNotes: notes
    });
    load();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">System Alerts</h2>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            {/* Alert Basic Info */}
            <div className="font-semibold">{a.childId?.name}</div>

            <div className="text-sm text-gray-500">
              Severity: {a.severity} — Status: {a.status}
            </div>

            <div className="text-sm mt-2">
              Parent: {a.childId?.parentId?.name} ({a.childId?.parentId?.email})
            </div>

            <div className="text-sm mt-2">
              Assessment Score: {a.assessmentId?.totalScore ?? "N/A"}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-3">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setSelectedAlert(a);
                  setEditOpen(true);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-sm btn-primary"
                onClick={() => markResolved(a)}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      <EditAlertModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        alertData={selectedAlert}
        onUpdated={load}
      />
    </div>
  );
}
