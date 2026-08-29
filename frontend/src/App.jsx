import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { loadProducts } from "./features/products/productsSlice";
import { restoreSession } from "./features/auth/authSlice";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminReports from "./pages/admin/AdminReports";
import ProtectedRoute from "./components/ProtectedRoute";

function AdminRoute({ children }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}

export default function App() {
  const dispatch = useDispatch();

  // Single bootstrap point for the shop catalog — fetched from the real
  // backend (see productsSlice.js). Also restores a logged-in session from
  // a saved JWT (see authSlice.js's restoreSession) so refreshing the page
  // doesn't silently log the user out.
  useEffect(() => {
    dispatch(loadProducts());
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Routes>
      {/* Elvis — Shop & Discovery */}
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Damaris — Auth & Account */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Timothy — Cart & Checkout */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/orders/:id" element={<OrderConfirmation />} />

      {/* Morgan — Admin & Order History */}
      <Route path="/orders" element={<OrderHistory />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProductManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <AdminReports />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
