// src/pages/Parents/ParentDashboard.jsx

import AssessmentForm from "../../components/AssessmentForm";

export default function ParentDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome Parent 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Submit Assessment</h2>
          <AssessmentForm childId="12345" />
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Recent Scores</h2>
          <p className="text-gray-600">No assessments yet...</p>
        </div>
      </div>
    </div>
  );
}
