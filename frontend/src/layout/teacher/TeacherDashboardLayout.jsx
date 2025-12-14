import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function TeacherDashboardLayout() {
  const navigate = useNavigate();

  const logout = () => navigate("/");

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-700 shadow-xl hidden md:flex md:flex-col">
        <div className="px-6 py-5 border-b border-blue-500">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">📚</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Teacher</h1>
              <p className="text-xs text-blue-200">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Menu to="/teacher" label="Dashboard" />
          <Menu to="/teacher/children" label="Children" />
          <Menu to="/teacher/taskboard" label="TaskBoard" />
          <Menu to="/teacher/assessments" label="Assessments" />
          <Menu to="/teacher/checkins" label="Weekly Check-ins" />
          <Menu to="/teacher/alerts" label="Alerts" />
        </nav>

        <div className="px-3 py-4 border-t border-blue-500">
          <button 
            onClick={logout} 
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition-colors duration-200 font-medium shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
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
        `block px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
          isActive 
            ? "bg-white text-blue-700 shadow-md" 
            : "text-blue-100 hover:bg-blue-500 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
