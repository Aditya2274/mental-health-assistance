import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext.jsx";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";

// Public
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/Extras/NotFound.jsx";
import Forbidden403 from "@/pages/Extras/Forbidden403.jsx";

// Parent
import ParentDashboardLayout from "@/layout/parent/ParentDashBoardLayout";
import ParentDashboard from "@/pages/Parents/ParentDashboard.jsx";
import Children from "@/pages/Parents/Children.jsx";
import ChildProfile from "@/pages/Parents/ChildProfile.jsx";
import SubmitAssessment from "@/pages/Parents/SubmitAssessment.jsx";
import ParentAlerts from "@/pages/Parents/ParentAlerts.jsx";
import ParentSettings from "@/pages/Parents/ParentSettings.jsx";
import ParentReports from "@/pages/Parents/ParentReports.jsx";
import EditChild from "@/pages/Parents/EditChild";

// Teacher
import TeacherDashboardLayout from "@/layout/teacher/TeacherDashboardLayout.jsx";
import TeacherDashBoard from "@/pages/Teachers/TeacherDashBoard.jsx";
import TeacherChildren from "@/pages/Teachers/TeacherChildren.jsx";
import TeacherAssessments from "@/pages/Teachers/TeacherAssessments.jsx";
import WeeklyCheckins from "@/pages/Teachers/WeeklyCheckins.jsx";
import TeacherAlerts from "@/pages/Teachers/TeacherAlerts.jsx";
import TeacherSettings from "@/pages/Teachers/TeacherSettings.jsx";
import TaskBoard from "@/pages/Teachers/TaskBoard.jsx";

// Counsellor
import CounsellorDashboardLayout from "@/layout/counsellor/CounsellorDashboardLayout.jsx";
import CounsellorDashboard from "@/pages/CounsellorPages/CounsellorDashboard.jsx";
import CounsellorStudents from "@/pages/CounsellorPages/CounsellorStudents.jsx";
import CounsellorAlerts from "@/pages/CounsellorPages/CounsellorAlerts.jsx";
import AssessmentReview from "@/pages/CounsellorPages/AssessmentReview.jsx";

// Admin
import AdminDashboard from "@/pages/AdminPages/AdminDashboard.jsx";
import AdminDashboardLayout from "./layout/admin/AdminDashboardLayout.jsx";
import UsersManagement from "@/pages/AdminPages/UsersManagement.jsx";
import ChildrenManagement from "@/pages/AdminPages/ChildrenManagement.jsx";
import SystemAlerts from "@/pages/AdminPages/SystemAlerts.jsx";
import Reports from "@/pages/AdminPages/Reports.jsx";

export default function App() {
  return (
        <Routes>

          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
           {/* Admin Routes */}
          <Route path="/admin" element={
          <ProtectedRoute role="admin">
             <AdminDashboardLayout />
          </ProtectedRoute>
           }>
           <Route index element={<AdminDashboard />} />
           <Route path="users" element={<UsersManagement />} />
           <Route path="children" element={<ChildrenManagement />} />
           <Route path="alerts" element={<SystemAlerts />} />
           <Route path="reports" element={<Reports />} />
           </Route>

          {/* Parent Routes */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute role="parent">
                <ParentDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="children" element={<Children />} />
            <Route path="children/:id" element={<ChildProfile />} />
             <Route path="children/:id/edit" element={<EditChild />} />
            <Route path="assessments" element={<SubmitAssessment />} />
            <Route path="alerts" element={<ParentAlerts />} />
            <Route path="settings" element={<ParentSettings />} />
            <Route path="reports" element={<ParentReports />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashBoard />} />
            <Route path="children" element={<TeacherChildren />} />
            <Route path="assessments" element={<TeacherAssessments />} />
            <Route path="checkins" element={<WeeklyCheckins />} />
            <Route path="alerts" element={<TeacherAlerts />} />
            <Route path="settings" element={<TeacherSettings />} />
            <Route path="taskboard" element={<TaskBoard />} />
          </Route>

          {/* Counsellor Routes */}
           <Route
             path="/counsellor"
             element={
               <ProtectedRoute role="counsellor">
                 <CounsellorDashboardLayout />
               </ProtectedRoute>
             }
           >
             <Route index element={<CounsellorDashboard />} />
             <Route path="students" element={<CounsellorStudents />} />
             <Route path="alerts" element={<CounsellorAlerts />} />
             <Route path="review/:id" element={<AssessmentReview />} />
             {/* <Route path="settings" element={<CounsellorSettings />} /> */}
           </Route>
           

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><UsersManagement /></ProtectedRoute>} />
          <Route path="/admin/children" element={<ProtectedRoute role="admin"><ChildrenManagement /></ProtectedRoute>} />
          <Route path="/admin/alerts" element={<ProtectedRoute role="admin"><SystemAlerts /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />

          {/* Errors */}
          <Route path="/403" element={<Forbidden403 />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>
  );
}
