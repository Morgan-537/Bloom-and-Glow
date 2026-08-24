import { useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { selectOrderHistory } from "../../features/order/orderSlice";

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  // Reads the real shop catalog (same as Home/ProductDetail/Admin Product
  // Management) instead of the old admin-only mock copy, so this count and
  // export always match what's actually in the shop.
  const products = useSelector((s) => s.products.items);
  const orders = useSelector(selectOrderHistory);

  function exportProducts() {
    const rows = [
      ["ID", "Name", "Category", "Price", "Stock", "Status"],
      ...products.map((p) => [p.id, p.name, p.category, p.price, p.stock, p.status]),
    ];
    downloadCsv("products-report.csv", rows);
  }

  function exportOrders() {
    const rows = [
      ["Order #", "Customer", "Placed At", "Items", "Subtotal", "Delivery Fee", "Total", "Status"],
      ...orders.map((o) => [o.id, o.customer, o.placedAt, o.items.length, o.subtotal, o.deliveryFee, o.total, o.status]),
    ];
    downloadCsv("orders-report.csv", rows);
  }

  return (
    <AdminLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Reports</h1>
      <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
        Export product and order data for accounting or strategic planning
      </p>

      {/* Single column on phones, side-by-side from sm up — a fixed
          "1fr 1fr" row squeezed both cards unreadably thin on a phone. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ marginTop: 32, maxWidth: 760 }}>
        <Card>
          <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>Product Catalog Report</h3>
          <p style={{ color: "var(--color-gray)", fontSize: 13, marginBottom: 20 }}>
            {products.length} products currently in the catalog.
          </p>
          <Button variant="gradient" onClick={exportProducts}>
            Export CSV
          </Button>
        </Card>

        <Card>
          <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>Order History Report</h3>
          <p style={{ color: "var(--color-gray)", fontSize: 13, marginBottom: 20 }}>
            {orders.length} orders placed this session.
          </p>
          <Button variant="gradient" onClick={exportOrders} disabled={orders.length === 0}>
            Export CSV
          </Button>
        </Card>
      </div>
    </AdminLayout>
  );
}
