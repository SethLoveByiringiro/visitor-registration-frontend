import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import ReceptionistLogin from "./pages/ReceptionistLogin";
import VisitorRegistration from "./pages/VisitorRegistration";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<VisitorRegistration />} />
      <Route path="/login" element={<ReceptionistLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<ReceptionistDashboard />} />
        {/* Add any other protected routes here */}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
