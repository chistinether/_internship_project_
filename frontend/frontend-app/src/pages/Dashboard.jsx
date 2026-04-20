import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(120);
  const [orders, setOrders] = useState(75);
  const [revenue, setRevenue] = useState(2500);
  const [messages, setMessages] = useState(18);

  // 📊 Chart data
  const data = [
    { name: "Mon", users: 100, orders: 40, revenue: 1200 },
    { name: "Tue", users: 120, orders: 55, revenue: 1500 },
    { name: "Wed", users: 140, orders: 60, revenue: 1800 },
    { name: "Thu", users: 160, orders: 70, revenue: 2200 },
    { name: "Fri", users: 180, orders: 90, revenue: 2600 }
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{
        width: 240,
        background: "#0a192f",
        color: "white",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}>
        <div>
          <h2>ILES System</h2>
          <p>Dashboard</p>
          <p>Users</p>
          <p>Reports</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            navigate("/");
          }}
          style={{
            padding: 10,
            background: "#ff4d4d",
            border: "none",
            color: "white",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, background: "#f5f7fb", padding: 20 }}>

        <h2>Dashboard Overview</h2>

        {/* CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 30
        }}>
          <div>Users: {users}</div>
          <div>Orders: {orders}</div>
          <div>Revenue: ${revenue}</div>
          <div>Messages: {messages}</div>
        </div>

        {/* 📊 LINE CHART */}
        <div style={{ width: "100%", height: 300, background: "white", padding: 20 }}>
          <h3>Users Growth</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#0a192f" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 BAR CHART */}
        <div style={{ width: "100%", height: 300, background: "white", padding: 20, marginTop: 20 }}>
          <h3>Orders & Revenue</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#8884d8" />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;