import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      const role = result.payload.user.role;
      navigate(role === "admin" ? "/admin/dashboard" : "/shop");
    }
  };

  return (
    <div className="auth-page">
      <h1>Welcome back</h1>
      <p className="auth-subtitle">Log in to manage your orders and cart</p>
      <form onSubmit={handleSubmit}>
        <label>
          Email address
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <Link to="/forgot-password" className="forgot-link">
          Forgot password?
        </Link>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
