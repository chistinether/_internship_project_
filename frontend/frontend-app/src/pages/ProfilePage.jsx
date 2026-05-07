// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useUser } from "../context/UserContext";

// ─── Avatar initials helper ───────────────────────────────────────────────────
function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || "?").toUpperCase();
}

// ─── Role accent colours (matches each dashboard) ────────────────────────────
const ROLE_COLORS = {
  student:       { accent: "#0e196b", light: "#3B82F6", bg: "linear-gradient(135deg,#0a0f2e,#0d1b4b)" },
  supervisor:    { accent: "#4a1d7a", light: "#a78bfa", bg: "linear-gradient(135deg,#0f1a2e,#1a0f2e)" },
  administrator: { accent: "#7f1d1d", light: "#fca5a5", bg: "linear-gradient(135deg,#1a0a0a,#2e1a0f)" },
};

export default function ProfilePage({ onBack, onLogout }) {
  // ✅ Pull everything from context — no more localStorage reads at top level
  const { user, updateUser, logout } = useUser();
  const { name, email, role, token } = user;

  const colors = ROLE_COLORS[role] || ROLE_COLORS.student;

  // ✅ editData initialised from context values
  const [section, setSection] = useState("main");
  const [editData, setEditData] = useState({ name, email, phone: user.phone || "" });
  const [editErrors, setEditErrors] = useState({});
  const [editSuccess, setEditSuccess] = useState("");

  const [pwData, setPwData] = useState({ current: "", newPw: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSuccess, setPwSuccess] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ─── API helper (uses live token from context) ────────────────────────────
  const api = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  // ── Edit account ────────────────────────────────────────────────────────
  const handleEditSave = async () => {
    const errs = {};
    if (!editData.name.trim())  errs.name  = "Name is required";
    if (!editData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(editData.email)) errs.email = "Enter a valid email";
    if (Object.keys(errs).length) { setEditErrors(errs); return; }

    try {
      // ── Connect to backend ──────────────────────────────────────────────
      // await api("/api/auth/profile/", {
      //   method: "PATCH",
      //   body: JSON.stringify(editData),
      // });
      // ───────────────────────────────────────────────────────────────────

      // ✅ replaces all 3 localStorage.setItem calls — syncs dashboards instantly
      updateUser(editData);
      setEditSuccess("Profile updated successfully!");
      setEditErrors({});
      setTimeout(() => { setEditSuccess(""); setSection("main"); }, 1500);
    } catch {
      setEditErrors({ api: "Failed to update profile. Try again." });
    }
  };

  // ── Change password ─────────────────────────────────────────────────────
  const handlePasswordSave = async () => {
    const errs = {};
    if (!pwData.current.trim())          errs.current = "Current password is required";
    if (!pwData.newPw.trim())            errs.newPw   = "New password is required";
    else if (pwData.newPw.length < 8)    errs.newPw   = "At least 8 characters";
    if (pwData.newPw !== pwData.confirm) errs.confirm  = "Passwords do not match";
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    try {
      // ── Connect to backend ──────────────────────────────────────────────
      // await api("/api/auth/change-password/", {
      //   method: "POST",
      //   body: JSON.stringify({ current_password: pwData.current, new_password: pwData.newPw }),
      // });
      // ───────────────────────────────────────────────────────────────────
      setPwSuccess("Password changed successfully!");
      setPwErrors({});
      setPwData({ current: "", newPw: "", confirm: "" });
      setTimeout(() => { setPwSuccess(""); setSection("main"); }, 1500);
    } catch {
      setPwErrors({ api: "Failed to change password. Check your current password." });
    }
  };

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();    // ✅ replaces localStorage.clear() — clears context + storage
    onLogout();  // navigates to login in App.jsx
  };

  // ── Shared input style ──────────────────────────────────────────────────
  const inp = (err) => ({
    width: "100%", padding: "11px 14px", borderRadius: 8,
    border: `1px solid ${err ? "#F87171" : "rgba(255,255,255,0.15)"}`,
    background: "rgba(255,255,255,0.07)", color: "white",
    fontSize: "0.95rem", outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  });

  const lbl = {
    color: "rgba(255,255,255,0.6)", fontSize: "0.8rem",
    fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em",
    textTransform: "uppercase", display: "block", marginBottom: 6,
  };

  const field = (label, key, obj, setter, errs, type = "text") => (
    <div style={{ marginBottom: 16 }}>
      <label style={lbl}>{label}</label>
      <input
        type={type}
        value={obj[key]}
        onChange={(e) => {
          setter((p) => ({ ...p, [key]: e.target.value }));
          errs[key] && (type === "text" ? setEditErrors : setPwErrors)((p) => ({ ...p, [key]: "" }));
        }}
        style={inp(errs[key])}
      />
      {errs[key] && <p style={{ color: "#F87171", fontSize: "0.78rem", margin: "4px 0 0" }}>{errs[key]}</p>}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        .prof-btn { transition: all 0.18s; }
        .prof-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .menu-item { transition: background 0.15s; cursor: pointer; }
        .menu-item:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: colors.bg, padding: 24,
                    fontFamily: "'DM Sans', sans-serif", color: "white" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>

          {/* ── Back button ── */}
          <button
            onClick={section === "main" ? onBack : () => setSection("main")}
            className="prof-btn"
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)",
                     cursor: "pointer", fontSize: 14, padding: "8px 0", marginBottom: 24,
                     display: "flex", alignItems: "center", gap: 6 }}
          >
            ← {section === "main" ? "Back to Dashboard" : "Back to Profile"}
          </button>

          {/* ══════════════════════════════════════════
              MAIN PROFILE VIEW
          ══════════════════════════════════════════ */}
          {section === "main" && (
            <>
              {/* Avatar card */}
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16, padding: "32px 24px",
                textAlign: "center", marginBottom: 20,
                borderTop: `4px solid ${colors.light}`,
              }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.light}, ${colors.accent})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 28, fontWeight: 800,
                  fontFamily: "'Syne', sans-serif",
                  boxShadow: `0 0 24px ${colors.light}44`,
                }}>
                  {getInitials(name)}
                </div>

                {/* ✅ name, email, role all live-update when profile is saved */}
                <h2 style={{ margin: "0 0 4px", fontFamily: "'Syne',sans-serif",
                             fontSize: 22, fontWeight: 800 }}>{name}</h2>
                <p style={{ color: "rgba(255,255,255,0.45)", margin: "0 0 4px", fontSize: 14 }}>{email}</p>
                <span style={{
                  display: "inline-block", marginTop: 8,
                  padding: "3px 14px", borderRadius: 20,
                  background: `${colors.light}22`, color: colors.light,
                  fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 600,
                  textTransform: "capitalize", letterSpacing: "0.05em",
                }}>
                  {role}
                </span>
              </div>

              {/* Menu items */}
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, overflow: "hidden",
              }}>
                {[
                  { icon: "✏️", label: "Edit Account",       sub: "Update your name, email & phone", onClick: () => setSection("edit") },
                  { icon: "🔒", label: "Change Password",    sub: "Update your login password",       onClick: () => setSection("password") },
                  { icon: "🔔", label: "Notifications",      sub: "Manage your alert preferences",    onClick: () => {} },
                  { icon: "🛡️", label: "Privacy & Security", sub: "Account security settings",        onClick: () => {} },
                ].map((item, i, arr) => (
                  <div
                    key={item.label}
                    className="menu-item"
                    onClick={item.onClick}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 20px",
                      borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                      background: "transparent",
                    }}
                  >
                    <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{item.label}</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }}>›</span>
                  </div>
                ))}
              </div>

              {/* Logout button */}
              <button
                className="prof-btn"
                onClick={() => setShowLogoutConfirm(true)}
                style={{
                  width: "100%", marginTop: 16, padding: "14px",
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 12, color: "#F87171",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                🚪 Log Out
              </button>
            </>
          )}

          {/* ══════════════════════════════════════════
              EDIT ACCOUNT
          ══════════════════════════════════════════ */}
          {section === "edit" && (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: `4px solid ${colors.light}`,
              borderRadius: 14, padding: "28px 28px",
            }}>
              <h2 style={{ margin: "0 0 6px", fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800 }}>
                ✏️ Edit Account
              </h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>
                Update your personal information
              </p>

              {editErrors.api && (
                <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #F87171",
                              borderRadius: 8, padding: "10px 14px", color: "#F87171",
                              fontSize: 13, marginBottom: 16 }}>
                  {editErrors.api}
                </div>
              )}
              {editSuccess && (
                <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid #10B981",
                              borderRadius: 8, padding: "10px 14px", color: "#6EE7B7",
                              fontSize: 13, marginBottom: 16 }}>
                  {editSuccess}
                </div>
              )}

              {field("Full Name",     "name",  editData, setEditData, editErrors)}
              {field("Email Address", "email", editData, setEditData, editErrors, "email")}
              {field("Phone Number",  "phone", editData, setEditData, editErrors, "tel")}

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setSection("main")} style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent", color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                }}>
                  Cancel
                </button>
                <button onClick={handleEditSave} className="prof-btn" style={{
                  flex: 2, padding: "11px", borderRadius: 8, border: "none",
                  background: `linear-gradient(135deg,${colors.light},${colors.accent})`,
                  color: "white", fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                }}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════
              CHANGE PASSWORD
          ══════════════════════════════════════════ */}
          {section === "password" && (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderTop: `4px solid ${colors.light}`,
              borderRadius: 14, padding: "28px 28px",
            }}>
              <h2 style={{ margin: "0 0 6px", fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800 }}>
                🔒 Change Password
              </h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24 }}>
                Choose a strong password of at least 8 characters
              </p>

              {pwErrors.api && (
                <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #F87171",
                              borderRadius: 8, padding: "10px 14px", color: "#F87171",
                              fontSize: 13, marginBottom: 16 }}>
                  {pwErrors.api}
                </div>
              )}
              {pwSuccess && (
                <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid #10B981",
                              borderRadius: 8, padding: "10px 14px", color: "#6EE7B7",
                              fontSize: 13, marginBottom: 16 }}>
                  {pwSuccess}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Current Password</label>
                <input type="password" value={pwData.current}
                  onChange={(e) => { setPwData((p) => ({ ...p, current: e.target.value })); setPwErrors((p) => ({ ...p, current: "" })); }}
                  style={inp(pwErrors.current)} />
                {pwErrors.current && <p style={{ color: "#F87171", fontSize: "0.78rem", margin: "4px 0 0" }}>{pwErrors.current}</p>}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>New Password</label>
                <input type="password" value={pwData.newPw}
                  onChange={(e) => { setPwData((p) => ({ ...p, newPw: e.target.value })); setPwErrors((p) => ({ ...p, newPw: "" })); }}
                  placeholder="Min. 8 characters"
                  style={inp(pwErrors.newPw)} />
                {pwErrors.newPw && <p style={{ color: "#F87171", fontSize: "0.78rem", margin: "4px 0 0" }}>{pwErrors.newPw}</p>}
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Confirm New Password</label>
                <input type="password" value={pwData.confirm}
                  onChange={(e) => { setPwData((p) => ({ ...p, confirm: e.target.value })); setPwErrors((p) => ({ ...p, confirm: "" })); }}
                  placeholder="Repeat new password"
                  style={inp(pwErrors.confirm)} />
                {pwErrors.confirm && <p style={{ color: "#F87171", fontSize: "0.78rem", margin: "4px 0 0" }}>{pwErrors.confirm}</p>}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSection("main")} style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent", color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                }}>
                  Cancel
                </button>
                <button onClick={handlePasswordSave} className="prof-btn" style={{
                  flex: 2, padding: "11px", borderRadius: 8, border: "none",
                  background: `linear-gradient(135deg,${colors.light},${colors.accent})`,
                  color: "white", fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                }}>
                  Update Password
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Logout confirmation modal ── */}
      {showLogoutConfirm && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16,
        }}>
          <div style={{
            background: "#0F1724", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16, padding: "32px 28px",
            textAlign: "center", width: "100%", maxWidth: 360,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚪</div>
            <h3 style={{ margin: "0 0 8px", fontFamily: "'Syne',sans-serif", fontSize: 20, color: "white" }}>
              Log Out?
            </h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 24 }}>
              You will be redirected to the login page.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, padding: "11px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "transparent", color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, padding: "11px", borderRadius: 8, border: "none",
                  background: "#EF4444", color: "white",
                  fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14,
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}