import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { selectOrderHistory, updateOrderStatus } from "../../features/order/orderSlice";

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
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

export default function AdminOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrderHistory);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      (statusFilter === "All" || o.status === statusFilter) &&
      (o.id.toLowerCase().includes(search.toLowerCase()) ||
        (o.customer || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Orders</h1>
      <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
        Track and fulfil every order submitted through the shop
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <input
          placeholder="Search by order # or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            maxWidth: 400,
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: 13,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: 13,
          }}
        >
          {["All", ...STATUSES].map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>
      </div>

      <Card style={{ padding: 0, marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-gray)", fontSize: 11 }}>
              {["Order #", "Customer", "Date", "Items", "Total", "Status", "Update Status"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: "center", color: "var(--color-gray)" }}>
                  No orders match.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "14px 20px" }}>{o.id}</td>
                  <td style={{ padding: "14px 20px" }}>{o.customer}</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-gray)" }}>{formatDate(o.placedAt)}</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-gray)" }}>{o.items.length}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 600 }}>${o.total.toFixed(2)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>{o.status}</Badge>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <select
                      value={o.status}
                      onChange={(e) => dispatch(updateOrderStatus({ id: o.id, status: e.target.value }))}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
