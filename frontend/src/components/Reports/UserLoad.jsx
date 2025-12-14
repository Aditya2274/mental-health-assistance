export default function UserLoad() {
  const counsellors = [
    { name: "Counsellor A", load: 12 },
    { name: "Counsellor B", load: 6 },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Counsellor Load</h2>

      {counsellors.map(c => (
        <div key={c.name} className="flex justify-between text-sm mb-1">
          <span>{c.name}</span>
          <span>{c.load} alerts</span>
        </div>
      ))}
    </div>
  );
}
