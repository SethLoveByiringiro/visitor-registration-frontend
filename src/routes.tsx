// src/routes.tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import VisitorRegistration from "./pages/VisitorRegistration";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<VisitorRegistration />} />
    </Routes>
  </Router>
);

export default AppRoutes;
