import { Routes, Route } from "react-router-dom";
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

export default function App() {
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

      {/* Morgan — Admin & Order History */}
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProductManagement />} />
    </Routes>
  );
}
