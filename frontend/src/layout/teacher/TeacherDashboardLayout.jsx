import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function TeacherDashboardLayout() {
  const navigate = useNavigate();

  const logout = () => navigate("/");

  return (
    <div className="min-h-screen flex bg-slate-100">
      
      <aside className="w-64 bg-white shadow-md hidden md:flex md:flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Menu to="/teacher" label="Dashboard" />
          <Menu to="/teacher/children" label="Children" />
          <Menu to="/teacher/assessments" label="Assessments" />
          <Menu to="/teacher/checkins" label="Weekly Check-ins" />
          <Menu to="/teacher/alerts" label="Alerts" />
          <Menu to="/teacher/settings" label="Settings" />
        </nav>

        <div className="px-4 py-4 border-t">
          <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}

function Menu({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md ${
          isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
