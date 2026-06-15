import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import api from "../services/api";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchApps();
    fetchInterviews();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get("/applications/my");
      setApps(res.data);
    } catch (err) {
      console.log("❌ ERROR:", err.response?.data);
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await api.get("/interviews/my");
      setInterviews(res.data);
    } catch (err) {
      console.log("INTERVIEW ERROR:", err.response?.data);
    }
  };

  const getInterviewForJob = (jobTitle) => {
    return interviews.find(
      (item) => item.job_title === jobTitle
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "hired":
      case "accepted":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "interview":
        return "#8b5cf6";
      case "shortlisted":
        return "#f59e0b";
      default:
        return "#2563eb";
    }
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
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "20px 40px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
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
          My Applications
        </h1>
      </div>

      <div style={{ padding: "30px" }}>
        {apps.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3>No applications yet</h3>
            <p>Start applying for jobs from the Jobs page.</p>
          </div>
        ) : (
          apps.map((app) => {
            const interview = getInterviewForJob(app.job_title);

            return (
              <div
                key={app.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    color: "#2563eb",
                    marginBottom: "10px",
                  }}
                >
                  {app.job_title || "Job Title Not Available"}
                </h2>

                <p style={{ color: "#475569", marginBottom: "8px" }}>
                  <FaMapMarkerAlt />{" "}
                  {app.job_location || "Location Not Specified"}
                </p>

                <p style={{ marginBottom: "8px" }}>
                  <FaCheckCircle /> Status:{" "}
                  <span
                    style={{
                      background: getStatusColor(app.status),
                      color: "white",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {app.status}
                  </span>
                </p>

                <p style={{ color: "#64748b" }}>
                  <FaClock /> Applied on{" "}
                  {app.applied_at
                    ? new Date(app.applied_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      })
                    : "N/A"}
                </p>

                {interview && (
                  <div
                    style={{
                      marginTop: "20px",
                      background: "#f8fafc",
                      border: "1px solid #ddd6fe",
                      padding: "18px",
                      borderRadius: "12px",
                    }}
                  >
                    <h3 style={{ color: "#7c3aed" }}>
                      <FaCalendarAlt /> Interview Scheduled
                    </h3>

                    <p>
                      <b>Date:</b> {interview.interview_date}
                    </p>

                    <p>
                      <b>Time:</b> {interview.interview_time}
                    </p>

                    <p>
                      <b>Notes:</b> {interview.notes || "No notes"}
                    </p>

                    {interview.meeting_link && (
                      <a
                        href={interview.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "#7c3aed",
                          color: "white",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontWeight: "bold",
                        }}
                      >
                        <FaExternalLinkAlt />
                        Join Meeting
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}