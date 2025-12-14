import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function ParentDashboardLayout() {
  const navigate = useNavigate();

  const logout = () => navigate("/");

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-sm shadow-lg hidden md:flex md:flex-col border-r border-purple-100">
        <div className="px-6 py-6 border-b border-purple-100">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parent Dashboard
          </h1>
          <p className="text-xs text-purple-500 mt-1">Mental Health Surveillance</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 text-sm">
          <Menu to="/parent" label="Overview" />
          <Menu to="/parent/children" label="Children" />
          <Menu to="/parent/reports" label="Reports" />
          <Menu to="/parent/alerts" label="Alerts" />
        </nav>

        <div className="px-4 py-4 border-t border-purple-100">
          <button 
            onClick={logout} 
            className="w-full bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
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
        `block px-4 py-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md" 
            : "text-purple-700 hover:bg-purple-50 hover:text-purple-900"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
