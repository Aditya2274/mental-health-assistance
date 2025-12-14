export default function FiltersBar() {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4">
      <select className="input input-bordered">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
      </select>

      <select className="input input-bordered">
        <option>All Instruments</option>
        <option>PHQ-A</option>
        <option>GAD-7</option>
        <option>Teacher-Behavior</option>
      </select>

      <select className="input input-bordered">
        <option>All Roles</option>
        <option>Parent</option>
        <option>Teacher</option>
        <option>Counsellor</option>
      </select>
    </div>
  );
}
