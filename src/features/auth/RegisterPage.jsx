import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "./authSlice";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConfirmError("");

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }

    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate("/shop");
    }
  };

  return (
    <div className="auth-page">
      <h1>Create your account</h1>
      <p className="auth-subtitle">Join to start shopping beauty essentials</p>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {confirmError && <p className="error-text">{confirmError}</p>}
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
