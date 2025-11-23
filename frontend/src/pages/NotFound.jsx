import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page not found</h1>
      <p className="text-gray-600 mb-6">We couldn't find that page.</p>
      <Link to="/parent" className="bg-blue-600 text-white px-4 py-2 rounded">
        Go back to dashboard
      </Link>
    </div>
  );
}