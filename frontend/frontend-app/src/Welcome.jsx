import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const pageStyle = {
    background: "linear-gradient(to right, #001f3f, #003366)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    textAlign: "center"
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  };

  const buttonStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#001f3f",
    color: "white",
    fontSize: "16px",
    cursor: "pointer"
  };

  const buttonHover = (e) => {
    e.target.style.backgroundColor = "#003366";
  };

  const buttonOut = (e) => {
    e.target.style.backgroundColor = "#001f3f";
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        
        {/* Welcome Text */}
        <div>
          <h3 style={{ margin: 0, color: "#555" }}>WELCOME TO</h3>
          <h1 style={{ margin: 0, color: "#001f3f" }}>ILES</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="email"
            placeholder="Email address"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={buttonHover}
            onMouseOut={buttonOut}
          >
            Login
          </button>
        </form>

        {/* Extra Text */}
        <p style={{ fontSize: "12px", color: "#777" }}>
          Forgot password?
        </p>

      </div>
    </div>
  );
}

export default Welcome;