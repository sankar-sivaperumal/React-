import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Access/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    completeLogin();
    navigate("/Formpage");
  }

  return (
    <form
      className="my-5 p-4 border rounded shadow-sm"
      style={{ width: "25%", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 className="text-center mb-4">Login</h1>

      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input type="email" className="form-control" required />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" required />
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
