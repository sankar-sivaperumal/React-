import { toast } from "react-toastify";
import { useAuth } from "../Access/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const { completeLogin, isSignedUp, users } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isSignedUp) {
      setError("Please signup first");
      return;
    }

    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid email or password");
      return;
    }

    completeLogin(user.email);
    toast.success(`Logged in as ${user.email}`);
    navigate("/Formpage");
  }

  return (
    <form
      className="my-5 p-4 border rounded shadow-sm"
      style={{ width: "25%", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center mb-4">Login</h1>

      {error && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {error}
        </p>
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
        <input
          type="password"
          className="form-control"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100 mb-3">
        Login
      </button>

      <p className="text-center mb-0">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-decoration-none">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default Login;
