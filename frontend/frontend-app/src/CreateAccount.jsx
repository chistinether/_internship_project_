{/*import React, { useState } from "react";

function CreateAccount({ onSignupSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    otherNames: "",
    email: "",
    course: "",
    university: "",
    phone: "",
    yearOfStudy: "",
    internshipPlace: "",
    supervisor: "",
  });

  const [step, setStep] = useState("form");
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const requiredFields = {
    firstName: "First Name",
    surname: "Surname",
    email: "Email",
    course: "Course",
    university: "University",
    phone: "Phone Number",
    yearOfStudy: "Year of Study",
    internshipPlace: "Internship Place",
    supervisor: "Supervisor",
  };

  const newErrors = {};
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!formData[field].trim()) {
      newErrors[field] = `${label} is required`;
    }
  });

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  setStep("verify");
};

  const sendVerification = (method) => {
    setVerifyMethod(method);
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(generated);
    alert(`Verification code sent to ${formData[method]}: ${generated}`);
  };

  const checkCode = () => {
    if (code === sentCode) {
      setStep("success");
    } else {
      alert("Incorrect code, try again.");
    }
  };

  if (step === "form") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.05)",
          padding: "40px",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "500px",
        }}>
          <h2 style={{ color: "white", textAlign: "center", marginBottom: "24px" }}>
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            {[
              { label: "First Name", name: "firstName" },
              { label: "Surname", name: "surname" },
              { label: "Other Names", name: "otherNames" },
              { label: "Email", name: "email" },
              { label: "Course", name: "course" },
              { label: "University", name: "university" },
              { label: "Phone Number", name: "phone" },
              { label: "Year of Study", name: "yearOfStudy" },
              { label: "Internship Place", name: "internshipPlace" },
              { label: "Supervisor", name: "supervisor" },
            ].map(({ label, name }) => (
              <div key={name} style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                gap: "12px",
              }}>
                <label style={{
                  color: "white",
                  width: "140px",
                  minWidth: "140px",
                  textAlign: "right",
                  fontSize: "1rem",
                }}>
                  {label}:
                </label>
                <input
                  name={name}
                  onChange={(e) => {
                    handleChange(e);
                    setErrors(prev => ({ ...prev, [name]: "" }));
      }}
                  required={name !== "otherNames"}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    background: "rgba(255,255,255,0.9)",
                    color: "black",
                  }}
                />
              </div>
            ))}

            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 40px",
                  background: "rgb(14, 25, 107)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start",paddingTop: "40px", paddingLeft: "40px", }}>
        <div style={{ background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "10px", textAlign: "center" }}>
          <h2 style={{ color: "white" }}>Verify Account</h2>
          <p style={{ color: "white", marginBottom: "20px" }}>Choose verification method:</p>
          <button onClick={() => sendVerification("email")} style={{ marginRight: "10px", padding: "10px 20px", cursor: "pointer" }}>
            Verify by Email
          </button>
          <button onClick={() => sendVerification("phone")} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Verify by Phone
          </button>

          {verifyMethod && (
            <div style={{ marginTop: "20px" }}>
              <input
                placeholder="Enter verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ padding: "10px", borderRadius: "4px", marginRight: "10px" }}
              />
              <button onClick={checkCode} style={{ padding: "10px 20px", cursor: "pointer" }}>
                Submit Code
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start",paddingTop: "40px", paddingLeft: "40px", }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "white" }}>Signup Successful!</h2>
          <button onClick={onSignupSuccess} style={{ padding: "10px 30px", marginTop: "20px", cursor: "pointer" }}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default CreateAccount;*/}



import React, { useState } from "react";

