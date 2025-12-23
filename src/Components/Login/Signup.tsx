import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Forms/api";

type Strength = "weak" | "medium" | "strong";

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [match, setMatch] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [strength, setStrength] = useState<Strength>("weak");

  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* PASSWORD STRENGTH LOGIC */
  function getPasswordStrength(password: string): Strength {
    if (password.length < 8) return "weak";

    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (hasUpper && hasNumber && hasSpecial) return "strong";
    return "medium";
  }

  function handlePwd1Change(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPwd1(value);

    setStrength(getPasswordStrength(value));

    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError(null);
    }

    if (confirmTouched) {
      setMatch(value === pwd2);
    }
  }

  function handlePwd2Change(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPwd2(value);
    setConfirmTouched(true);
    setMatch(pwd1 === value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agree) {
      setAgreeError(true);
      return;
    }

    if (passwordError || !match) return;

    setLoading(true);
    setError(null);

    try {
      await api.post("/users", {
        email,
        password: pwd1,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              required
              value={pwd1}
              onChange={handlePwd1Change}
              autoComplete="new-password"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
          </div>

          {/* Strength Meter */}
          {pwd1 && (
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

          {passwordError && (
            <small className="text-danger">{passwordError}</small>
          )}
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
              required
              value={pwd2}
              onChange={handlePwd2Change}
              autoComplete="new-password"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </span>
          </div>

          {confirmTouched && !match && (
            <small className="text-danger">Passwords do not match</small>
          )}
        </div>

        {/* Agreement */}
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            className="form-check-input"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setAgreeError(false);
            }}
          />
          <label className="form-check-label" htmlFor="agree">
            I agree
          </label>

          {agreeError && (
            <small className="text-danger d-block">
              You must agree before creating an account
            </small>
          )}
        </div>

        {/* API Error */}
        {error && <p className="text-danger">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading || !!passwordError || !match || !agree}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Login Link */}
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
}

export default Signup;
