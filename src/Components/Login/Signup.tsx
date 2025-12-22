import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Access/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { completeSignup } = useAuth();

  const [email, setEmail] = useState("");
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [match, setMatch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  function handlePwd1Change(e: React.ChangeEvent<HTMLInputElement>) {
    setPwd1(e.target.value);
    setMatch(e.target.value === pwd2);
  }

  function handlePwd2Change(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPwd2(value);
    setMatch(pwd1 === value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!match) return;

    // Basic password length validation
    if (pwd1.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    // Handle signup with Promise
    completeSignup(email, pwd1)
      .then(() => {
        navigate("/login");
      })
      .catch((err: unknown) => {
        setError("An error occurred. Please try again later.");
        if (err instanceof Error) {
          console.error(err.message); 
        } else {
          console.error(err); 
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Signup</h1>

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
              value={pwd1}
              onChange={handlePwd1Change}
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

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"} 
            className="form-control"
            required
            value={pwd2}
            onChange={handlePwd2Change}
          />
        </div>

        {!match && (
          <p style={{ color: "red", fontSize: "14px" }}>
            Passwords do not match
          </p>
        )}

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" required />
          <label className="form-check-label">I Agree</label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!match || loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <span
            style={{ color: "#0d6efd", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
