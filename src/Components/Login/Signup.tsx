import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import api from "../Forms/api";
import "../../App.css";

const secretKey = "myLocalSecretKey"; // Keep consistent with backend for dev

type Strength = "weak" | "medium" | "strong";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<boolean>(false);
  const [strength, setStrength] = useState<Strength>("weak");

  const getPasswordStrength = (pwd: string): Strength => {
    if (pwd.length < 8) return "weak";
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    if (hasUpper && hasNumber && hasSpecial) return "strong";
    return "medium";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setStrength(getPasswordStrength(value));

    setPasswordError(
      value.length < 8 ? "Password must be at least 8 characters long." : null
    );

    if (confirmPassword) setMatchError(value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setMatchError(password !== value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agree) {
      toast.error("You must agree to terms before signing up.");
      return;
    }

    if (passwordError || matchError) return;

    setLoading(true);

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

      await api.post("/users", {
        email,
        password: encryptedPassword,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="text-center mb-4">Signup</h1>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="form-control"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
          </div>

          {password && (
            <div className="password-strength mt-2">
              <div className={`strength-bar ${strength}`} />
              <small
                className={
                  strength === "weak"
                    ? "text-danger"
                    : strength === "medium"
                    ? "text-warning"
                    : "text-success"
                }
              >
                Strength: {strength.toUpperCase()}
              </small>
            </div>
          )}
          {passwordError && <small className="text-danger">{passwordError}</small>}
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              autoComplete="new-password"
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
          </div>
          {matchError && <small className="text-danger">Passwords do not match</small>}
        </div>

        {/* Agreement */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            className="form-check-input"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <label htmlFor="agree" className="form-check-label">
            I agree
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading || !!passwordError || matchError || !agree}
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
