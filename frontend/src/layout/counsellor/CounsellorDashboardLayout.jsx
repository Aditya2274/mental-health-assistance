import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function CounsellorDashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", path: "/counsellor" },
    { label: "Students", path: "/counsellor/students" },
    { label: "Alerts", path: "/counsellor/alerts" },
    { label: "Settings", path: "/counsellor/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside className="w-64 bg-base-100 shadow-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Counsellor Panel</h2>

        <nav className="flex-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block py-2 px-3 rounded hover:bg-base-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="btn btn-error mt-6"
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <span className="badge badge-primary">{user?.role?.toUpperCase()}</span>
        </div>

        {/* Routed Page Content */}
        <Outlet />
      </main>
    </div>
  );
}