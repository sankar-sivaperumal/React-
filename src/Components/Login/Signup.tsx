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

    completeSignup(email, pwd1);
    navigate("/login");
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
          <input
            type="password"
            className="form-control"
            required
            value={pwd1}
            onChange={handlePwd1Change}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
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

        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" required />
          <label className="form-check-label">I Agree</label>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!match}
        >
          Create Account
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
