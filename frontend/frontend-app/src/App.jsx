import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import CreateAccount from "./CreateAccount";
import ForgotPassword from "./ForgotPassword";

import StudentDashboard from "./Dashboards/StudentDashboard";
import SupervisorDashboard from "./Dashboards/SupervisorDashboard";
import AdminDashboard from "./Dashboards/AdminDashboard";

function DashboardRouter() {
  const role = localStorage.getItem("role");

  if (role === "student") {
    return <StudentDashboard />;
  }

  if (role === "academic") {
    return <AdminDashboard />;
  }

  if (role === "workplace") {
    return <SupervisorDashboard />;
  }

  return <LoginPage />;
}

function App() {

  return (
    <Routes>

      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        path="/create-account"
        element={
          <CreateAccount
            onSignupSuccess={() => {
              window.location.href = "/";
            }}
          />
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/dashboard"
        element={<DashboardRouter />}
      />

    </Routes>
   );
}

export default App;