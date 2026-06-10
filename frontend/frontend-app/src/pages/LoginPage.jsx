import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api";

function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const [loadingRole, setLoadingRole] = useState(null);

  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered credentials
  useEffect(() => {

    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }

    if (savedPassword) {
      setPassword(savedPassword);
    }

  }, []);

  // LOGIN FUNCTION
  const handleLogin = async (role) => {

    const newErrors = {};

    // Validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoadingRole(role);

    try {

      const response = await fetch(
        "https://esther-api.tagooledavid.com/api/login/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
            role: role,
        }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {

        setErrors({
          general:
            data.detail ||
            "Invalid login credentials",
        });

        return;
      }

      // Save login data
      localStorage.setItem(
      "user",
      JSON.stringify({
      name: data.user?.first_name || data.user?.email,
      email: data.user?.email,
      role: data.user?.role
    })
  );

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      // Save selected role
      localStorage.setItem("role", role);

      localStorage.setItem("name", email);

      // Remember Me
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      // Redirect
      navigate("/dashboard");

    } catch (error) {

      console.error("Login error:", error);

      setErrors({
        general:
          "Something went wrong. Please try again later.",
      });

    } finally {

      setLoadingRole(null);

    }
  };

  return (

    <div className="login-page">

     <div
  className="welcome-text"
  style={{ color: "#ffffff" }}
>
  <h1>Welcome to</h1>
  <h1>ILES</h1>
</div>

      <div className="login-box">

        <h2>Login</h2>

        {errors.general && (
          <p
            style={{
              color: "red",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {errors.general}
          </p>
        )}

        <form onSubmit={(e) => e.preventDefault()}>

          {/* EMAIL */}

          <label>Email:</label>

          <input
            type="email"
            placeholder="Email"
            value={email}

            onChange={(e) => {

              setEmail(e.target.value);

              setErrors((prev) => ({
                ...prev,
                email: "",
                general: "",
              }));
            }}

            style={{
              border:
                errors.email
                  ? "1px solid red"
                  : "1px solid #ccc",
            }}
          />

          {errors.email && (
            <p
              style={{
                color: "red",
                fontSize: "0.85rem",
                margin: "4px 0",
              }}
            >
              {errors.email}
            </p>
          )}

          {/* PASSWORD */}

          <label>Password:</label>

          <input
            type="password"
            placeholder="Password"
            value={password}

            onChange={(e) => {

              setPassword(e.target.value);

              setErrors((prev) => ({
                ...prev,
                password: "",
                general: "",
              }));
            }}

            style={{
              border:
                errors.password
                  ? "1px solid red"
                  : "1px solid #ccc",
            }}
          />

          {errors.password && (
            <p
              style={{
                color: "red",
                fontSize: "0.85rem",
                margin: "4px 0",
              }}
            >
              {errors.password}
            </p>
          )}

          {/* REMEMBER ME */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
            }}
          >

            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}

              onChange={(e) =>
                setRememberMe(e.target.checked)
              }
            />

            <span
              style={{
                color: "white",
                fontSize: "0.95rem",
                cursor: "pointer",
              }}

              onClick={() =>
                setRememberMe(!rememberMe)
              }
            >
              Remember me
            </span>

          </div>

          {/* STYLISH LOGIN BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
            }}
          >

            {/* STUDENT */}

            <button
              type="button"
              onClick={() => handleLogin("student")}
              disabled={loadingRole !== null}


              
              style={{
                padding: "10px",
                borderRadius: "15px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #2563eb, #1e3a8a)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "500",
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow:
                  "0 4px 12px rgba(37,99,235,0.4)",
              }}
            >
              {
              loadingRole === "student"
              ? "Loading..."
              : "Login as Student"
}
            </button>

            {/* WORKPLACE */}

            <button
              type="button"
              onClick={() => handleLogin("workplace")}
              disabled={loadingRole !== null && loadingRole !== "workplace" }

              style={{
                padding: "10px",
                borderRadius: "15px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #059669, #065f46)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "500",
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow:
                  "0 4px 12px rgba(5,150,105,0.4)",
              }}
            >
              {loadingRole === "workplace"
                ? "Loading..."
                : "Login as Workplace Supervisor"}
            </button>

            {/* ACADEMIC */}

            <button
              type="button"
              onClick={() => handleLogin("academic")}
              disabled={loadingRole !== null && loadingRole !== "academic"}

              style={{
                padding: "10px",
                borderRadius: "15px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #7c3aed, #4c1d95)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "500",
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow:
                  "0 4px 12px rgba(124,58,237,0.4)",
              }}
            >
              {loadingRole === "academic" 
                ? "Loading..."
                : "Login as Academic Supervisor"}
            </button>

          </div>

          {/* EXTRA LINKS */}

          <div className="extra-links">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

            <p>
              Don't have an account?{" "}

              <Link to="/create-account">
                Signup
              </Link>
            </p>

          </div>

        </form>

        {/* CONTACT INFO */}

        <div className="contact-info">

          <p>Need help? Contact us</p>

          <p>
            Email:{" "}

            <a href="mailto:support.ILES@gmail.com">
              Support.ILES@gmail.com
            </a>
          </p>

          <p>
            Phone:{" "}

            <span
              className="phone"

              onClick={() => {

                navigator.clipboard.writeText(
                  "+256776083497"
                );

                alert("Phone number copied!");
              }}
            >
              +256 776 083497
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginPage;