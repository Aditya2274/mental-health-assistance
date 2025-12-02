import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function ParentDashboardLayout() {
  const navigate = useNavigate();

  const logout = () => navigate("/");

  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:flex md:flex-col">
        <div className="px-6 py-4 border-b">
          <h1 className="text-xl font-semibold">Parent Dashboard</h1>
          <p className="text-xs text-gray-500">Mental Health Surveillance</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 text-sm">
          <Menu to="/parent" label="Overview" />
          <Menu to="/parent/children" label="Children" />
          <Menu to="/parent/reports" label="Reports" />
          <Menu to="/parent/alerts" label="Alerts" />
          <Menu to="/parent/settings" label="Settings" />
        </nav>

        <div className="px-4 py-4 border-t">
          <button onClick={logout} className="w-full bg-red-500 text-white py-2 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
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
