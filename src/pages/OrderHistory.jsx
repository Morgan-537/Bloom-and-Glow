import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import Badge from "../components/ui/Badge";

const STATUS_TONE = { Delivered: "success", Processing: "pending", Cancelled: "neutral" };

export default function OrderHistory() {
  const orders = useSelector((s) => s.orders.history);

  return (
    <Layout>
      <div style={{ maxWidth: 1344, margin: "0 auto", padding: "48px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>My Orders</h1>
        <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
          Track and review your past purchases and invoices
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 32, fontSize: 13 }}>
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
                <td style={{ padding: "16px 0", color: "var(--color-gray)" }}>{o.date}</td>
                <td style={{ padding: "16px 0", color: "var(--color-gray)" }}>{o.items} items</td>
                <td style={{ padding: "16px 0", fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                <td style={{ padding: "16px 0" }}>
                  <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge>
                </td>
                <td style={{ padding: "16px 0" }}>
                  <a href="#" style={{ color: "var(--color-primary)", fontSize: 12, textDecoration: "none" }}>
                    Download PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
