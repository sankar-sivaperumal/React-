/* 
function Login(){

 return (  

<form  className = "my-5"style={{width:"25%",margin:"auto"}}>
    <h1 style={{textAlign:"center"}}>Login</h1>
  <div className="mb-3">
    <label  className="form-label">Email address</label>
    <input type="email" className="form-control"  />
  </div>
  <div className="mb-3" >
    <label  className="form-label">Password</label>
    <input   type="password" className="form-control" />
  </div>
  <button type="submit" className="btn btn-primary">Login</button>
</form>
    ); }

export default Login; */


import { useNavigate } from "react-router-dom";
import { useAuth } from "./Access/AuthContext";

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
      className="my-5"
      style={{ width: "25%", margin: "auto" }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ textAlign: "center" }}>Login</h1>

      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input type="email" className="form-control" required />
      </div>

      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" required />
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  );
}

export default Login;
