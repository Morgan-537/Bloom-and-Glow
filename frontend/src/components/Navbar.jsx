import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Bloom &amp; Glow</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">
              {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
