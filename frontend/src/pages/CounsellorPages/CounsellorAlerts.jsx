import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Link } from "react-router-dom";

export default function CounsellorAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/counsellor/alerts");
      setAlerts(res.data.alerts ?? []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch alerts");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Alerts</h2>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{a.childId?.name}</div>
            <div className="text-sm text-gray-500">
              {a.severity} • {a.status}
            </div>

            <div className="flex gap-3 mt-3">
              <Link
                to={`/counsellor/review/${a.lastAssessment._id} `}
                className="btn btn-sm btn-primary"
              >
                Review Assessment
              </Link>
              <Link
                to={`/counsellor/child/${a.childId?._id}`}
                className="btn btn-sm btn-ghost"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
