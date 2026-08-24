import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

const BASE_NAV_ITEMS = [
  { label: "Shop", to: "/" },
  { label: "Skincare", to: "/?category=Skincare" },
  { label: "Haircare", to: "/?category=Haircare" },
  { label: "Makeup", to: "/?category=Makeup" },
  { label: "Cart", to: "/cart" },
];

const linkStyle = (isActive) => ({
  fontSize: 14,
  textDecoration: "none",
  color: isActive ? "var(--color-primary)" : "var(--color-dark)",
  fontWeight: isActive ? 600 : 400,
});

// Same link, stacked full-width for the mobile dropdown.
const mobileLinkStyle = (isActive) => ({
  ...linkStyle(isActive),
  display: "block",
  padding: "12px 24px",
});

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  // Only matters below the md breakpoint (see the "md:hidden" panel below) —
  // desktop always shows the full nav regardless of this state.
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate("/login");
  };

  return (
    <header
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-white)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          height: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        <Link
          to="/"
          onClick={closeMenu}
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

        {/* Full nav — hidden below the md breakpoint (see the hamburger
            button + dropdown panel below), shown as a row from md up. */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 28 }}>
          {BASE_NAV_ITEMS.map((item) => (
            <Link key={item.label} to={item.to} style={linkStyle(location.pathname === item.to.split("?")[0])}>
              {item.label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link to="/admin" style={linkStyle(location.pathname.startsWith("/admin"))}>
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link to="/orders" style={linkStyle(location.pathname.startsWith("/orders"))}>
                My Orders
              </Link>
              <span style={{ fontSize: 13, color: "var(--color-gray)" }}>
                Hi, {user.fullName?.split(" ")[0] || "there"}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  fontSize: 14,
                  fontFamily: "inherit",
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--color-dark)",
                  cursor: "pointer",
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle(location.pathname === "/login")}>
                Login
              </Link>
              <Link to="/signup" style={linkStyle(location.pathname === "/signup")}>
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Hamburger — only shown below the md breakpoint. */}
        <button
          className="md:hidden"
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
          <span style={{ width: 22, height: 2, background: "var(--color-dark)", display: "block" }} />
          <span style={{ width: 22, height: 2, background: "var(--color-dark)", display: "block" }} />
          <span style={{ width: 22, height: 2, background: "var(--color-dark)", display: "block" }} />
        </button>
      </div>

      {/* Mobile dropdown — only rendered below the md breakpoint, and only
          while menuOpen is true. "md:hidden" guarantees it never shows on
          desktop even if menuOpen was left true from a resize. */}
      {menuOpen && (
        <nav
          className="md:hidden"
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-white)",
            boxShadow: "var(--shadow-card-hover)",
            paddingBottom: 8,
          }}
        >
          {BASE_NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={closeMenu}
              style={mobileLinkStyle(location.pathname === item.to.split("?")[0])}
            >
              {item.label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link to="/admin" onClick={closeMenu} style={mobileLinkStyle(location.pathname.startsWith("/admin"))}>
              Admin
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/orders"
                onClick={closeMenu}
                style={mobileLinkStyle(location.pathname.startsWith("/orders"))}
              >
                My Orders
              </Link>
              <div style={{ padding: "8px 24px", fontSize: 13, color: "var(--color-gray)" }}>
                Hi, {user.fullName?.split(" ")[0] || "there"}
              </div>
              <button
                onClick={handleLogout}
                style={{
                  ...mobileLinkStyle(false),
                  width: "100%",
                  textAlign: "left",
                  fontFamily: "inherit",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} style={mobileLinkStyle(location.pathname === "/login")}>
                Login
              </Link>
              <Link to="/signup" onClick={closeMenu} style={mobileLinkStyle(location.pathname === "/signup")}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
