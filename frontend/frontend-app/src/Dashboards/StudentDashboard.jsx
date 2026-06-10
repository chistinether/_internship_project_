import { useState } from "react";
import { useUser } from "../UserContext";
import { API_BASE } from "../api";
import ProfilePage from "../pages/ProfilePage";

export default function StudentDashboard() {
  const { user } = useUser();

const token = user?.token || localStorage.getItem("access");

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

const name =
  user?.name ||
  user?.first_name ||
  storedUser.first_name ||
  storedUser.email ||
  "Student";


  const api = (url, options = {}) =>
    fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [checkStatus, setCheckStatus] = useState(null);
  const [checkTime, setCheckTime] = useState(null);
  const [logText, setLogText] = useState("");
  const [hours, setHours] = useState("");
  const [logMsg, setLogMsg] = useState("");
  const [reportText, setReportText] = useState("");
  const [reportWeek, setReportWeek] = useState("");
  const [reportMsg, setReportMsg] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [goalsMsg, setGoalsMsg] = useState("");
  const [goalFeedback, setGoalFeedback] = useState("");

  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString();
    setCheckStatus("in");
    useEffect(() => {
      api("/api/attendance/today/")
      .then(res => res.json())
      .then(data => {
      setCheckStatus(data.status);
      setCheckTime(data.time);
     });
    }, []);
    setCheckTime(now);
    api("/api/attendance/check-in/", { method: "POST" });
  };

  const handleCheckOut = () => {
    const now = new Date().toLocaleTimeString();
    setCheckStatus("out");
    setCheckTime(now);
    api("/api/attendance/check-out/", { method: "POST" });
  };

  const handleLogSubmit = () => {
    if (!logText.trim() || !hours) {
      setLogMsg("Please fill in both the activity and hours.");
      return;
    }
    api("/api/daily-logs/", {
      method: "POST",
      body: JSON.stringify({ content: logText, hours }),
    }).then(() => {
      setLogMsg("Daily log saved!");
      setLogText("");
      setHours("");
    });
  };

  const handleReportSubmit = () => {
    if (!reportText.trim() || !reportWeek) {
      setReportMsg("Please fill in week number and report content.");
      return;
    }
    api("/api/reports/", {
      method: "POST",
      body: JSON.stringify({ content: reportText, week_number: reportWeek }),
    }).then(() => {
      setReportMsg("Weekly report submitted to your supervisor!");
      setReportText("");
      setReportWeek("");
    });
  };

  const handleProofUpload = () => {
    if (!proofFile) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", proofFile);
    fetch(`${API_BASE}/api/proofs/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(() => alert("Proof of work uploaded and sent to your email!"));
  };

  const handleGoalFeedback = () => {
    if (!goalFeedback.trim()) return;
    api("/api/goals/feedback/", {
      method: "POST",
      body: JSON.stringify({ feedback: goalFeedback }),
    }).then(() => {
      setGoalsMsg("Feedback sent to supervisor!");
      setGoalFeedback("");
    });
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "checkin",  label: "Check In/Out" },
    { id: "log",      label: "Daily Log" },
    { id: "report",   label: "Weekly Report" },
    { id: "goals",    label: "Goals" },
    { id: "proof",    label: "Proof of Work" },
  ];

  const s = styles;
  if (showProfile) {
  return (
    <ProfilePage
      onBack={() => setShowProfile(false)}
      onLogout={() => {
        window.location.href = "/";
      }}
    />
  );
}

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Student Dashboard</h1>
          <p style={s.subtitle}>Welcome back, {name}</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}> </div>
        <button
          onClick={() => setShowProfile(true)}
          style={s.profileBtn}
          >
          Profile
        </button>
        <div style={s.dateBadge}>{new Date().toDateString()}</div>
      </div>

      <div style={s.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{ ...s.tab, ...(activeTab === t.id ? s.activeTab : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={s.grid}>
            {[
              { label: "Attendance",     value: "Check your daily attendance",    action: () => setActiveTab("checkin") },
              { label: "Daily Log",      value: "Document today's tasks",          action: () => setActiveTab("log") },
              { label: "Weekly Report",  value: "Submit report to supervisor",     action: () => setActiveTab("report") },
              { label: "Goals",          value: "View & respond to goals",         action: () => setActiveTab("goals") },
              { label: "Proof of Work",  value: "Upload & send to email",          action: () => setActiveTab("proof") },
            ].map((card) => (
              <div key={card.label} style={s.card} onClick={card.action}>
                <h3 style={s.cardTitle}>{card.label}</h3>
                <p style={s.cardText}>{card.value}</p>
                <span style={s.cardArrow}>→</span>
              </div>
            ))}
          </div>
        )}

        {/* CHECK IN / OUT */}
        {activeTab === "checkin" && (
          <div style={s.section}>
           <h2
  style={{
    ...s.sectionTitle,
    color: "#fcfcfa",
  }}
>
  Digital Check In / Out
</h2>
            {checkStatus && (
              <div style={s.successBox}>
                Checked {checkStatus} at {checkTime}
              </div>
            )}
            <div style={s.row}>
              <button
                style={{ ...s.btn, ...s.btnGreen, opacity: checkStatus === "in" ? 0.5 : 1 }}
                onClick={handleCheckIn}
                disabled={checkStatus === "in"}
              >
                Check In
              </button>
              <button
                style={{ ...s.btn, ...s.btnRed, opacity: checkStatus !== "in" ? 0.5 : 1 }}
                onClick={handleCheckOut}
                disabled={checkStatus !== "in"}
              >
                Check Out
              </button>
            </div>
          </div>
        )}

        {/* DAILY LOG */}
        {activeTab === "log" && (
          <div style={s.section}>
          <h2
  style={{
    ...s.sectionTitle,
    color: "#ffff", 
  }}
>
  Daily Activity Log
</h2>
            {logMsg && <div style={s.successBox}>{logMsg}</div>}
            <label style={s.label}>Hours Worked</label>
            <input
              type="number"
              placeholder="e.g. 8"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              style={s.input}
            />
            <label style={s.label}>Tasks & Work Experience</label>
            <textarea
              placeholder="Describe your daily tasks, what you learned, work experience gained..."
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              style={s.textarea}
            />
            <button style={s.btn} onClick={handleLogSubmit}>Save Daily Log</button>
          </div>
        )}

        {/* WEEKLY REPORT */}
        {activeTab === "report" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Submit Weekly Report</h2>
            {reportMsg && <div style={s.successBox}>{reportMsg}</div>}
            <label style={s.label}>Week Number</label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={reportWeek}
              onChange={(e) => setReportWeek(e.target.value)}
              style={s.input}
            />
            <label style={s.label}>Report Content</label>
            <textarea
              placeholder="Summarize your week: tasks completed, challenges, achievements..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              style={{ ...s.textarea, height: "180px" }}
            />
            <button style={s.btn} onClick={handleReportSubmit}>Submit to Supervisor</button>
          </div>
        )}

        {/* GOALS */}
        {activeTab === "goals" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Goals from Supervisor</h2>
            <div style={s.goalBox}>
              <p style={{ color: "#aaa" }}>Goals sent by your supervisor will appear here.</p>
            </div>
            {goalsMsg && <div style={s.successBox}>{goalsMsg}</div>}
            <label style={s.label}>Your Feedback on Goals</label>
            <textarea
              placeholder="Are the goals met? Share your feedback with your supervisor..."
              value={goalFeedback}
              onChange={(e) => setGoalFeedback(e.target.value)}
              style={s.textarea}
            />
            <button style={s.btn} onClick={handleGoalFeedback}>Send Feedback</button>
          </div>
        )}

        {/* PROOF OF WORK */}
        {activeTab === "proof" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Upload Proof of Work</h2>
            <p style={{ color: "#aaa", marginBottom: "16px" }}>
              Upload a document or image. It will be sent to your email as a record.
            </p>
            <input
              type="file"
              onChange={(e) => setProofFile(e.target.files[0])}
              style={s.fileInput}
            />
            <button style={s.btn} onClick={handleProofUpload}>Upload & Send to Email</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0f2e 0%, #0d1b4b 50%, #0a2a1f 100%)",
    padding: "24px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "white",
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "24px",
    flexWrap: "wrap", gap: "12px",
  },
  title:    { fontSize: "2rem", margin: 0, color: "white" },
  subtitle: { color: "#aaa", margin: "4px 0 0" },
  dateBadge: {
    background: "rgba(255,255,255,0.1)",
    padding: "8px 16px", borderRadius: "20px", fontSize: "0.9rem",
  },
  tabs: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" },
  tab: {
    padding: "10px 18px", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent", color: "white",
    cursor: "pointer", fontSize: "0.9rem",
  },
  activeTab: { background: "rgb(14, 25, 107)", borderColor: "rgb(14, 25, 107)" },
  content:  { maxWidth: "800px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px", padding: "20px", cursor: "pointer",
    transition: "background 0.2s",
  },
  cardTitle:  { margin: "0 0 8px", fontSize: "1rem", color: "white" },
  cardText:   { color: "#aaa", fontSize: "0.85rem", margin: 0 },
  cardArrow:  { display: "block", marginTop: "12px", color: "#6b8cff" },
  section:    { display: "flex", flexDirection: "column", gap: "12px" },
  sectionTitle: { margin: "0 0 8px", fontSize: "1.4rem" },
  label:      { color: "#ccc", fontSize: "0.9rem" },
  input: {
    padding: "10px", borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white", fontSize: "1rem", width: "200px",
  },
  textarea: {
    padding: "12px", borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white", fontSize: "1rem",
    height: "120px", resize: "vertical", fontFamily: "inherit",
  },
  btn: {
    padding: "12px 24px", background: "rgb(14, 25, 107)",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "1rem", alignSelf: "flex-start",
  },
  btnGreen: { background: "#166534" },
  btnRed:   { background: "#7f1d1d" },
  row:      { display: "flex", gap: "12px" },
  successBox: {
    background: "rgba(22,101,52,0.3)", border: "1px solid #166534",
    borderRadius: "8px", padding: "12px", color: "#86efac",
  },
  goalBox: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px", padding: "16px", minHeight: "80px",
  },
  fileInput: { color: "white" },
  profileBtn: {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "0.9rem",
},
};