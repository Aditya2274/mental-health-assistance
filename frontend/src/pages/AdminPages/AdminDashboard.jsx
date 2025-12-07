import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: [],
    children: [],
    alerts: [],
    trend: [],
    riskDist: []
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const users = await api.get("/admin/users");
    const children = await api.get("/admin/children");
    const alerts = await api.get("/admin/alerts");

    // Pie chart risk distribution
    const riskDist = [
      { name: "Low", value: alerts.data.alerts.filter(a => a.level === "low").length },
      { name: "Medium", value: alerts.data.alerts.filter(a => a.level === "medium").length },
      { name: "High", value: alerts.data.alerts.filter(a => a.level === "high").length },
    ];

    setStats({
      users: users.data.users,
      children: children.data.children,
      alerts: alerts.data.alerts,
      riskDist,
      trend: alerts.data.alerts.map(a => ({
        date: new Date(a.createdAt).toLocaleDateString(),
        high: a.level === "high" ? 1 : 0,
      }))
    });
  };

  const COLORS = ["#4ade80", "#facc15", "#f87171"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Risk distribution pie */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={stats.riskDist}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {stats.riskDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Assessment trend */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">High Risk Trend</h3>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={stats.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="high" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
