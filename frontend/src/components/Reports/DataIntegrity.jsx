import api from "@/lib/api";
import { useState } from "react";

export default function DataIntegrity() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const repair = async () => {
    if (!confirm("Repair orphaned data?")) return;

    setLoading(true);
    try {
      const res = await api.post("/admin/reports/repair");
      setResult(res.data);
    } catch (err) {
      alert("Repair failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Data Integrity</h3>

      <button
        onClick={repair}
        className="btn btn-sm btn-warning"
        disabled={loading}
      >
        {loading ? "Repairing..." : "Repair Orphaned Data"}
      </button>

      {result && (
        <div className="text-sm mt-3 text-gray-600">
          Fixed {result.assessmentsFixed} assessments,
          {result.alertsFixed} alerts
        </div>
      )}
    </div>
  );
}
