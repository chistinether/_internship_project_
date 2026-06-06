import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "./api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const response = await api("/auth/forgot-password/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset link");
        return;
      }

      setMessage("Password reset link sent to your email.");

      // optional redirect after delay
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <h2 style={styles.title}>Forgot Password</h2>

        <p style={styles.subtitle}>
          Enter your email and we’ll send you a reset link.
        </p>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p style={styles.footer}>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/")}
              style={styles.link}
            >
              Back to Login
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0a0f1c,#0e1a2e)",
  },

  card: {
    width: "100%",
    maxWidth: 400,
    padding: 32,
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },

  title: {
    color: "white",
    marginBottom: 10,
  },

  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "1px solid rgba(255,255,255,0.2)",
    marginBottom: 14,
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "yellow",
    fontWeight: 600,
  },

  footer: {
    color: "rgba(255,255,255,0.6)",
    marginTop: 14,
    fontSize: 13,
  },

  link: {
    color: "#a78bfa",
    cursor: "pointer",
    textDecoration: "underline",
  },

  error: {
    color: "#f87171",
    marginBottom: 10,
    fontSize: 13,
  },

  success: {
    color: "#34d399",
    marginBottom: 10,
    fontSize: 13,
  },
};

export default ForgotPassword;