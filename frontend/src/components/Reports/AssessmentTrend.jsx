import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function AssessmentTrend({ data }) {
  if (!data || data.length === 0) return <p>No trend data</p>;

  return (
    <LineChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <Line type="monotone" dataKey="count" />
    </LineChart>
  );
}
