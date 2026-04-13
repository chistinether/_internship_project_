import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const navigate = useNavigate();

  // 🔥 Dynamic state
  const [users, setUsers] = useState(120);
  const [orders, setOrders] = useState(75);
  const [revenue, setRevenue] = useState(2500);
  const [messages, setMessages] = useState(18);

  const container = {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial"
  };

  const sidebar = {
    width: "220px",
    backgroundColor: "#001f3f",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const main = {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: "30px"
  };

  const cardContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  };

  const card = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  };

  const button = {
    marginTop: "10px",
    padding: "6px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#001f3f",
    color: "white"
  };

  const addUser = () => setUsers(prev => prev + 1);
  const addOrder = () => setOrders(prev => prev + 1);
  const addRevenue = () => setRevenue(prev => prev + 100);
  const addMessage = () => setMessages(prev => prev + 1);

  const logout = () => {
    navigate("/");
  };

  return (
    <div style={container}>
      
      {/* Sidebar */}
      <div style={sidebar}>
        <h2>ILES</h2>
        <p>Dashboard</p>
        <p>Users</p>
        <p>Reports</p>
        <p>Settings</p>

        <button style={button} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={main}>
        <h2>Welcome Back 👋</h2>

        <div style={cardContainer}>
          
          {/* Users */}
          <div style={card}>
            <h3>Users</h3>
            <p>{users}</p>
            <button style={button} onClick={addUser}>+ Add User</button>
          </div>

          {/* Orders */}
          <div style={card}>
            <h3>Orders</h3>
            <p>{orders}</p>
            <button style={button} onClick={addOrder}>+ Add Order</button>
          </div>

          {/* Revenue */}
          <div style={card}>
            <h3>Revenue</h3>
            <p>${revenue}</p>
            <button style={button} onClick={addRevenue}>+ Add Revenue</button>
          </div>

          {/* Messages */}
          <div style={card}>
            <h3>Messages</h3>
            <p>{messages}</p>
            <button style={button} onClick={addMessage}>+ Add Message</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;