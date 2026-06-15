import { useEffect, useState } from "react";
import {
    FaBell,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";

import api from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/my");
      setNotifications(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "25px 40px",
        }}
      >
        <h1><FaBell /> Notifications</h1>
        <p>Stay updated on your job application status.</p>
      </div>

      <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
        {notifications.length === 0 ? (
          <div style={cardStyle}>
            No notifications yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                ...cardStyle,
                borderLeft: n.is_read
                  ? "5px solid #94a3b8"
                  : "5px solid #2563eb",
              }}
            >
              <h3 style={{ color: "#1e293b" }}>
                <FaBell color={n.is_read ? "#94a3b8" : "#2563eb"} />{" "}
                {n.message}
              </h3>

              <p style={{ color: "#64748b" }}>
                <FaClock />{" "}
                {new Date(n.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </p>

              {!n.is_read && (
                <button
                  onClick={() => markRead(n.id)}
                  style={buttonStyle}
                >
                  <FaCheckCircle /> Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "22px",
  borderRadius: "15px",
  marginBottom: "18px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};