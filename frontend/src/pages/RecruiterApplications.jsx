import { useEffect, useState } from "react";
import {
  FaBrain,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaEnvelope,
  FaExternalLinkAlt,
  FaFilePdf,
  FaGithub,
  FaGraduationCap,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTimesCircle,
  FaTools,
  FaUser,
  FaUsers,
} from "react-icons/fa";

import api from "../services/api";

export default function RecruiterApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [matchResults, setMatchResults] = useState({});
  const [loadingMatchId, setLoadingMatchId] = useState(null);

  const [messageBox, setMessageBox] = useState({
    application_id: null,
    message: "",
  });

  const [interviewForm, setInterviewForm] = useState({
    application_id: null,
    interview_date: "",
    interview_time: "",
    meeting_link: "",
    notes: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/my");
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const viewApplicants = async (job) => {
    try {
      const res = await api.get(`/applications/job/${job.id}`);
      setApplications(res.data);
      setSelectedJob(job);
      setMatchResults({});
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to update status");
    }
  };

  const sendMessage = async () => {
    if (!messageBox.application_id || !messageBox.message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      await api.post("/messages/", {
        application_id: messageBox.application_id,
        message: messageBox.message,
      });

      alert("Message sent successfully");

      setMessageBox({
        application_id: null,
        message: "",
      });
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Failed to send message");
    }
  };

  const scheduleInterview = async () => {
    if (
      !interviewForm.application_id ||
      !interviewForm.interview_date ||
      !interviewForm.interview_time
    ) {
      alert("Please select date and time");
      return;
    }

    try {
      await api.post("/interviews/", interviewForm);

      setApplications((prev) =>
        prev.map((app) =>
          app.id === interviewForm.application_id
            ? { ...app, status: "interview" }
            : app
        )
      );

      alert("Interview scheduled successfully");

      setInterviewForm({
        application_id: null,
        interview_date: "",
        interview_time: "",
        meeting_link: "",
        notes: "",
      });
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Failed to schedule interview");
    }
  };

  const fetchAIMatch = async (applicationId) => {
    try {
      setLoadingMatchId(applicationId);

      const res = await api.get(`/ai-match/application/${applicationId}`);

      setMatchResults((prev) => ({
        ...prev,
        [applicationId]: res.data,
      }));
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.detail || "Failed to calculate AI match");
    } finally {
      setLoadingMatchId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "hired":
        return "#2563eb";
      case "shortlisted":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "interview":
        return "#8b5cf6";
      default:
        return "#f59e0b";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const getResumeUrl = (resumeUrl) => {
    if (!resumeUrl) return "";
    if (resumeUrl.startsWith("http")) return resumeUrl;
    if (resumeUrl.startsWith("uploads/")) {
      return `http://127.0.0.1:8000/${resumeUrl}`;
    }
    return `http://127.0.0.1:8000/uploads/${resumeUrl}`;
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    width: "100%",
    marginBottom: "10px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "20px 40px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          <FaUsers />
          TalentForge Applications
        </h1>
      </div>

      <div style={{ padding: "30px" }}>
        <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>My Posted Jobs</h2>

        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} style={cardStyle}>
              <h3 style={{ margin: "0 0 10px", color: "#2563eb" }}>
                <FaBriefcase /> {job.title}
              </h3>

              <p style={{ color: "#64748b" }}>
                <FaMapMarkerAlt /> {job.location}
              </p>

              <button onClick={() => viewApplicants(job)} style={buttonStyle("#2563eb")}>
                View Applicants
              </button>
            </div>
          ))
        )}

        {selectedJob && (
          <>
            <h2 style={{ marginTop: "40px", color: "#1e293b" }}>
              Applicants for: {selectedJob.title}
            </h2>

            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              Total Applicants: {applications.length}
            </p>

            {applications.length === 0 ? (
              <div style={cardStyle}>No applicants yet.</div>
            ) : (
              applications.map((app) => {
                const match = matchResults[app.id];

                return (
                  <div key={app.id} style={cardStyle}>
                    <h3 style={{ marginBottom: "15px", color: "#2563eb" }}>
                      <FaUser /> {app.candidate_name}
                    </h3>

                    <p>
                      <FaEnvelope /> {app.candidate_email}
                    </p>

                    <p>
                      Status:
                      <span
                        style={{
                          marginLeft: "10px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          background: getStatusColor(app.status),
                          color: "white",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {app.status}
                      </span>
                    </p>

                    <p>
                      <FaClock /> Applied:{" "}
                      {new Date(app.applied_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>

                    <section style={sectionStyle}>
                      <h4>Candidate Profile</h4>

                      {app.skills ? (
                        <p>
                          <FaTools /> <b>Skills:</b> {app.skills}
                        </p>
                      ) : (
                        <p style={{ color: "#94a3b8" }}>Skills not added</p>
                      )}

                      {app.education && (
                        <p>
                          <FaGraduationCap /> <b>Education:</b> {app.education}
                        </p>
                      )}

                      {(app.experience_details || app.experience) && (
                        <p>
                          <b>Experience:</b>{" "}
                          {app.experience_details || app.experience}
                        </p>
                      )}

                      {app.bio && (
                        <p>
                          <b>Bio:</b> {app.bio}
                        </p>
                      )}

                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {(app.linkedin_url || app.linkedin) && (
                          <a
                            href={app.linkedin_url || app.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            style={linkButton("#0a66c2")}
                          >
                            <FaLinkedin /> LinkedIn
                          </a>
                        )}

                        {(app.github_url || app.github) && (
                          <a
                            href={app.github_url || app.github}
                            target="_blank"
                            rel="noreferrer"
                            style={linkButton("#111827")}
                          >
                            <FaGithub /> GitHub
                          </a>
                        )}

                        {app.portfolio_url && (
                          <a
                            href={app.portfolio_url}
                            target="_blank"
                            rel="noreferrer"
                            style={linkButton("#7c3aed")}
                          >
                            <FaExternalLinkAlt /> Portfolio
                          </a>
                        )}
                      </div>
                    </section>

                    <section style={sectionStyle}>
                      <h4>
                        <FaBrain /> AI Resume Match
                      </h4>

                      {!match ? (
                        <button
                          onClick={() => fetchAIMatch(app.id)}
                          disabled={loadingMatchId === app.id}
                          style={buttonStyle("#111827")}
                        >
                          {loadingMatchId === app.id
                            ? "Analyzing..."
                            : "Calculate Match Score"}
                        </button>
                      ) : (
                        <div>
                          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <div
                              style={{
                                width: "90px",
                                height: "90px",
                                borderRadius: "50%",
                                background: getScoreColor(match.score),
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              {match.score}%
                            </div>

                            <div>
                              <h3 style={{ color: getScoreColor(match.score), margin: 0 }}>
                                {match.recommendation}
                              </h3>
                              <p style={{ color: "#64748b" }}>
                                Resume Found: <b>{match.resume_found ? "Yes" : "No"}</b>
                              </p>
                            </div>
                          </div>

                          <p>
                            <b>Job Skills:</b>{" "}
                            {match.job_skills?.length
                              ? match.job_skills.join(", ")
                              : "No clear skill keywords found"}
                          </p>

                          <p style={{ color: "#10b981" }}>
                            <FaCheckCircle /> <b>Matched:</b>{" "}
                            {match.matched_skills?.length
                              ? match.matched_skills.join(", ")
                              : "None"}
                          </p>

                          <p style={{ color: "#ef4444" }}>
                            <FaTimesCircle /> <b>Missing:</b>{" "}
                            {match.missing_skills?.length
                              ? match.missing_skills.join(", ")
                              : "None"}
                          </p>
                        </div>
                      )}
                    </section>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
                      <button onClick={() => updateStatus(app.id, "shortlisted")} style={buttonStyle("#10b981")}>
                        Shortlist
                      </button>

                      <button onClick={() => updateStatus(app.id, "rejected")} style={buttonStyle("#ef4444")}>
                        Reject
                      </button>

                      <button onClick={() => updateStatus(app.id, "accepted")} style={buttonStyle("#2563eb")}>
                        Hire
                      </button>

                      <button
                        onClick={() =>
                          setInterviewForm({
                            application_id: app.id,
                            interview_date: "",
                            interview_time: "",
                            meeting_link: "",
                            notes: "",
                          })
                        }
                        style={buttonStyle("#8b5cf6")}
                      >
                        <FaCalendarAlt /> Schedule Interview
                      </button>

                      <button
                        onClick={() =>
                          setMessageBox({
                            application_id: app.id,
                            message: "",
                          })
                        }
                        style={buttonStyle("#0f766e")}
                      >
                        <FaCommentDots /> Message
                      </button>
                    </div>

                    {messageBox.application_id === app.id && (
                      <section style={sectionStyle}>
                        <h4>
                          <FaCommentDots /> Send Message
                        </h4>

                        <textarea
                          placeholder="Write message to candidate..."
                          value={messageBox.message}
                          onChange={(e) =>
                            setMessageBox({
                              ...messageBox,
                              message: e.target.value,
                            })
                          }
                          style={{ ...inputStyle, minHeight: "90px" }}
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button onClick={sendMessage} style={buttonStyle("#0f766e")}>
                            Send Message
                          </button>

                          <button
                            onClick={() =>
                              setMessageBox({
                                application_id: null,
                                message: "",
                              })
                            }
                            style={buttonStyle("#64748b")}
                          >
                            Cancel
                          </button>
                        </div>
                      </section>
                    )}

                    {interviewForm.application_id === app.id && (
                      <section style={sectionStyle}>
                        <h4>Schedule Interview</h4>

                        <input
                          type="date"
                          value={interviewForm.interview_date}
                          onChange={(e) =>
                            setInterviewForm({
                              ...interviewForm,
                              interview_date: e.target.value,
                            })
                          }
                          style={inputStyle}
                        />

                        <input
                          type="time"
                          value={interviewForm.interview_time}
                          onChange={(e) =>
                            setInterviewForm({
                              ...interviewForm,
                              interview_time: e.target.value,
                            })
                          }
                          style={inputStyle}
                        />

                        <input
                          placeholder="Meeting Link"
                          value={interviewForm.meeting_link}
                          onChange={(e) =>
                            setInterviewForm({
                              ...interviewForm,
                              meeting_link: e.target.value,
                            })
                          }
                          style={inputStyle}
                        />

                        <textarea
                          placeholder="Notes"
                          value={interviewForm.notes}
                          onChange={(e) =>
                            setInterviewForm({
                              ...interviewForm,
                              notes: e.target.value,
                            })
                          }
                          style={{ ...inputStyle, minHeight: "80px" }}
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button onClick={scheduleInterview} style={buttonStyle("#8b5cf6")}>
                            Confirm Interview
                          </button>

                          <button
                            onClick={() =>
                              setInterviewForm({
                                application_id: null,
                                interview_date: "",
                                interview_time: "",
                                meeting_link: "",
                                notes: "",
                              })
                            }
                            style={buttonStyle("#64748b")}
                          >
                            Cancel
                          </button>
                        </div>
                      </section>
                    )}

                    <div style={{ marginTop: "20px" }}>
                      {app.resume_url ? (
                        <a
                          href={getResumeUrl(app.resume_url)}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            background: "#10b981",
                            color: "white",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            fontWeight: "bold",
                          }}
                        >
                          <FaFilePdf />
                          Download Resume
                        </a>
                      ) : (
                        <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                          ⚠️ Resume Not Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  borderRadius: "15px",
  padding: "20px",
  marginBottom: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const sectionStyle = {
  marginTop: "20px",
  background: "#f8fafc",
  padding: "18px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

function buttonStyle(color) {
  return {
    background: color,
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  };
}

function linkButton(color) {
  return {
    background: color,
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  };
}