import { useEffect, useState } from "react";
import {
    FaBriefcase,
    FaCalendarAlt,
    FaClock,
    FaExternalLinkAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";

import api from "../services/api";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/interviews/my");
      setInterviews(res.data);
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
        <h1>
          <FaCalendarAlt /> My Interviews
        </h1>
        <p>Track upcoming interview schedules.</p>
      </div>

      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
        {interviews.length === 0 ? (
          <div style={cardStyle}>No interviews scheduled yet.</div>
        ) : (
          interviews.map((item) => (
            <div key={item.id} style={cardStyle}>
              <h2 style={{ color: "#2563eb" }}>
                <FaBriefcase /> {item.job_title}
              </h2>

              <p>
                <FaMapMarkerAlt color="#ef4444" />{" "}
                {item.job_location || "N/A"}
              </p>

              <p>
                <FaCalendarAlt color="#8b5cf6" />{" "}
                <b>Date:</b> {item.interview_date}
              </p>

              <p>
                <FaClock color="#10b981" />{" "}
                <b>Time:</b> {item.interview_time}
              </p>

              <p>
                <b>Notes:</b> {item.notes || "No notes"}
              </p>

              {item.meeting_link ? (
                <a
                  href={item.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  style={buttonStyle}
                >
                  <FaExternalLinkAlt /> Join Meeting
                </a>
              ) : (
                <p style={{ color: "#64748b" }}>
                  Meeting link will be shared later.
                </p>
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
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "#7c3aed",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
};