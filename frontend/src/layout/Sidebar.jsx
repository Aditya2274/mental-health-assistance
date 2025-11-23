import { Home, Users, FileText, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, to: "/" },
    { name: "Children", icon: <Users size={18} />, to: "/children" },
    { name: "Assessments", icon: <FileText size={18} />, to: "/assessments" },
    { name: "Alerts", icon: <Bell size={18} />, to: "/alerts" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Mental Health</h1>

      <div className="space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
