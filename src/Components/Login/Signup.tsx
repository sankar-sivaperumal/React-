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

  function handlePwd1Change(event: React.ChangeEvent<HTMLInputElement>) {
    setPwd1(event.target.value);
    setMatch(event.target.value === pwd2);
  }

  function handlePwd2Change(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setPwd2(value);
    setMatch(pwd1 === value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!match) return;

    completeSignup(email, pwd1);
    navigate("/login");
  }

  return (
    <form
      className="my-5"
      style={{ width: "25%", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ textAlign: "center" }}>Signup</h1>

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
          value={pwd1}
          onChange={handlePwd1Change}
          type="password"
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Confirm Password</label>
        <input
          value={pwd2}
          onChange={handlePwd2Change}
          type="password"
          className="form-control"
          required
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

      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </form>
  );
}

export default Signup;
