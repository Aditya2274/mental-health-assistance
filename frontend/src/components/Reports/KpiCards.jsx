import { Card } from "../ui/card";
export default function KpiCards({ kpis }) {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card title="Users" value={kpis.totalUsers} />
      <Card title="Children" value={kpis.totalChildren} />
      <Card title="Assessments" value={kpis.totalAssessments} />
      <Card title="Active Alerts" value={kpis.activeAlerts} />
    </div>
  );
}