// ─── Role definitions ─────────────────────────────────────────────────────────
const ROLES = [
  {
    key: "student",
    label: "Student",
    icon: "🎓",
    description: "Register as a student intern",
    color: "#3B82F6",
  },
  {
    key: "supervisor",
    label: "Supervisor",
    icon: "👔",
    description: "Workplace supervisor",
    color: "#10B981",
  },
  {
    key: "administrator",
    label: "Administrator",
    icon: "🛡️",
    description: "Academic Supervisor",
    color: "#F59E0B",
  },
];




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
  supervisor: [
    { label: "First Name", name: "firstName", required: true },
    { label: "Surname", name: "surname", required: true },
    { label: "Other Names", name: "otherNames", required: false },
    { label: "Email", name: "email", required: true, type: "email" },
    { label: "Phone Number", name: "phone", required: true, type: "tel" },
    { label: "College", name: "college", required: true },
    { label: "Department", name: "department", required: true },
    { label: "Staff ID", name: "staffId", required: true },
  ],
  administrator: [
    { label: "First Name", name: "firstName", required: true },
    { label: "Surname", name: "surname", required: true },
    { label: "Other Names", name: "otherNames", required: false },
    { label: "Email", name: "email", required: true, type: "email" },
    { label: "Phone Number", name: "phone", required: true, type: "tel" },
    { label: "Department", name: "department", required: true },
    { label: "Staff ID", name: "staffId", required: true },
  ],
};


const baseInput = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid rgba(255,255,255,0.15)",
  fontSize: "0.95rem",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none",
  transition: "border-color 0.2s",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle = {
  color: "rgba(255,255,255,0.75)",
  width: "150px",
  minWidth: "150px",
  textAlign: "right",
  fontSize: "0.9rem",
};

const errorStyle = {
  color: "#F87171",
  fontSize: "0.78rem",
  marginTop: "3px",
  paddingLeft: "162px",
};




