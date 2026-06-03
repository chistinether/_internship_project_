import React, { useState } from "react";
import { api } from "./api";
import "./App.css";

// ─── Roles ─────────────────────────────────────────────
const ROLES = [
  {
    key: "student",
    label: "Student",
    icon: "🎓",
    description: "Register as a student intern",
    color: "#3B82F6",
  },
  {
    key: "workplace",
    label: "Supervisor",
    icon: "👔",
    description: "Workplace supervisor",
    color: "#10B981",
  },
  {
    key: "academic",
    label: "Administrator",
    icon: "🛡️",
    description: "Academic Supervisor",
    color: "#F59E0B",
  },
];

// ─── Fields ─────────────────────────────────────────────
const FIELDS_BY_ROLE = {
  student: [
    { label: "First Name", name: "firstName", required: true },
    { label: "Surname", name: "surname", required: true },
    { label: "Other Names", name: "otherNames", required: false },
    { label: "Email", name: "email", required: true, type: "email" },
    { label: "Phone Number", name: "phone", required: true, type: "tel" },
    { label: "University", name: "university", required: true },
    { label: "Course", name: "course", required: true },
    { label: "Year of Study", name: "yearOfStudy", required: true },
    { label: "Internship Place", name: "internshipPlace", required: true },
    { label: "Supervisor", name: "supervisor", required: true },
  ],
  workplace: [
    { label: "First Name", name: "firstName", required: true },
    { label: "Surname", name: "surname", required: true },
    { label: "Email", name: "email", required: true, type: "email" },
    { label: "Phone Number", name: "phone", required: true, type: "tel" },
    { label: "College", name: "college", required: true },
    { label: "Department", name: "department", required: true },
    { label: "Staff ID", name: "staffId", required: true },
  ],
  academic: [
    { label: "First Name", name: "firstName", required: true },
    { label: "Surname", name: "surname", required: true },
    { label: "Email", name: "email", required: true, type: "email" },
    { label: "Phone Number", name: "phone", required: true, type: "tel" },
    { label: "Department", name: "department", required: true },
    { label: "Staff ID", name: "staffId", required: true },
  ],
};

// ─── Styles ─────────────────────────────────────────────
const baseInput = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.15)",
  fontSize: "0.95rem",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
  width: "100%",
};

const labelStyle = {
  color: "rgba(255,255,255,0.75)",
  width: "150px",
  textAlign: "right",
  fontSize: "0.9rem",
};

const errorStyle = {
  color: "#F87171",
  fontSize: "0.78rem",
  marginTop: "3px",
  paddingLeft: "160px",
};

// ─── Component ─────────────────────────────────────────
function CreateAccount({ onSignupSuccess }) {
  const [step, setStep] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const roleConfig = ROLES.find((r) => r.key === selectedRole);
  const fields = selectedRole ? FIELDS_BY_ROLE[selectedRole] : [];

  // ─── Handle input change ─────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  // ─── Submit registration ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    fields.forEach(({ name, label, required }) => {
      if (required && !formData[name]?.trim()) {
        newErrors[name] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || "Registration failed" });
        return;
      }

      // store token
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", data.role);

      setStep("success");

    } catch (err) {
      setErrors({ general: "Something went wrong. Try again." });
    }
  };

  // ─── ROLE SELECT SCREEN ─────────────────────────────
  if (step === "role") {
  return (
    <div
      style={{
        padding: 30,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
        <h2>Create Account</h2>

        {ROLES.map((role) => (
          <div
            key={role.key}
            onClick={() => {
              setSelectedRole(role.key);
              setStep("form");
            }}
            style={{
              padding: "10px",
                borderRadius: "15px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #061321, #1e0303)",
                color: "white",
                fontSize: "1rem",
                fontWeight: "500",
                letterSpacing: "1px",
                textTransform: "uppercase",
                boxShadow:
                  "0 4px 12px rgba(37,99,235,0.4)",
              width: "250px",
              height: "60px",
              display: "flex",
              margin: 10,
              cursor: "pointer",
              border: `2px solid ${role.color}`,
            }}
          >
            {role.icon} {role.label}
          </div>
        ))}

        <p onClick={onSignupSuccess} style={{ cursor: "pointer" }}>
          Already have account? Login
        </p>
      </div>
    );
  }

  // ─── FORM SCREEN ─────────────────────────────────────
  if (step === "form") {
    return (
      <form
  onSubmit={handleSubmit}
  style={{
    padding: 30,
    maxWidth: "400px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  }}
>
        <h2>Register as {roleConfig.label}</h2>

        {fields.map(({ label, name, type }) => (
          <div key={name} style={{ marginBottom: 10 }}>
            <label>{label}</label>
            <input
              type={type || "text"}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              style={baseInput}
            />
            {errors[name] && <p style={errorStyle}>{errors[name]}</p>}
          </div>
        ))}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          style={baseInput}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          style={baseInput}
        />

        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

        <button type="submit">Create Account</button>
      </form>
    );
  }

  // ─── SUCCESS SCREEN ──────────────────────────────────
  if (step === "success") {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <h1>Account Created 🎉</h1>
        <button onClick={onSignupSuccess}>
          Go to Login
        </button>
      </div>
    );
  }

  return null;
}

export default CreateAccount;