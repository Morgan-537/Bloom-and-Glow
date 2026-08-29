import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import { selectOrderHistory, loadOrders } from "../../features/order/orderSlice";
import { loadUsers, selectUsers } from "../../features/admin/usersSlice";

function StatCard({ label, value }) {
  return (
    <Card>
      <div style={{ fontSize: 12, color: "var(--color-gray)" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 8, color: "var(--color-primary)" }}>{value}</div>
    </Card>
  );
}

export default function AdminAnalytics() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderHistory);
  const users = useSelector(selectUsers);

  useEffect(() => {
    dispatch(loadOrders());
    dispatch(loadUsers());
  }, [dispatch]);

  // Revenue by category (unchanged — still buckets under "Uncategorized"
  // since order line-items don't carry a category field; that's a
  // pre-existing limitation, not something this pass touches).
  const categoryTotals = orders.reduce((acc, o) => {
    o.items.forEach((item) => {
      const key = item.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + item.price * item.quantity;
    });
    return acc;
  }, {});
  const categoryEntries = Object.entries(categoryTotals);
  const maxCategory = Math.max(1, ...categoryEntries.map(([, v]) => v));

  // Total Revenue / Lifetime Sales — both derived from real order totals.
  // They read the same right now because every order you have is
  // "lifetime" — they'll only diverge if you later want Lifetime Sales to
  // mean something narrower (e.g. only delivered orders).
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lifetimeSales = totalRevenue;

  // Active Customers — real count of non-disabled accounts with the
  // customer role, pulled from the real /api/users list.
  const activeCustomers = users.filter((u) => u.role === "customer" && !u.disabled).length;

  // Sales Trend (last 12 days) — real orders bucketed by the day they were
  // placed (using each order's real placedAt timestamp). With only a
  // couple of test orders so far, most bars will legitimately read $0 —
  // that's correct, not a bug.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last12Days = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (11 - i));
    return d;
  });
  const salesTrend = last12Days.map((day) => {
    const dayKey = day.toDateString();
    return orders
      .filter((o) => o.placedAt && new Date(o.placedAt).toDateString() === dayKey)
      .reduce((sum, o) => sum + o.total, 0);
  });
  const maxTrend = Math.max(1, ...salesTrend);

  // Top Selling Products — replaces "Top Viewed Products". The backend
  // has no page-view tracking at all, so there's no real data behind a
  // "views" number; units actually sold (from real order line-items) is
  // the closest real equivalent.
  const productTotals = orders.reduce((acc, o) => {
    o.items.forEach((item) => {
      const key = item.name || "Unknown product";
      acc[key] = (acc[key] || 0) + item.quantity;
    });
    return acc;
  }, {});
  const topProducts = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, qty]) => ({ name, qty }));

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Analytics</h1>
      <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
        Sales performance, order volume, and customer behavior
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginTop: 32 }}>
        <StatCard label="Lifetime Sales" value={`$${lifetimeSales.toFixed(2)}`} />
        <StatCard label="Total Orders" value={orders.length} />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard label="Active Customers" value={activeCustomers.toLocaleString()} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ marginTop: 24 }}>
        <Card className="lg:col-span-2">
          <h3 style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 700 }}>Sales Trend (last 12 days)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200 }}>
            {salesTrend.map((v, i) => (
              <div
                key={i}
                title={`${last12Days[i].toLocaleDateString()}: $${v.toFixed(2)}`}
                style={{
                  flex: 1,
                  height: `${(v / maxTrend) * 100}%`,
                  background: "var(--gradient-primary)",
                  borderRadius: 4,
                  minHeight: v > 0 ? 4 : 0,
                }}
              />
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700 }}>Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p style={{ color: "var(--color-gray)", fontSize: 13, margin: 0 }}>
              No orders placed yet — place an order to see this fill in.
            </p>
          ) : (
            topProducts.map((p, i) => (
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
                <span style={{ color: "var(--color-gray)" }}>{p.qty} sold</span>
              </div>
            ))
          )}
        </Card>
      </div>
      <h3 style={{ marginTop: 32, marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
        Revenue by Category
      </h3>
      <Card>
        {categoryEntries.length === 0 ? (
          <p style={{ color: "var(--color-gray)", fontSize: 13, margin: 0 }}>
            No orders placed yet — place an order to see this fill in.
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
