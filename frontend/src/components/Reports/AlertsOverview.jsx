export default function AlertsOverview() {
  const alerts = [
    { status: "Pending", count: 6 },
    { status: "Assigned", count: 4 },
    { status: "Resolved", count: 18 },
    { status: "Overdue", count: 2 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Alert Status</h2>
      {alerts.map(a => (
        <div key={a.status} className="flex justify-between text-sm mb-1">
          <span>{a.status}</span>
          <span>{a.count}</span>
        </div>
      ))}
    </div>
  );
}
