import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // Redirect to dashboard with role info
    navigate(`/dashboard?role=${role}`);
  };

  return (
    <div className="login-page">
      <div className="welcome-text">
        <h1>Welcome to</h1>
        <h1>ILES</h1>
      </div>

      <div className="login-box">
        <h2>Login</h2>
        <form>
          <label>Email:</label>
          <input type="email" placeholder="Email:" required />
          <label>Password:</label>
          <input type="password" placeholder="Password:" required />

          <div className="login-buttons">
            <button type="button" onClick={() => handleLogin("student")}>
              Login as Student
            </button>
            <button type="button" onClick={() => handleLogin("supervisor")}>
              Login as Supervisor
            </button>
            <button type="button" onClick={() => handleLogin("admin")}>
              Login as Admin
            </button>
          </div>

          <div className="extra-links">
            <a href="#">Forgot Password?</a>
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/create-account")}
              >
                Signup
              </button>
            </p>
          </div>
        </form>

        <div className="contact-info">
          <p>Need help? Contact us</p>
          <p>
            Email:{" "}
            <a href="mailto:support.ILES@gmail.com">Support.ILES@gmail.com</a>
          </p>
          <p>
            Phone:{" "}
            <span
              className="phone"
              onClick={() => {
                navigator.clipboard.writeText("+256776083497");
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
