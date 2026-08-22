import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { addProduct, deleteProduct } from "../../features/admin/adminSlice";

const STATUS_TONE = { Active: "success", "Low Stock": "pending", "Out of Stock": "danger" };
const CATEGORIES = ["All", "Skincare", "Haircare", "Makeup"];

export default function AdminProductManagement() {
  const products = useSelector((s) => s.admin.products);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || p.category === category)
  );

  function handleAddProduct() {
    const name = prompt("Product name?");
    if (!name) return;
    dispatch(
      addProduct({
        id: Date.now(),
        name,
        category: "Skincare",
        price: 0,
        stock: 0,
        status: "Active",
      })
    );
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Product Management</h1>
          <p style={{ color: "var(--color-gray)", marginTop: 8 }}>
            Create, update, and manage the product catalog
          </p>
        </div>
        <Button variant="gradient" onClick={handleAddProduct}>+ Add Product</Button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <input
          placeholder="Search products..."
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            fontSize: 13,
          }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>Category: {c}</option>
          ))}
        </select>
      </div>

      <Card style={{ padding: 0, marginTop: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-gray)", fontSize: 11 }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "14px 20px", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                <td style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover", background: "var(--color-img-placeholder)" }}
                  />
                  {p.name}
                </td>
                <td style={{ padding: "14px 20px", color: "var(--color-gray)" }}>{p.category}</td>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                <td style={{ padding: "14px 20px" }}>{p.stock}</td>
                <td style={{ padding: "14px 20px" }}>
                  <Badge tone={STATUS_TONE[p.status] ?? "neutral"}>{p.status}</Badge>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button style={{ background: "none", border: "none", color: "var(--color-primary)", fontSize: 12, marginRight: 16, cursor: "pointer" }}>
                    Edit
                  </button>
                  <button
                    onClick={() => dispatch(deleteProduct(p.id))}
                    style={{ background: "none", border: "none", color: "var(--color-danger)", fontSize: 12, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p style={{ color: "var(--color-gray)", fontSize: 12, marginTop: 12 }}>
        Showing {filtered.length} of {products.length} products
      </p>
    </AdminLayout>
  );
}
