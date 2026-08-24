import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Badge from "../components/ui/Badge";
import { selectOrderHistory } from "../features/order/orderSlice";

const STATUS_TONE = {
  Processing: "pending",
  Shipped: "pending",
  Delivered: "success",
  Cancelled: "danger",
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrderHistory() {
  const orders = useSelector(selectOrderHistory);

  return (
    <Layout>
      <div className="p-5 md:p-12" style={{ maxWidth: 1344, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>My Orders</h1>
        <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
          Track and review your past purchases and invoices
        </p>

        {orders.length === 0 ? (
          <p style={{ color: "var(--color-gray)", marginTop: 32 }}>
            You haven't placed any orders yet. <Link to="/">Start shopping</Link>
          </p>
        ) : (
          // Scrolls horizontally on narrow screens instead of forcing the
          // whole page wider or squeezing 6 columns unreadably thin.
          <div style={{ overflowX: "auto", marginTop: 32 }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "var(--color-gray)", fontSize: 11 }}>
                  {["Order #", "Date", "Items", "Total", "Status", "Invoice"].map((h) => (
                    <th key={h} style={{ padding: "12px 0", fontWeight: 600, borderBottom: "1px solid var(--color-border)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "16px 0", fontWeight: 500 }}>{o.id}</td>
                    <td style={{ padding: "16px 0", color: "var(--color-gray)" }}>{formatDate(o.placedAt)}</td>
                    <td style={{ padding: "16px 0", color: "var(--color-gray)" }}>{o.items.length} items</td>
                    <td style={{ padding: "16px 0", fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                    <td style={{ padding: "16px 0" }}>
                      <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge>
                    </td>
                    <td style={{ padding: "16px 0" }}>
                      <Link to={`/orders/${o.id}`} style={{ color: "var(--color-primary)", fontSize: 12, textDecoration: "none" }}>
                        View Invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
