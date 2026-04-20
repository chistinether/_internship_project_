import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import DashboardLayout from "./components/DashboardLayout";
import React, {useEffect, useState} from "react";
import Navbar from "./components/Navbar";

return(
<div className= "container"> <h1>Internship Logging and Evaluation System</h1> </div>
)

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/api/user")
      .then(res =>{
          if (!res.ok) {
            throw new Error("Failed to fetch user data");
      }
      return res.json();
      })
      .then(data => {
        setRole(data.role);
        setLoading(false);})
      .catch(err => {
        console.error("Error fetching user data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>  Loading...</p>;
  
  }

  return(
    <div>
      <Navbar />
      {role ?(
        <DashboardLayout role = {role}/>
      ) : (
        <p>No role assigned.Please log in again</p>
      )}
    </div>
  );


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