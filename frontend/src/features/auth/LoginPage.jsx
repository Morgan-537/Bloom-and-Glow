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
      navigate(role === "admin" ? "/admin" : "/");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-lg border border-pink-100 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-8">
          Log in to manage your orders and cart
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-pink-600 hover:text-pink-700 self-end -mt-2"
          >
            Forgot password?
          </Link>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-md transition-colors mt-2"
          >
            {status === "loading" ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-600 hover:text-pink-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
