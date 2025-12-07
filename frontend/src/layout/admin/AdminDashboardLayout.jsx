import { Outlet, NavLink } from "react-router-dom";
import { Users, Home, FileText, Bell } from "lucide-react";

export default function AdminDashboardLayout() {
  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700 transition ${
          isActive ? "bg-slate-700 text-white" : "text-slate-200"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-slate-900 text-slate-100 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">MH Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Mental Health System</p>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem to="/admin" icon={Home}>Overview</NavItem>
          <NavItem to="/admin/users" icon={Users}>Users</NavItem>
          <NavItem to="/admin/children" icon={FileText}>Children</NavItem>
          <NavItem to="/admin/alerts" icon={Bell}>Alerts</NavItem>
          <NavItem to="/admin/reports" icon={FileText}>Reports</NavItem>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button
            onClick={async () => {
              try {
                await fetch("/auth/logout", { method: "POST", credentials: "include" });
                window.location.href = "/";
              } catch (e) { console.error(e); window.location.href = "/"; }
            }}
            className="w-full text-left text-sm text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
