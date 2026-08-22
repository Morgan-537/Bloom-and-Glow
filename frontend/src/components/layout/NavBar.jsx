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

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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
      <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
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
    </header>
  );
}
