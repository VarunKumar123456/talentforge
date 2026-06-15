import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaComments,
  FaPlusCircle,
  FaSearch,
  FaSignOutAlt,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_companies: 0,
    total_jobs: 0,
    total_applications: 0,
    shortlisted: 0,
    accepted: 0,
    rejected: 0,
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAnalytics();
    fetchUnreadCount();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const companyRes = await api.get("/companies/count");
      const jobRes = await api.get("/jobs/count");
      const appRes = await api.get("/applications/analytics");

      setStats({
        total_companies: companyRes.data.total_companies,
        total_jobs: jobRes.data.total_jobs,
        total_applications: appRes.data.total_applications,
        shortlisted: appRes.data.shortlisted,
        accepted: appRes.data.accepted,
        rejected: appRes.data.rejected,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/messages/unread-count");
      setUnreadCount(res.data.unread_count);
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

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>
          <FaBriefcase /> TalentForge
        </h1>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div style={{ padding: "40px" }}>
        <div
          style={{
            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "white",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(37,99,235,0.25)",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>👋 Welcome Back Recruiter</h2>
          <p style={{ opacity: 0.95, fontSize: "16px" }}>
            Manage jobs, review candidates, and grow your hiring pipeline.
          </p>
        </div>

        <h2 style={{ marginTop: "20px", marginBottom: "20px", color: "#1e293b" }}>
          🚀 Quick Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <Link to="/create-company" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
              <FaBuilding size={45} color="#2563eb" />
              <h3 style={{ marginTop: "15px", color: "#2563eb" }}>Add New Company</h3>
              <p style={{ color: "#64748b" }}>Create and manage company profiles.</p>
            </div>
          </Link>

          <Link to="/my-companies" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
              <FaBuilding size={45} color="#10b981" />
              <h3 style={{ marginTop: "15px", color: "#10b981" }}>Manage Companies</h3>
              <p style={{ color: "#64748b" }}>View and update company information.</p>
            </div>
          </Link>

          <Link to="/create-job" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
              <FaPlusCircle size={45} color="#f59e0b" />
              <h3 style={{ marginTop: "15px", color: "#f59e0b" }}>Post New Job</h3>
              <p style={{ color: "#64748b" }}>Publish openings and attract talent.</p>
            </div>
          </Link>

          <Link to="/job-applicants" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
              <FaUsers size={45} color="#7c3aed" />
              <h3 style={{ marginTop: "15px", color: "#7c3aed" }}>Review Applicants</h3>
              <p style={{ color: "#64748b" }}>Shortlist and hire top candidates.</p>
            </div>
          </Link>

          <Link to="/candidate-directory" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
              <FaSearch size={45} color="#0ea5e9" />
              <h3 style={{ marginTop: "15px", color: "#0ea5e9" }}>Candidate Directory</h3>
              <p style={{ color: "#64748b" }}>
                Search candidates by skills and view complete profiles.
              </p>
            </div>
          </Link>

          <Link to="/recruiter-interviews" style={{ textDecoration: "none" }}>
            <div style={{ background: "white", padding: "25px", borderRadius: "18px", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
              <FaCalendarAlt size={45} color="#8b5cf6" />
              <h3 style={{ marginTop: "15px", color: "#8b5cf6" }}>Scheduled Interviews</h3>
              <p style={{ color: "#64748b" }}>View upcoming candidate interviews.</p>
            </div>
          </Link>

          <Link to="/messages" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "18px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#ef4444",
                    color: "white",
                    borderRadius: "999px",
                    padding: "5px 10px",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount}
                </span>
              )}

              <FaComments size={45} color="#0f766e" />

              <h3 style={{ marginTop: "15px", color: "#0f766e" }}>
                Messages
              </h3>

              <p style={{ color: "#64748b" }}>
                Chat with candidates about applications.
              </p>
            </div>
          </Link>
        </div>

        <h2 style={{ marginBottom: "10px", color: "#1e293b" }}>
          📊 Hiring Analytics
        </h2>

        <p style={{ color: "#64748b", marginBottom: "25px" }}>
          Overview of recruitment activity and application performance.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div style={cardStyle}>
            <FaBuilding size={40} color="#2563eb" />
            <h2>{stats.total_companies}</h2>
            <p>Companies</p>
          </div>

          <div style={cardStyle}>
            <FaBriefcase size={40} color="#10b981" />
            <h2>{stats.total_jobs}</h2>
            <p>Jobs Posted</p>
          </div>

          <div style={cardStyle}>
            <FaUsers size={40} color="#7c3aed" />
            <h2>{stats.total_applications}</h2>
            <p>Applicants</p>
          </div>

          <div style={cardStyle}>
            <FaCheckCircle size={40} color="#f59e0b" />
            <h2>{stats.shortlisted}</h2>
            <p>Shortlisted</p>
          </div>

          <div style={cardStyle}>
            <FaCheckCircle size={40} color="#22c55e" />
            <h2>{stats.accepted}</h2>
            <p>Accepted</p>
          </div>

          <div style={cardStyle}>
            <FaTimesCircle size={40} color="#ef4444" />
            <h2>{stats.rejected}</h2>
            <p>Rejected</p>
          </div>
        </div>
      </div>
    </div>
  );
}