function CreateAccount({ onSignupSuccess }) {
  const [step, setStep]               = useState("role"); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData]       = useState({});
  const [errors, setErrors]           = useState({});
 
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [code, setCode]               = useState("");
  const [codeSent, setCodeSent]       = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
 
  const roleConfig = ROLES.find((r) => r.key === selectedRole);
  const fields     = selectedRole ? FIELDS_BY_ROLE[selectedRole] : [];
 




  if (step === "role") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
          * { box-sizing: border-box; }
          .role-card { transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
          .role-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.45); }
        `}</style>
        <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
                      background:"linear-gradient(135deg,#0a0f1c 0%,#0e1a2e 100%)", padding:24 }}>
          <div style={{ width:"100%", maxWidth:500, textAlign:"center" }}>
 
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"white",
                          marginBottom:8, letterSpacing:"-0.02em" }}>
              Create an Account
            </div>
            <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:36,
                        fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>
              Select your role to get started
            </p>
 
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {ROLES.map((role) => (
                <div
                  key={role.key}
                  className="role-card"
                  onClick={() => {
                    setSelectedRole(role.key);
                    setFormData({});
                    setErrors({});
                    setStep("form");
                  }}
                  style={{
                    display:"flex", alignItems:"center", gap:18,
                    padding:"20px 24px",
                    background:"rgba(255,255,255,0.04)",
                    border:"1px solid rgba(255,255,255,0.1)",
                    borderLeft:`4px solid ${role.color}`,
                    borderRadius:12, textAlign:"left",
                  }}
                >
                  <span style={{ fontSize:28 }}>{role.icon}</span>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700,
                                  fontSize:17, color:"white", marginBottom:3 }}>
                      {role.label}
                    </div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13,
                                  fontFamily:"'DM Sans',sans-serif" }}>
                      {role.description}
                    </div>
                  </div>
                  <span style={{ marginLeft:"auto", color:role.color, fontSize:20 }}>→</span>
                </div>
              ))}
            </div>
 
            <p style={{ marginTop:28, color:"rgba(255,255,255,0.3)", fontSize:13 }}>
              Already have an account?{" "}
              <span onClick={onSignupSuccess}
                    style={{ color:"#3B82F6", cursor:"pointer", textDecoration:"underline" }}>
                Login
              </span>
            </p>
          </div>
        </div>
      </>
    );
  }
 

  if (step === "form") {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev)  => ({ ...prev, [name]: "" }));
    };
 
    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};
 
      fields.forEach(({ name, label, required }) => {
        if (required && !formData[name]?.trim())
          newErrors[name] = `${label} is required`;
      });
 
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Enter a valid email address";
 
      if (!formData.password?.trim())
        newErrors.password = "Password is required";
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
 
      if (!formData.confirmPassword?.trim())
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
 
      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
 
      setErrors({});
      setStep("verify");
    };
 
    const inputFor = (name) => ({
      ...baseInput,
      borderColor: errors[name] ? "#F87171" : "rgba(255,255,255,0.15)",
    });
 
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
          * { box-sizing: border-box; }
          input::placeholder { color: rgba(255,255,255,0.25); }
          input:focus { border-color: ${roleConfig.color} !important; }
        `}</style>
        <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
                      background:"linear-gradient(135deg,#0a0f1c 0%,#0e1a2e 100%)", padding:24 }}>
          <div style={{
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderTop:`4px solid ${roleConfig.color}`,
            padding:"36px 40px", borderRadius:14,
            width:"100%", maxWidth:600,
          }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
              <button onClick={() => setStep("role")}
                      style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)",
                               cursor:"pointer", fontSize:18, padding:0 }}>
                ←
              </button>
              <h2 style={{ margin:0, fontFamily:"'Syne',sans-serif", fontSize:20,
                           fontWeight:800, color:"white" }}>
                {roleConfig.icon} Register as {roleConfig.label}
              </h2>
            </div>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, marginBottom:24, paddingLeft:28 }}>
              Fields marked <span style={{ color:roleConfig.color }}>*</span> are required
            </p>
 
            <form onSubmit={handleSubmit}>
              {/* Role-specific fields */}
              {fields.map(({ label, name, required, type }) => (
                <div key={name} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <label style={labelStyle}>
                      {label}{required && <span style={{ color:roleConfig.color }}> *</span>}:
                    </label>
                    <input
                      name={name}
                      type={type || "text"}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      style={inputFor(name)}
                    />
                  </div>
                  {errors[name] && <div style={errStyle}>{errors[name]}</div>}
                </div>
              ))}
 
              {/* Divider */}
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", margin:"20px 0" }} />
 
              {/* Password */}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <label style={labelStyle}>
                    Password<span style={{ color:roleConfig.color }}> *</span>:
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    style={inputFor("password")}
                  />
                </div>
                {errors.password && <div style={errStyle}>{errors.password}</div>}
              </div>
 
              {/* Confirm Password */}
              <div style={{ marginBottom:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <label style={labelStyle}>
                    Confirm Password<span style={{ color:roleConfig.color }}> *</span>:
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword || ""}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    style={inputFor("confirmPassword")}
                  />
                </div>
                {errors.confirmPassword && <div style={errStyle}>{errors.confirmPassword}</div>}
              </div>
 
              <div style={{ textAlign:"center" }}>
                <button type="submit" style={{
                  padding:"11px 48px",
                  background: roleConfig.color,
                  color:"white", border:"none", borderRadius:8,
                  fontSize:"1rem", fontWeight:600, cursor:"pointer",
                  fontFamily:"'DM Sans',sans-serif",
                }}>
                  Continue →
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  if (step === "verify") {
 
    const sendVerification = async (method) => {
      setVerifyMethod(method);
      setCodeSent(false);
      setCode("");
      setVerifyError("");
      setCodeLoading(true);
      try {
        // ── Plug in your backend OTP endpoint here ─────────────────────────
        // await fetch("/api/auth/send-otp/", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     method,                        // "email" or "phone"
        //     value: formData[method],       // the actual email or phone number
        //   }),
        // });
        // ──────────────────────────────────────────────────────────────────
        await new Promise((r) => setTimeout(r, 900)); // remove when backend ready
        setCodeSent(true);
      } catch {
        setVerifyError("Failed to send code. Please try again.");
      } finally {
        setCodeLoading(false);
      }
    };
 
    const checkCode = async () => {
      setVerifyError("");
      if (!code.trim()) { setVerifyError("Please enter the verification code."); return; }
      try {
        // ── Plug in your backend OTP verify endpoint here ──────────────────
        // const res = await fetch("/api/auth/verify-otp/", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     method: verifyMethod,
        //     value: formData[verifyMethod],
        //     code,
        //     // also send the full formData so backend can create the account:
        //     ...formData,
        //     role: selectedRole,
        //   }),
        // });
        // if (!res.ok) throw new Error();
        // ──────────────────────────────────────────────────────────────────
        // Temporary mock — remove when backend ready (accepts any 4-digit code):
        if (code.length < 4) throw new Error();
 
        setStep("success");
      } catch {
        setVerifyError("Incorrect code. Please try again.");
      }
    };
 
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
          * { box-sizing: border-box; }
          input::placeholder { color: rgba(255,255,255,0.25); }
        `}</style>
        <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
                      background:"linear-gradient(135deg,#0a0f1c 0%,#0e1a2e 100%)", padding:24 }}>
          <div style={{
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.1)",
            borderTop:`4px solid ${roleConfig.color}`,
            padding:"40px 36px", borderRadius:14,
            textAlign:"center", width:"100%", maxWidth:440,
          }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📨</div>
            <h2 style={{ color:"white", fontFamily:"'Syne',sans-serif", marginBottom:8 }}>
              Verify Your Account
            </h2>
            <p style={{ color:"rgba(255,255,255,0.4)", marginBottom:28, fontSize:14 }}>
              Choose how to receive your one-time code
            </p>
 
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:24 }}>
              {["email","phone"].map((method) => (
                <button
                  key={method}
                  onClick={() => sendVerification(method)}
                  disabled={codeLoading}
                  style={{
                    padding:"10px 22px", borderRadius:8,
                    border:`1px solid ${verifyMethod===method ? roleConfig.color : "rgba(255,255,255,0.2)"}`,
                    background: verifyMethod===method ? `${roleConfig.color}22` : "transparent",
                    color: verifyMethod===method ? roleConfig.color : "rgba(255,255,255,0.65)",
                    cursor: codeLoading ? "not-allowed" : "pointer",
                    fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
                    opacity: codeLoading ? 0.6 : 1, transition:"all 0.2s",
                  }}
                >
                  {method==="email" ? "📧 Via Email" : "📱 Via Phone"}
                </button>
              ))}
            </div>
 
            {codeLoading && (
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginBottom:16 }}>
                Sending code…
              </p>
            )}
 
            {codeSent && !codeLoading && (
              <>
                <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginBottom:16 }}>
                  Code sent to{" "}
                  <strong style={{ color:"white" }}>
                    {verifyMethod==="email" ? formData.email : formData.phone}
                  </strong>
                </p>
 
                <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:10 }}>
                  <input
                    placeholder="_ _ _ _"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setVerifyError(""); }}
                    maxLength={6}
                    style={{
                      ...baseInput, flex:"none", width:140,
                      textAlign:"center", fontSize:22,
                      letterSpacing:8, fontWeight:700,
                    }}
                  />
                  <button
                    onClick={checkCode}
                    style={{
                      padding:"10px 20px", borderRadius:8, border:"none",
                      background:roleConfig.color, color:"white",
                      cursor:"pointer", fontWeight:600,
                      fontFamily:"'DM Sans',sans-serif",
                    }}
                  >
                    Verify
                  </button>
                </div>
 
                <p onClick={() => sendVerification(verifyMethod)}
                   style={{ color:"rgba(255,255,255,0.3)", fontSize:12,
                            cursor:"pointer", textDecoration:"underline" }}>
                  Resend code
                </p>
              </>
            )}
 
            {verifyError && (
              <p style={{ color:"#F87171", fontSize:13, marginTop:12 }}>{verifyError}</p>
            )}
          </div>
        </div>
      </>
    );
  }
 

  if (step === "success") {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`}</style>
        <div style={{ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center",
                      background:"linear-gradient(135deg,#0a0f1c 0%,#0e1a2e 100%)" }}>
          <div style={{ textAlign:"center", padding:40 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
            <h2 style={{ color:"white", fontFamily:"'Syne',sans-serif",
                         fontSize:28, fontWeight:800, marginBottom:8 }}>
              Account Created!
            </h2>
            <p style={{ color:"rgba(255,255,255,0.45)", marginBottom:6 }}>
              Welcome,{" "}
              <strong style={{ color:"white" }}>
                {formData.firstName} {formData.surname}
              </strong>
            </p>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, marginBottom:32 }}>
              Registered as:{" "}
              <span style={{ color:roleConfig.color, fontWeight:600 }}>
                {roleConfig.label}
              </span>
            </p>
            <button
              onClick={onSignupSuccess}
              style={{
                padding:"12px 48px",
                background:roleConfig.color,
                color:"white", border:"none", borderRadius:8,
                fontSize:"1rem", fontWeight:600, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif",
              }}
            >
              Go to Login →
            </button>
          </div>
        </div>
      </>
    );
  }
}
 
export default CreateAccount;