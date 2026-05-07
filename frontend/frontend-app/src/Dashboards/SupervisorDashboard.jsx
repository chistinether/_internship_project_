import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function SupervisorDashboard() {
  const { user } = useUser();
  const { name, token } = user;

  const api = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  const [activeTab, setActiveTab] = useState("overview");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [goalText, setGoalText] = useState("");
  const [goalType, setGoalType] = useState("daily");
  const [goalMsg, setGoalMsg] = useState("");
  const [evalText, setEvalText] = useState("");
  const [evalMsg, setEvalMsg] = useState("");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    api("/api/students/").then((r) => r.json()).then(setStudents).catch(() => {});
    api("/api/reports/").then((r) => r.json()).then(setReports).catch(() => {});
    api("/api/attendance/").then((r) => r.json()).then(setAttendance).catch(() => {});
  }, []);

  const handleSendGoal = () => {
    if (!goalText.trim() || !selectedStudent) {
      setGoalMsg("Select a student and enter a goal.");
      return;
    }
    api("/api/goals/", {
      method: "POST",
      body: JSON.stringify({ student: selectedStudent, goal: goalText, type: goalType }),
    }).then(() => {
      setGoalMsg("Goal sent to student!");
      setGoalText("");
    });
  };

  const handleEvaluate = () => {
    if (!evalText.trim() || !selectedStudent) {
      setEvalMsg("Select a student and enter evaluation.");
      return;
    }
    api("/api/evaluations/", {
      method: "POST",
      body: JSON.stringify({ student: selectedStudent, comments: evalText }),
    }).then(() => {
      setEvalMsg("Evaluation submitted!");
      setEvalText("");
    });
  };

  const handleSignOff = (reportId) => {
    api(`/api/reports/${reportId}/`, {
      method: "PATCH",
      body: JSON.stringify({ status: "approved" }),
    }).then(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "approved" } : r))
      );
    });
  };

  const tabs = [
    { id: "overview",    label: "Overview" },
    { id: "students",    label: "Students" },
    { id: "reports",     label: "Reports" },
    { id: "goals",       label: "Send Goals" },
    { id: "evaluate",    label: "Evaluate" },
    { id: "attendance",  label: "Attendance" },
  ];

  const s = styles;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Supervisor Dashboard</h1>
          <p style={s.subtitle}>Welcome, {name}</p>
        </div>
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
              { label: "Students",         value: `${students.length} assigned`,                            action: () => setActiveTab("students") },
              { label: "Pending Reports",  value: `${reports.filter(r => r.status === "pending").length} to review`, action: () => setActiveTab("reports") },
              { label: "Send Goals",       value: "Daily & weekly goals",                                   action: () => setActiveTab("goals") },
              { label: "Evaluate",         value: "Student performance",                                    action: () => setActiveTab("evaluate") },
              { label: "Attendance",       value: "Track student attendance",                               action: () => setActiveTab("attendance") },
            ].map((card) => (
              <div key={card.label} style={s.card} onClick={card.action}>
                <h3 style={s.cardTitle}>{card.label}</h3>
                <p style={s.cardText}>{card.value}</p>
                <span style={s.cardArrow}>→</span>
              </div>
            ))}
          </div>
        )}

        {/* STUDENTS */}
        {activeTab === "students" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Student Records</h2>
            {students.length === 0 ? (
              <p style={{ color: "#aaa" }}>No students assigned yet.</p>
            ) : (
              students.map((st) => (
                <div key={st.registration_number} style={s.studentCard}>
                  <div>
                    <strong>{st.full_name}</strong>
                    <p style={{ color: "#aaa", margin: "4px 0 0", fontSize: "0.85rem" }}>
                      {st.course} — Year {st.year_of_study} — {st.internship_place}
                    </p>
                    <p style={{ color: "#aaa", fontSize: "0.85rem" }}>{st.registration_number}</p>
                  </div>
                  <button
                    style={s.smallBtn}
                    onClick={() => setSelectedStudent(st.registration_number)}
                  >
                    {selectedStudent === st.registration_number ? "✓ Selected" : "Select"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* REPORTS */}
        {activeTab === "reports" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Weekly Reports</h2>
            {reports.length === 0 ? (
              <p style={{ color: "#aaa" }}>No reports submitted yet.</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} style={s.reportCard}>
                  <div>
                    <strong>{r.full_name} — Week {r.week_number}</strong>
                    <p style={{ color: "#ccc", margin: "8px 0", fontSize: "0.9rem" }}>{r.content}</p>
                    <span style={{
                      fontSize: "0.8rem", padding: "2px 10px", borderRadius: "20px",
                      background: r.status === "approved" ? "#166534" : "#713f12",
                      color: "white",
                    }}>
                      {r.status}
                    </span>
                  </div>
                  {r.status === "pending" && (
                    <button style={s.smallBtn} onClick={() => handleSignOff(r.id)}>
                      Sign Off
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* SEND GOALS */}
        {activeTab === "goals" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Send Goals to Student</h2>
            {goalMsg && <div style={s.successBox}>{goalMsg}</div>}
            <label style={s.label}>Select Student</label>
            <select
              value={selectedStudent || ""}
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={s.select}
            >
              <option value="">-- Select student --</option>
              {students.map((st) => (
                <option key={st.registration_number} value={st.registration_number}>
                  {st.full_name}
                </option>
              ))}
            </select>
            <label style={s.label}>Goal Type</label>
            <select value={goalType} onChange={(e) => setGoalType(e.target.value)} style={s.select}>
              <option value="daily">Daily Goal</option>
              <option value="weekly">Weekly Goal</option>
            </select>
            <label style={s.label}>Goal</label>
            <textarea
              placeholder="Enter the goal for this student..."
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              style={s.textarea}
            />
            <button style={s.btn} onClick={handleSendGoal}>Send Goal</button>
          </div>
        )}

        {/* EVALUATE */}
        {activeTab === "evaluate" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Evaluate Student Performance</h2>
            {evalMsg && <div style={s.successBox}>{evalMsg}</div>}
            <label style={s.label}>Select Student</label>
            <select
              value={selectedStudent || ""}
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={s.select}
            >
              <option value="">-- Select student --</option>
              {students.map((st) => (
                <option key={st.registration_number} value={st.registration_number}>
                  {st.full_name}
                </option>
              ))}
            </select>
            <label style={s.label}>Evaluation / Comments</label>
            <textarea
              placeholder="Evaluate daily performance, note achievements and areas to improve..."
              value={evalText}
              onChange={(e) => setEvalText(e.target.value)}
              style={{ ...s.textarea, height: "150px" }}
            />
            <button style={s.btn} onClick={handleEvaluate}>Submit Evaluation</button>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === "attendance" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Student Attendance</h2>
            {attendance.length === 0 ? (
              <p style={{ color: "#aaa" }}>No attendance records yet.</p>
            ) : (
              attendance.map((a, i) => (
                <div key={i} style={s.studentCard}>
                  <span>{a.student_name}</span>
                  <span style={{ color: "#aaa", fontSize: "0.85rem" }}>
                    In: {a.check_in} — Out: {a.check_out || "Still in"}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f1a2e 0%, #1a0f2e 50%, #0f2e1a 100%)",
    padding: "24px", fontFamily: "'Segoe UI', sans-serif", color: "white",
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px",
  },
  title:    { fontSize: "2rem", margin: 0, color: "white" },
  subtitle: { color: "#aaa", margin: "4px 0 0" },
  dateBadge: {
    background: "rgba(255,255,255,0.1)",
    padding: "8px 16px", borderRadius: "20px", fontSize: "0.9rem",
  },
  tabs:     { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" },
  tab: {
    padding: "10px 18px", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent", color: "white", cursor: "pointer", fontSize: "0.9rem",
  },
  activeTab:    { background: "#4a1d7a", borderColor: "#4a1d7a" },
  content:      { maxWidth: "800px" },
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  card: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px", padding: "20px", cursor: "pointer",
  },
  cardTitle:    { margin: "0 0 8px", fontSize: "1rem", color: "white" },
  cardText:     { color: "#aaa", fontSize: "0.85rem", margin: 0 },
  cardArrow:    { display: "block", marginTop: "12px", color: "#a78bfa" },
  section:      { display: "flex", flexDirection: "column", gap: "12px" },
  sectionTitle: { margin: "0 0 8px", fontSize: "1.4rem" },
  label:        { color: "#ccc", fontSize: "0.9rem" },
  select: {
    padding: "10px", borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white", fontSize: "1rem", width: "100%", maxWidth: "400px",
  },
  textarea: {
    padding: "12px", borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "white", fontSize: "1rem", height: "120px",
    resize: "vertical", fontFamily: "inherit",
  },
  btn: {
    padding: "12px 24px", background: "#4a1d7a", color: "white",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontSize: "1rem", alignSelf: "flex-start",
  },
  smallBtn: {
    padding: "8px 16px", background: "#4a1d7a", color: "white",
    border: "none", borderRadius: "6px", cursor: "pointer",
    fontSize: "0.85rem", whiteSpace: "nowrap",
  },
  studentCard: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "16px", gap: "12px",
  },
  reportCard: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "16px", gap: "12px",
  },
  successBox: {
    background: "rgba(22,101,52,0.3)", border: "1px solid #166534",
    borderRadius: "8px", padding: "12px", color: "#86efac",
  },
};