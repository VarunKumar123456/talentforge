import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaFileAlt,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_companies: 0,
    total_jobs: 0,
    total_applications: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
  };

  const actionStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textDecoration: "none",
    color: "#1e293b",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#111827,#2563eb)",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>TalentForge Admin Panel</h1>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div style={{ padding: "40px" }}>
        <h2>Platform Overview</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={cardStyle}>
            <FaUsers size={40} color="#2563eb" />
            <h2>{stats.total_users}</h2>
            <p>Total Users</p>
          </div>

          <div style={cardStyle}>
            <FaBuilding size={40} color="#10b981" />
            <h2>{stats.total_companies}</h2>
            <p>Companies</p>
          </div>

          <div style={cardStyle}>
            <FaBriefcase size={40} color="#f59e0b" />
            <h2>{stats.total_jobs}</h2>
            <p>Jobs</p>
          </div>

          <div style={cardStyle}>
            <FaFileAlt size={40} color="#8b5cf6" />
            <h2>{stats.total_applications}</h2>
            <p>Applications</p>
          </div>
        </div>

        <h2 style={{ marginTop: "40px" }}>Admin Actions</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <Link to="/admin-users" style={actionStyle}>
            <FaUsers size={35} color="#2563eb" />
            <h3>Manage Users</h3>
            <p>View and remove platform users.</p>
          </Link>

          <Link to="/admin-companies" style={actionStyle}>
            <FaBuilding size={35} color="#10b981" />
            <h3>Manage Companies</h3>
            <p>Review recruiter companies.</p>
          </Link>

          <Link to="/admin-jobs" style={actionStyle}>
            <FaBriefcase size={35} color="#f59e0b" />
            <h3>Manage Jobs</h3>
            <p>Monitor all posted jobs.</p>
          </Link>

          <Link to="/admin-applications" style={actionStyle}>
            <FaFileAlt size={35} color="#8b5cf6" />
            <h3>Applications</h3>
            <p>View candidate applications.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}