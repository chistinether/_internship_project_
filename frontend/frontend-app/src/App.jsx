import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import "./App.css";
<div className= "container"> <h1>Internship Logging and Evaluation System</h1> </div>

function App() {
  return (
    <div className = "login-page">
      <div className="welcome-text">
        <h1>Welcome to</h1>
        <h1>ILES</h1></div>
      <div className = "login-box">
        <h2>Login</h2>

        <form>
          <label>Email:</label>
          <input type = "email" placeholder = "Email:" required />
          <label>Password:</label>
          <input type = "password" placeholder = "Password:" required />
          
          <div className = "login-buttons">
            <button type = "button">Login as Student</button>
            <button type = "button">Login as Supervisor</button>
            <button type = "button">Login as Admin</button>
          </div>
          <div className = "extra-links ">
            <a href = "#">Forgot Password?</a>
            <p>Don't have an account?<a href = "#">Signup</a></p>
            </div>
          </form>

          <div className = "contact-info">
            <p>Need help?Contact us</p>
            <p>Email: 
              <a href = "mail to:support.ILES@gmail.com">Support.ILES@gmail.com</a></p>
            <p>Phone:
              <span
                className = "phone"
                onClick = {()=>{
                  navigator.clipboard.writeText("+256776083497");
                  alert("Phone number copied!");
                }}>+256 776 083497</span> </p>
          </div>
        </div>
    </div>
  );
}

export default App;