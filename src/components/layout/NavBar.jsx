import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Shop", to: "/" },
  { label: "Skincare", to: "/?category=Skincare" },
  { label: "Haircare", to: "/?category=Haircare" },
  { label: "Makeup", to: "/?category=Makeup" },
  { label: "Cart", to: "/cart" },
  { label: "Account", to: "/login" },
];

export default function NavBar() {
  const location = useLocation();
  return (
    <header
      style={{
        height: 84,
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        background: "var(--color-white)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: 22,
          fontWeight: 700,
          background: "var(--gradient-primary)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none",
        }}
      >
        Bloom &amp; Glow
      </Link>
      <nav style={{ display: "flex", gap: 32 }}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            style={{
              fontSize: 14,
              textDecoration: "none",
              color: location.pathname === item.to.split("?")[0] ? "var(--color-primary)" : "var(--color-dark)",
              fontWeight: location.pathname === item.to.split("?")[0] ? 600 : 400,
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
