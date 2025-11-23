import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ParentDashboard from "./pages/ParentDashboard";
import Children from "./pages/Children";
import Assessments from "./pages/Assessments";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected / app routes (for now not guarded) */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/children" element={<ParentDashboard><Children /></ParentDashboard>} />
        <Route path="/assessments" element={<ParentDashboard><Assessments /></ParentDashboard>} />
        <Route path="/alerts" element={<ParentDashboard><Alerts /></ParentDashboard>} />

        {/* catch-all */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
