import { useEffect, useState } from "react";
import api from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Reports() {
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // example endpoint - implement on backend if not present
        const res = await api.get("/reports/assessments/trend");
        setTrend(res.data.trend || []);
      } catch (err) {
        console.error(err);
        // fallback: sample data
        setTrend([
          { date: "2025-10-01", assessments: 4 },
          { date: "2025-10-08", assessments: 7 },
          { date: "2025-10-15", assessments: 3 },
          { date: "2025-10-22", assessments: 9 },
          { date: "2025-10-29", assessments: 6 },
        ]);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Reports</h2>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">Assessments trend</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="assessments" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
