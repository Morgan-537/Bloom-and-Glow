import { useState } from "react";
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
  // Only matters below the md breakpoint — the fixed 240px sidebar below
  // (shown from md up) doesn't fit a phone-width screen, so this drives a
  // collapsible top bar instead, mirroring the shop NavBar's pattern.
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Mobile top bar — hidden from md up, where the sidebar takes over. */}
      <div
        className="md:hidden"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "var(--color-dark)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bloom &amp; Glow
          </div>
          <div style={{ fontSize: 11, color: "#b3aaac" }}>Admin Panel</div>
        </div>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ width: 22, height: 2, background: "var(--color-white)", display: "block" }} />
          <span style={{ width: 22, height: 2, background: "var(--color-white)", display: "block" }} />
          <span style={{ width: 22, height: 2, background: "var(--color-white)", display: "block" }} />
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden" style={{ background: "var(--color-dark)", paddingBottom: 12 }}>
          {SIDE_ITEMS.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
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
      )}

      <div style={{ display: "flex" }}>
        {/* Fixed sidebar — hidden below md, unchanged from md up. */}
        <aside
          className="hidden md:block"
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

        <main className="flex-1 px-5 py-8 md:px-12 md:py-10">{children}</main>
      </div>
    </div>
  );
}
