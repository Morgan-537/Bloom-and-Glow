import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function ShopPlaceholder() {
  return <h1>Shop (customer area) - Elvis's section</h1>;
}

function AdminDashboardPlaceholder() {
  return <h1>Admin dashboard - your admin teammate's section</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <ShopPlaceholder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPlaceholder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
