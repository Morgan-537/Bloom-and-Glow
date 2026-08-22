import { useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { selectOrderHistory } from "../../features/order/orderSlice";

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

export default function AdminDashboard() {
  const { stats, salesTrend, topProducts } = useSelector((s) => s.admin);
  const orders = useSelector(selectOrderHistory);
  const maxTrend = Math.max(...salesTrend);

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Dashboard Overview</h1>
      <p style={{ color: "var(--color-gray)", marginTop: 8 }}>Welcome back, Admin</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 32 }}>
        <StatCard label="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} />
        <StatCard label="Orders" value={stats.orders} />
        <StatCard label="Products" value={stats.products} />
        <StatCard label="Active Customers" value={stats.activeCustomers.toLocaleString()} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 24, marginTop: 24 }}>
        <Card>
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700 }}>
            Order Volume &amp; Sales Trend (30 days)
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200 }}>
            {salesTrend.map((v, i) => (
              <div
                key={i}
                title={`Day ${i + 1}: ${v}`}
                style={{
                  flex: 1,
                  height: `${(v / maxTrend) * 100}%`,
                  background: "var(--gradient-primary)",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Top Performing Products</h3>
          {topProducts.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: i < topProducts.length - 1 ? "1px solid var(--color-border)" : "none",
                fontSize: 13,
              }}
            >
              <span>{i + 1}. {p.name}</span>
              <span style={{ color: "var(--color-gray)" }}>{p.views} views</span>
            </div>
          ))}
        </Card>
      </div>

      <h3 style={{ marginTop: 32, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>Recent Orders</h3>
      <Card style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-gray)", fontSize: 11 }}>
              {["Order #", "Customer", "Date", "Total", "Status"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "20px", color: "var(--color-gray)", textAlign: "center" }}>
                  No orders have been placed yet.
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "14px 20px" }}>{o.id}</td>
                  <td style={{ padding: "14px 20px" }}>{o.customer}</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-gray)" }}>{formatDate(o.placedAt)}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: "var(--color-gray)" }}>{label}</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          marginTop: 8,
          color: "var(--color-primary)",
        }}
      >
        {value}
      </div>
    </Card>
  );
}
