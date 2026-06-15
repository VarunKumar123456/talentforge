import { useEffect, useState } from "react";
import {
  FaBell,
  FaBriefcase,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaHeart,
  FaSearch,
  FaSignOutAlt,
  FaUpload,
  FaUserCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import api from "../services/api";

export default function CandidateDashboard() {
  const [unreadCount, setUnreadCount] =
    useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(
        "/messages/unread-count"
      );

      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const card = {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
    position: "relative",
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
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaBriefcase />
          TalentForge
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
            fontWeight: "bold",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div style={{ padding: "40px" }}>
        <h2
          style={{
            color: "#1e293b",
            marginBottom: "10px",
          }}
        >
          Candidate Dashboard
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Discover jobs, apply instantly, and track your applications.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <Link
            to="/jobs"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaSearch
                size={42}
                color="#2563eb"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                View Jobs
              </h3>
              <p style={{ color: "#64748b" }}>
                Browse all available opportunities
                and apply with one click.
              </p>
            </div>
          </Link>

          <Link
            to="/my-applications"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaFileAlt
                size={42}
                color="#10b981"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                My Applications
              </h3>
              <p style={{ color: "#64748b" }}>
                Track jobs you've applied for and
                monitor application status.
              </p>
            </div>
          </Link>

          <Link
            to="/messages"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
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

              <FaComments
                size={42}
                color="#0f766e"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                Messages
              </h3>
              <p style={{ color: "#64748b" }}>
                Chat with recruiters about your
                applications.
              </p>
            </div>
          </Link>

          <Link
            to="/interviews"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaCalendarAlt
                size={42}
                color="#8b5cf6"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                My Interviews
              </h3>
              <p style={{ color: "#64748b" }}>
                View scheduled interviews and meeting links.
              </p>
            </div>
          </Link>

          <Link
            to="/upload-resume"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaUpload
                size={42}
                color="#f59e0b"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                Upload Resume
              </h3>
              <p style={{ color: "#64748b" }}>
                Upload your latest resume for recruiters.
              </p>
            </div>
          </Link>

          <Link
            to="/profile"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaUserCircle
                size={42}
                color="#7c3aed"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                My Profile
              </h3>
              <p style={{ color: "#64748b" }}>
                Manage skills, education,
                experience and social links.
              </p>
            </div>
          </Link>

          <Link
            to="/saved-jobs"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaHeart
                size={42}
                color="#ef4444"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                Saved Jobs
              </h3>
              <p style={{ color: "#64748b" }}>
                View jobs you saved and apply later.
              </p>
            </div>
          </Link>

          <Link
            to="/notifications"
            style={{ textDecoration: "none" }}
          >
            <div style={card}>
              <FaBell
                size={42}
                color="#f59e0b"
              />
              <h3
                style={{
                  color: "#1e293b",
                  marginTop: "15px",
                }}
              >
                Notifications
              </h3>
              <p style={{ color: "#64748b" }}>
                View updates about your job applications.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}