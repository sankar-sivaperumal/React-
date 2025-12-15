import  { useState } from "react";

function Login() {
    const [pwd1,setPwd1]=useState("");
    const [pwd2,setPwd2]=useState("");
    const [match,setMatch]=useState(true);

function handlePwd1Change(event: any){
    setPwd1 (event.target.value);
}
function handlePwd2Change(event: any){
    setPwd2 (event.target.value);
        if(pwd1 == event.target.value){
            console.log("Matched")
            setMatch(true)
        
    }
    else{
         console.log("Not-Matched")
            setMatch(false)
    }
}
  return (  

<form  className = "my-5"style={{width:"25%",margin:"auto"}}>
    <h1 style={{textAlign:"center"}}>Login</h1>
  <div className="mb-3">
    <label  className="form-label">Email address</label>
    <input type="email" className="form-control"  />
  </div>
  <div className="mb-3" >
    <label  className="form-label">Password</label>
    <input  value ={pwd1} onChange={handlePwd1Change} type="password" className="form-control" />
  </div>
  <div className="mb-3">
    <label  className="form-label">Confrim Password</label>
    <input value={pwd2}  onChange={handlePwd2Change} type="password" className="form-control" />
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox"  className="form-check-input"  />
    <label className="form-check-label" >I Agree</label>
  </div>
  {!match && <p style={{color:"red"}}>Password do not match</p>}
  <button type="submit" className="btn btn-primary">Create Account</button>
</form>
    ); }

export default Login;