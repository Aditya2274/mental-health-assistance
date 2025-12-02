// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth();

  // Show loading UI while verifying session (optional)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-lg font-medium text-slate-700">Checking authentication...</h2>
      </div>
    );
  }

  // If user is NOT logged in → redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If role doesn't match → send to 403 Forbidden
  if (role && user.role !== role) {
    console.log("ProtectedRoute User:", user);
    return <Navigate to="/403" replace />;
  }
  // Otherwise, allow access
  return children;
}
