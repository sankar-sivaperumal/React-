import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../Forms/api";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset link is invalid or expired");
      navigate("/forgot-password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password, // send plain password via HTTPS
      });

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper mt-5 d-flex justify-content-center">
      <form
        className="auth-form p-4 border rounded shadow bg-white"
        style={{ width: 400 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-center mb-4">Reset Password</h2>

        {/* New Password */}
        <div className="mb-3">
          <label className="form-label" htmlFor="newPassword">
            New Password
          </label>
          <div className="position-relative">
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <span
              className="position-absolute"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="position-relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <span
              className="position-absolute"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              <i
                className={`fa ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                }`}
              />
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Login link */}
        <div className="text-center mt-3">
          <span>Remember your password? </span>
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
