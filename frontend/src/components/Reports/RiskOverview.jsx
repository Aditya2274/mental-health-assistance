export default function RiskOverview({data}) {
  const risks = [
    { label: "Low", value: data.low },
    { label: "Medium", value: data.medium },
    { label: "High", value: data.high },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Risk Distribution</h2>
      {risks.map(r => (
        <div key={r.label} className="flex justify-between text-sm mb-1">
          <span>{r.label}</span>
          <span>{r.value}</span>
        </div>
      ))}
    </div>
  );
}
