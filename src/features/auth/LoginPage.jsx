import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, user } = useSelector((state) => state.auth);

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
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
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
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
