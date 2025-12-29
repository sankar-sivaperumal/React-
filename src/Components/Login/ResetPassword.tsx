import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../Forms/api";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

const secretKey = "myLocalSecretKey";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }
    setLoading(true);
    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      await api.post("/auth/reset-password", {
        token,
        password: encryptedPassword,
      });

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper mt-5 d-flex justify-content-center">
      <form className="auth-form p-4 border rounded shadow bg-white" style={{ width: 400 }} onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Reset Password</h2>
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
