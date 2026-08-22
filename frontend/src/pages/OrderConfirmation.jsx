import Layout from "../components/layout/Layout";
import OrderConfirmationPage from "../features/order/OrderConfirmationPage";

// Owned by Timothy (feature/cart-checkout-timothy) — Figma frame
// "07 - Order Confirmation & Invoice". Also used for /orders/:id so a past
// order's invoice can be reopened from Order History.
export default function OrderConfirmation() {
  return (
    <Layout>
      <OrderConfirmationPage />
    </Layout>
  );
}
