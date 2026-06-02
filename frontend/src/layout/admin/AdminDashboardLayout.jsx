import { Outlet, NavLink } from "react-router-dom";
import { Users, FileText, Bell } from "lucide-react";

export default function AdminDashboardLayout() {
  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
          isActive 
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
            : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-slate-100 p-6 shadow-2xl">
        <div className="mb-8 pb-6 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">MH Admin</h1>
              <p className="text-xs text-gray-400 mt-0.5">Mental Health System</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem to="/admin/users" icon={Users}>Users</NavItem>
          <NavItem to="/admin/children" icon={FileText}>Children</NavItem>
          <NavItem to="/admin/alerts" icon={Bell}>Alerts</NavItem>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <button
            onClick={async () => {
              try {
                await fetch("/auth/logout", { method: "POST", credentials: "include" });
                window.location.href = "/";
              } catch (e) { console.error(e); window.location.href = "/"; }
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
