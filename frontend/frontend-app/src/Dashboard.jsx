import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(120);
  const [orders, setOrders] = useState(75);
  const [revenue, setRevenue] = useState(2500);
  const [messages, setMessages] = useState(18);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* Sidebar */}
      <div style={{
        width: 220,
        background: "#001f3f",
        color: "white",
        padding: 20
      }}>
        <h2>ILES</h2>

        <p>Dashboard</p>
        <p>Users</p>
        <p>Reports</p>

        <button onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: 30, background: "#f4f6f9" }}>
        <h2>Dashboard</h2>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(2, 1fr)" }}>

          <div>
            <h3>Users</h3>
            <p>{users}</p>
            <button onClick={() => setUsers(users + 1)}>Add</button>
          </div>

          <div>
            <h3>Orders</h3>
            <p>{orders}</p>
            <button onClick={() => setOrders(orders + 1)}>Add</button>
          </div>

          <div>
            <h3>Revenue</h3>
            <p>${revenue}</p>
            <button onClick={() => setRevenue(revenue + 100)}>Add</button>
          </div>

          <div>
            <h3>Messages</h3>
            <p>{messages}</p>
            <button onClick={() => setMessages(messages + 1)}>Add</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;