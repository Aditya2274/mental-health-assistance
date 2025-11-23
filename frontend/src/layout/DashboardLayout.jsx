import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        <Navbar />

        <main className="p-6">
          {children}
        </main>
      </div>

    </div>
  );
}
