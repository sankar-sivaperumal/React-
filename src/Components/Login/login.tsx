import { toast } from "react-toastify";
import { useAuth } from "../Access/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import bcrypt from "bcryptjs";

function Login() {
  const navigate = useNavigate();
  const { completeLogin, isSignedUp, users } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isSignedUp) {
      setError("Please signup first.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    // Find user by email
    const user = users.find((u) => u.email === email);

    if (!user) {
      setError("Invalid credentials");
      return;
    }

    // Check hashed password
    if (!bcrypt.compareSync(password, user.password)) {
      setError("Invalid credentials");
      return;
    }

    setLoading(true);
    completeLogin(user.email, password); 
    toast.success(`Logged in as ${user.email}`);
    navigate("/Formpage");
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} 
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)} 
              style={{ marginLeft: "8px" }}
            />
            <label style={{ marginLeft: "5px" }}>Show Password</label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mb-0">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-decoration-none">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
