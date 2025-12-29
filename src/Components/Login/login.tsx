import React, { useState } from "react";
import { useAuth } from "../Access/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import api from "../Forms/api";
import "../../App.css";

const secretKey = "myLocalSecretKey"; // Keep consistent with backend

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      const res = await api.post("/auth/login", {
        email,
        password: encryptedPassword,
      });

      login(email, res.data.access_token);
      toast.success(`Logged in as ${email}`);
      navigate("/Formpage");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
};

export default Login;
