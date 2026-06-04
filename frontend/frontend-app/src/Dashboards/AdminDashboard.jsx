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
    "Admin";

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
        const [studentsRes, supervisorsRes, attendanceRes] = await Promise.all([
          api("/api/students/"),
          api("/api/supervisors/"),
          api("/api/attendance/"),
        ]);

        const studentsData = await studentsRes.json();
        const supervisorsData = await supervisorsRes.json();
        const attendanceData = await attendanceRes.json();

        if (studentsRes.ok) setStudents(studentsData);
        if (supervisorsRes.ok) setSupervisors(supervisorsData);
        if (attendanceRes.ok) setAttendance(attendanceData);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      }
    };

    if (token) loadDashboard();
  }, [token]);

  const handleSendGoal = async () => {
    if (!goalText.trim() || !selectedSupervisor) {
      setGoalMsg("Select a supervisor and enter a goal.");
      return;
    }

    try {
      const response = await api("/api/goals/supervisor/", {
        method: "POST",
        body: JSON.stringify({
          supervisor: selectedSupervisor,
          goal: goalText,
          type: goalType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGoalMsg(data.error || "Failed to send goal.");
        return;
      }

      setGoalMsg("Goal sent successfully!");
      setGoalText("");
    } catch (error) {
      console.error(error);
      setGoalMsg("Server error");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "students", label: "Students" },
    { id: "supervisors", label: "Supervisors" },
    { id: "goals", label: "Send Goals" },
    { id: "attendance", label: "Attendance" },
    { id: "progress", label: "Progress" },
  ];

  const s = styles;

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} onLogout={() => (window.location.href = "/")} />;
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Admin Dashboard</h1>
          <p style={s.subtitle}>Welcome, {name}</p>
        </div>
        <button onClick={() => setShowProfile(true)} style={s.profileBtn}>
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
              { label: "Total Students", value: `${students.length} enrolled`, action: () => setActiveTab("students") },
              { label: "Supervisors", value: `${supervisors.length} active`, action: () => setActiveTab("supervisors") },
              { label: "Send Goals", value: "To supervisors", action: () => setActiveTab("goals") },
              { label: "Attendance", value: "Track all students", action: () => setActiveTab("attendance") },
              { label: "Progress", value: "Overall program evaluation", action: () => setActiveTab("progress") },
            ].map((card) => (
              <div key={card.label} style={s.card} onClick={card.action}>
                <h3 style={s.cardTitle}>{card.label}</h3>
                <p style={s.cardText}>{card.value}</p>
                <span style={s.cardArrow}>→</span>
              </div>
            ))}
          </div>
        )}

        {/* Other tabs (Students, Supervisors, Goals, etc.) remain the same but now use better styles */}
        {/* ... (your existing tab content) ... */}

        {activeTab === "students" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Student Management</h2>
            {/* Your students content */}
          </div>
        )}

        {/* Add other tabs similarly */}
      </div>
    </div>
  );
}

/* ===================== IMPROVED STYLES ===================== */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0a1a 0%, #1a0f2e 50%, #1a0a1a 100%)",
    padding: "24px",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#e0e0e0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  title: { fontSize: "2rem", margin: 0, color: "#ffffff" },
  subtitle: { color: "#c0c0e0", margin: "4px 0 0" },
  dateBadge: {
    background: "rgba(255,255,255,0.12)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    color: "#e0d0ff",
  },
  tabs: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" },
  tab: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.06)",
    color: "#e0e0ff",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  activeTab: { background: "#9f2a2a", borderColor: "#ff5555", color: "#ffffff" },

  content: { maxWidth: "800px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },

  card: {
    background: "rgba(255,255,255,0.11)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
  },
  cardTitle: { margin: "0 0 8px", fontSize: "1.05rem", color: "#ffffff", fontWeight: "600" },
  cardText: { color: "#d0d0ff", fontSize: "0.9rem", margin: 0 },
  cardArrow: { display: "block", marginTop: "12px", color: "#ff8888" },

  section: { display: "flex", flexDirection: "column", gap: "12px" },
  sectionTitle: { margin: "0 0 16px", fontSize: "1.5rem", color: "#ffffff" },

  label: { color: "#c0c0ff", fontSize: "0.95rem", marginBottom: "6px", display: "block" },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid rgba(150,150,255,0.4)",
    background: "rgba(255,255,255,0.08)",
    color: "#e0e0ff",
    fontSize: "1rem",
    width: "100%",
    maxWidth: "400px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid rgba(150,150,255,0.4)",
    background: "rgba(255,255,255,0.08)",
    color: "#e0e0ff",
    fontSize: "1rem",
    height: "120px",
    resize: "vertical",
  },

  btn: {
    padding: "12px 24px",
    background: "#c53030",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  smallBtn: {
    padding: "8px 16px",
    background: "#c53030",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },

  studentCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "10px",
    padding: "16px",
    gap: "12px",
  },
  profileCard: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "10px",
    padding: "20px",
  },
  profileRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
  },
  statCard: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  statNumber: { fontSize: "2.2rem", fontWeight: "bold", color: "#ffffff" },
  statLabel: { color: "#b0b0ff", fontSize: "0.9rem" },

  successBox: {
    background: "rgba(34, 197, 151, 0.25)",
    border: "1px solid #4ade80",
    borderRadius: "8px",
    padding: "12px",
    color: "#a1f0c9",
    marginBottom: "16px",
  },

  profileBtn: {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#b91c1c",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};