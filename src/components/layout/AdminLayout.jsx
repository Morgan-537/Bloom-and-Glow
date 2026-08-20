import { Link, useLocation } from "react-router-dom";

const SIDE_ITEMS = [
  { label: "Dashboard", to: "/admin" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Users & Roles", to: "/admin/users" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Reports", to: "/admin/reports" },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <aside
        style={{
          width: 240,
          background: "var(--color-dark)",
          color: "var(--color-white)",
          padding: "32px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 32px", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bloom &amp; Glow
          </div>
          <div style={{ fontSize: 11, color: "#b3aaac", marginTop: 4 }}>Admin Panel</div>
        </div>
        <nav>
          {SIDE_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                style={{
                  display: "block",
                  margin: "0 16px 8px",
                  padding: "10px 16px",
                  borderRadius: 8,
                  background: active ? "var(--gradient-primary)" : "transparent",
                  color: "var(--color-white)",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "40px 48px" }}>{children}</main>
    </div>
  );
}
