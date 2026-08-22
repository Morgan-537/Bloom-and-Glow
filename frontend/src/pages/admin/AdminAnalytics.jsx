import { useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import { selectOrderHistory } from "../../features/order/orderSlice";

function StatCard({ label, value }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: "var(--color-gray)" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8, color: "var(--color-primary)" }}>{value}</div>
    </Card>
  );
}

export default function AdminAnalytics() {
  const { stats, salesTrend, topProducts } = useSelector((s) => s.admin);
  const orders = useSelector(selectOrderHistory);
  const maxTrend = Math.max(...salesTrend);

  const categoryTotals = orders.reduce((acc, o) => {
    o.items.forEach((item) => {
      acc[item.category] = (acc[item.category] || 0) + item.price * item.quantity;
    });
    return acc;
  }, {});
  const categoryEntries = Object.entries(categoryTotals);
  const maxCategory = Math.max(1, ...categoryEntries.map(([, v]) => v));
  const sessionRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Analytics</h1>
      <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
        Sales performance, order volume, and customer behavior
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 32 }}>
        <StatCard label="Lifetime Sales" value={`$${stats.totalSales.toLocaleString()}`} />
        <StatCard label="Orders (this session)" value={orders.length} />
        <StatCard label="Revenue (this session)" value={`$${sessionRevenue.toFixed(2)}`} />
        <StatCard label="Active Customers" value={stats.activeCustomers.toLocaleString()} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 24, marginTop: 24 }}>
        <Card>
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700 }}>Sales Trend (last 12 days)</h3>
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
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Top Viewed Products</h3>
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

      <h3 style={{ marginTop: 32, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
        Revenue by Category (this session)
      </h3>
      <Card>
        {categoryEntries.length === 0 ? (
          <p style={{ color: "var(--color-gray)", fontSize: 13, margin: 0 }}>
            No orders placed yet this session — place an order to see this fill in.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {categoryEntries.map(([category, total]) => (
              <div key={category}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span>{category}</span>
                  <span style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "var(--color-border)" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(total / maxCategory) * 100}%`,
                      borderRadius: 999,
                      background: "var(--gradient-primary)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
