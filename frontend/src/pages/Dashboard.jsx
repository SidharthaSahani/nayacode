import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Dashboard</h1>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
