import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #0f2027,#203a43, #2c5364)"
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          width: 300,
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
        }}
      >
        <h1 style={{ textAlign: "center", color: "black" }}>Welcome to ILES</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />

        <select
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        >
          <option value="">Login as...</option>
          <option value="student">Student</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 15,
            background: "linear-gradient(to right, #0f2027,#203a43, #2c5364)",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
          <select 
          value = {role}
          onChange={(e) => setRole(e.target.value)}
          style = {{ width : "100%", padding: 10, marginTop: 10 }}
          >
            <option value="">Login as...</option>
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </button>
        <p style = {{marginTop: 10, textAlign: "center"}}>
          <span style={{ cursor: "pointer" , color: "#0a192f"}}>
            Forgot Password?
            </span>
        </p>

        <p style = {{textAlign: "center"}}>
          Don't have an account?{" "}
          <span style={{ cursor: "pointer" , color: "#0a192f" , fontWeight: "bold"}}
            onClick={() => navigate("/Signup")}
            >
            Sign Up
            </span>
        </p>
      </form>

      <p style = {{ marginTop: 20, color: "white", textAlign: "center", fontSize: 12 }}>
        Need help? Contact us;
        <br />
        Email: support@iles.com
        <br />
        Phone: +256 776 083 497
      </p>
    </div>
  );
}

export default Welcome;