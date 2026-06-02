import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function CounsellorDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", path: "/counsellor" },
    { label: "Students", path: "/counsellor/students" },
    { label: "Alerts", path: "/counsellor/alerts" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-teal-600 to-cyan-600 shadow-xl p-5 flex flex-col">
        <div className="mb-6 pb-4 border-b border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💬</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Counsellor</h2>
              <p className="text-xs text-teal-100">Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-white text-teal-700 shadow-md"
                    : "text-teal-50 hover:bg-teal-500/50 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-md"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Navbar-like Header */}
        <div className="flex justify-between items-center mb-6 bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <span className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm font-semibold">
            {user?.role?.toUpperCase()}
          </span>
        </div>

        {/* Routed Page Content */}
        <Outlet />
      </main>
    </div>
  );
}