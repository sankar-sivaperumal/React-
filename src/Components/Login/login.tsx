import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Access/AuthContext";
import api from "../Forms/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      login(email, res.data.access_token);
      toast.success(`Logged in as ${email}`);

      navigate("/Formpage");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper mt-5 d-flex justify-content-center">
      <form
        className="auth-form p-4 border rounded shadow bg-white"
        style={{ width: "400px" }}
        onSubmit={handleSubmit}
      >
        <h1 className="text-center mb-4">Login</h1>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label" htmlFor="loginEmail">
            Email
          </label>
          <input
            type="email"
            id="loginEmail"
            name="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label" htmlFor="loginPassword">
            Password
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="loginPassword"
              name="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            "Login"
          )}
        </button>

        {/* Signup link */}
        <div className="text-center mt-3">
          <p className="mb-0">
            Don’t have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
