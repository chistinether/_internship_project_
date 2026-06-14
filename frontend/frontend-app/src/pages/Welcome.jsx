import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    // role-based navigation
    if (role === "student") navigate("/student-dashboard");
    else if (role === "supervisor") navigate("/supervisor-dashboard");
    else if (role === "admin") navigate("/admin-dashboard");
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.form}>

        <h1 style={styles.title}>Welcome to ILES</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="">Login as...</option>
          <option value="student">Student</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p
          style={styles.forgot}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        <p style={styles.signup}>
          Don't have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>

      </form>

      <p style={styles.footer}>
        Need help? Contact us<br />
        Email: support@iles.com<br />
        Phone: +256 776 083 497
      </p>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0f2027,#203a43, #2c5364)",
    fontFamily: "Arial, sans-serif",
  },

  form: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    width: "320px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  title: {
    textAlign: "center",
    color: "#203a43",
    marginBottom: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },

  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "white",
  },

button: {
  padding: "10px",
  background: "linear-gradient(to right, #05648d,#203a43)",
  color: "#ffffff", 
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
},
  forgot: {
    textAlign: "center",
    fontSize: "12px",
    color: "#203a43",
    cursor: "pointer",
  },

  signup: {
    textAlign: "center",
    fontSize: "13px",
  },

  link: {
    color: "#05648d",
    fontWeight: "bold",
    cursor: "pointer",
  },

  footer: {
    marginTop: "20px",
    color: "white",
    textAlign: "center",
    fontSize: "12px",
  },
};

export default Welcome;