import { Outlet, Link } from "react-router-dom";

export default function AdminDashboardLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <Link to="/admin" className="block hover:text-gray-300">Dashboard</Link>
        <Link to="/admin/users" className="block hover:text-gray-300">Users</Link>
        <Link to="/admin/children" className="block hover:text-gray-300">Children</Link>
        <Link to="/admin/alerts" className="block hover:text-gray-300">Alerts</Link>
        <Link to="/admin/reports" className="block hover:text-gray-300">Reports</Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
