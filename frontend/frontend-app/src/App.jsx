{/*
  add after linking backend
import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import CreateAccount from "./CreateAccount";
import ForgotPassword from "./ForgotPassword";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./dashboards/StudentDashboard";
import SupervisorDashboard from "./dashboards/SupervisorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  }
  fetch("/api/user/", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={
  (() => {
    const role = localStorage.getItem("role");
    if (role === "student") return <StudentDashboard />;
    if (role === "academic" || role === "workplace") return <SupervisorDashboard />;
    if (role === "admin") return <AdminDashboard />;
    return <p style={{ color: "white" }}>Unknown role</p>;
  })()
} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;*/}



import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreateAccount from "./CreateAccount";
import ForgotPassword from "./ForgotPassword";
import StudentDashboard from "./dashboards/StudentDashboard";
import SupervisorDashboard from "./dashboards/SupervisorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";
import { UserProvider } from "./UserContext";

<UserProvider>
  <App />
</UserProvider>

function DashboardRouter() {
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");
  if (role === "student") return <StudentDashboard />;
  if (role === "supervisor") return <SupervisorDashboard />;
  if (role === "admin") return <AdminDashboard />;
  return <LoginPage />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<DashboardRouter />} />
    </Routes>
  );
}


export default App;