// src/pages/Teachers/TeacherDashboard.jsx
import React from "react";

export default function TeacherDashBoard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-slate-800">
        Teacher Dashboard
      </h1>

      <p classname="mt-2 text-slate-600">
        Welcome! Here you can manage students, assessments, and alerts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        {/* Overview Card */}
        <div className="bg-slate-50 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-slate-700">Total Students</h2>
          <p className="text-3xl font-bold text-slate-900 mt-2">42</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-slate-700">Pending Assessments</h2>
          <p className="text-3xl font-bold text-slate-900 mt-2">7</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-slate-700">Alerts</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">3</p>
        </div>

      </div>
    </div>
  );
}