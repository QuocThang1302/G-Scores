import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import ReportPage from "../pages/ReportPage";
import SearchScorePage from "../pages/SearchScorePage";
import TopGroupAPage from "../pages/TopGroupAPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchScorePage />} />
      <Route path="/reports" element={<ReportPage />} />
      <Route path="/top-group-a" element={<TopGroupAPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
