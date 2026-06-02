import useAdminReports from "@/hooks/useAdminReports";
import FiltersBar from "../../components/Reports/FiltersBar";
import KpiCards from "../../components/Reports/KpiCards";
import AssessmentTrend from "../../components/Reports/AssessmentTrend";
import RiskOverview from "../../components/Reports/RiskOverview";
import AlertsOverview from "../../components/Reports/AlertsOverview";
import DataIntegrity from "../../components/Reports/DataIntegrity";
import UserLoad from "../../components/Reports/UserLoad";

export default function AdminReports() {
  const { data, loading, error } = useAdminReports();

  if (loading) return <p className="p-6">Loading reports...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">System Reports</h1>

      <FiltersBar />

      <KpiCards kpis={data.kpis} />

      <AssessmentTrend data={data.assessmentTrend} />

      <div className="grid md:grid-cols-2 gap-6">
        <RiskOverview data={data.riskDistribution} />
        <AlertsOverview data={data.alertsOverview} />
      </div>

      {/* <DataIntegrity data={data.dataIntegrity} /> */}

      <UserLoad />
    </div>
  );
}
