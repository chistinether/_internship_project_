import { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { API_BASE } from "../api";
import ProfilePage from "../pages/ProfilePage";

export default function AdminDashboard() {
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
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [goalText, setGoalText] = useState("");
  const [goalType, setGoalType] = useState("daily");
  const [goalMsg, setGoalMsg] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [viewStudent, setViewStudent] = useState(null);

  useEffect(() => {

  const loadDashboard = async () => {

    try {

      const studentsRes =
        await api("/api/students/");

      const studentsData =
        await studentsRes.json();

      if (studentsRes.ok) {
        setStudents(studentsData);
      }

      const supervisorsRes =
        await api("/api/supervisors/");

      const supervisorsData =
        await supervisorsRes.json();

      if (supervisorsRes.ok) {
        setSupervisors(supervisorsData);
      }

      const attendanceRes =
        await api("/api/attendance/");

      const attendanceData =
        await attendanceRes.json();

      if (attendanceRes.ok) {
        setAttendance(attendanceData);
      }

    } catch (error) {

      console.error(
        "Dashboard load failed:",
        error
      );
    }
  };

  loadDashboard();

}, [token]);

  const handleSendGoal = async () => {

  if (
    !goalText.trim() ||
    !selectedSupervisor
  ) {

    setGoalMsg(
      "Select a supervisor and enter a goal."
    );

    return;
  }

  try {

    const response = await api(
      "/api/goals/supervisor/",
      {
        method: "POST",

        body: JSON.stringify({
          supervisor: selectedSupervisor,
          goal: goalText,
          type: goalType,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      setGoalMsg(
        data.error ||
        "Failed to send goal."
      );

      return;
    }

    setGoalMsg(
      "Goal sent successfully!"
    );

    setGoalText("");

  } catch (error) {

    console.error(error);

    setGoalMsg(
      "Server error"
    );
  }
};

  const tabs = [
    { id: "overview",    label: "Overview" },
    { id: "students",    label: "Students" },
    { id: "supervisors", label: "Supervisors" },
    { id: "goals",       label: "Send Goals" },
    { id: "attendance",  label: "Attendance" },
    { id: "progress",    label: "Progress" },
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
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.subtitle}>Welcome, {name}</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}></div>
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
              { label: "Total Students", value: `${students.length} enrolled`,    action: () => setActiveTab("students") },
              { label: "Supervisors",    value: `${supervisors.length} active`,   action: () => setActiveTab("supervisors") },
              { label: "Send Goals",     value: "To supervisors",                 action: () => setActiveTab("goals") },
              { label: "Attendance",     value: "Track all students",             action: () => setActiveTab("attendance") },
              { label: "Progress",       value: "Overall program evaluation",     action: () => setActiveTab("progress") },
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
            <h2 style={s.sectionTitle}>Student Management</h2>
            {viewStudent ? (
              <div>
                <button style={{ ...s.smallBtn, marginBottom: "16px" }} onClick={() => setViewStudent(null)}>
                  ← Back to list
                </button>
                <div style={s.profileCard}>
                  <h3 style={{ margin: "0 0 12px" }}>{viewStudent.full_name}</h3>
                  {[
                    ["Registration No.", viewStudent.registration_number],
                    ["Course",           viewStudent.course],
                    ["Department",       viewStudent.department],
                    ["Year of Study",    viewStudent.year_of_study],
                    ["Internship Place", viewStudent.internship_place],
                    ["Supervisor",       viewStudent.supervisor_name],
                    ["Phone",            viewStudent.phone_number],
                  ].map(([label, value]) => (
                    <div key={label} style={s.profileRow}>
                      <span style={{ color: "#aaa" }}>{label}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              students.map((st) => (
                <div key={st.registration_number} style={s.studentCard}>
                  <div>
                    <strong>{st.full_name}</strong>
                    <p style={{ color: "#aaa", margin: "4px 0 0", fontSize: "0.85rem" }}>
                      {st.course} — {st.internship_place}
                    </p>
                  </div>
                  <button style={s.smallBtn} onClick={() => setViewStudent(st)}>
                    View Profile
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* SUPERVISORS */}
        {activeTab === "supervisors" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Supervisors</h2>
            {supervisors.length === 0 ? (
              <p style={{ color: "#aaa" }}>No supervisors found.</p>
            ) : (
              supervisors.map((sv) => (
                <div key={sv.user} style={s.studentCard}>
                  <div>
                    <strong>{sv.full_name}</strong>
                    <p style={{ color: "#aaa", margin: "4px 0 0", fontSize: "0.85rem" }}>
                      Department: {sv.department}
                    </p>
                  </div>
                  <button
                    style={s.smallBtn}
                    onClick={() => setSelectedSupervisor(sv.user)}
                  >
                    {selectedSupervisor === sv.user ? "✓ Selected" : "Select"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* SEND GOALS TO SUPERVISOR */}
        {activeTab === "goals" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Send Goals to Supervisor</h2>
            {goalMsg && <div style={s.successBox}>{goalMsg}</div>}
            <label style={s.label}>Select Supervisor</label>
            <select
              value={selectedSupervisor || ""}
              onChange={(e) => setSelectedSupervisor(e.target.value)}
              style={s.select}
            >
              <option value="">-- Select supervisor --</option>
              {supervisors.map((sv) => (
                <option key={sv.user} value={sv.user}>
                  {sv.full_name}
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
              placeholder="Enter goal for supervisor..."
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              style={s.textarea}
            />
            <button style={s.btn} onClick={handleSendGoal}>Send Goal</button>
          </div>
        )}

        {/* ATTENDANCE */}
        {activeTab === "attendance" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Student Attendance Tracking</h2>
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

        {/* PROGRESS */}
        {activeTab === "progress" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Overall Program Evaluation</h2>
            <div style={s.statsGrid}>
              <div style={s.statCard}>
                <span style={s.statNumber}>{students.length}</span>
                <span style={s.statLabel}>Total Students</span>
              </div>
              <div style={s.statCard}>
                <span style={s.statNumber}>{supervisors.length}</span>
                <span style={s.statLabel}>Supervisors</span>
              </div>
              <div style={s.statCard}>
                <span style={s.statNumber}>{attendance.length}</span>
                <span style={s.statLabel}>Attendance Records</span>
              </div>
            </div>
            <p style={{ color: "#aaa", marginTop: "16px" }}>
              Full evaluation reports and analytics will appear here as students submit reports and logs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a0a0a 0%, #2e1a0f 50%, #0a1a2e 100%)",
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
  activeTab:    { background: "#7f1d1d", borderColor: "#7f1d1d" },
  content:      { maxWidth: "800px" },
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  card: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px", padding: "20px", cursor: "pointer",
  },
  cardTitle:    { margin: "0 0 8px", fontSize: "1rem", color: "white" },
  cardText:     { color: "#aaa", fontSize: "0.85rem", margin: 0 },
  cardArrow:    { display: "block", marginTop: "12px", color: "#fca5a5" },
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
    padding: "12px 24px", background: "#7f1d1d", color: "white",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontSize: "1rem", alignSelf: "flex-start",
  },
  smallBtn: {
    padding: "8px 16px", background: "#7f1d1d", color: "white",
    border: "none", borderRadius: "6px", cursor: "pointer",
    fontSize: "0.85rem", whiteSpace: "nowrap",
  },
  studentCard: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "16px", gap: "12px",
  },
  profileCard: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "20px",
  },
  profileRow: {
    display: "flex", justifyContent: "space-between",
    padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px",
  },
  statCard: {
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px", padding: "20px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
  },
  statNumber: { fontSize: "2rem", fontWeight: "bold", color: "white" },
  statLabel:  { color: "#aaa", fontSize: "0.85rem" },
  successBox: {
    background: "rgba(22,101,52,0.3)", border: "1px solid #166534",
    borderRadius: "8px", padding: "12px", color: "#86efac",
  },
  profileBtn: {
  padding: "10px 18px",
  borderRadius: "8px",
  border: "none",
  background: "#991b1b",
  color: "white",
  cursor: "pointer",
  fontSize: "0.9rem",
},
};