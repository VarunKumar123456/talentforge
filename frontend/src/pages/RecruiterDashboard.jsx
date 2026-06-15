import { useEffect, useState } from "react";
import api from "../services/api";

export default function RecruiterDashboard() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    loadCompanies();
    loadJobs();
  }, []);

  // ================= COMPANIES =================
  const loadCompanies = async () => {
    try {
      const res = await api.get("/companies/my");
      setCompanies(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ================= JOBS (RECRUITER ONLY) =================
  const loadJobs = async () => {
    try {
      const res = await api.get("/jobs/my"); // ✅ correct
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ================= VIEW APPLICANTS =================
  const viewApplicants = async (jobId) => {
    try {
      setSelectedJob(jobId);
      setApplicants([]); // 🔥 IMPORTANT: clear old data

      const res = await api.get(`/applications/job/${jobId}`);

      // 🔥 FIX: ensure array always
      setApplicants(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.log(err.response?.data);
      setApplicants([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recruiter Dashboard</h2>

      {/* ================= COMPANIES ================= */}
      <h3>My Companies</h3>

      {companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        companies.map((c) => (
          <div
            key={c.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{c.name}</h4>
            <p>{c.description}</p>

            {c.website && (
              <a href={c.website} target="_blank" rel="noreferrer">
                {c.website}
              </a>
            )}
          </div>
        ))
      )}

      <hr />

      {/* ================= JOBS ================= */}
      <h3>My Jobs</h3>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((j) => (
          <div
            key={j.id}
            style={{
              border: "1px solid blue",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{j.title}</h4>
            <p>{j.description}</p>
            <p>📍 {j.location}</p>

            <button
              onClick={() => viewApplicants(j.id)}
              style={{
                background: "blue",
                color: "white",
                padding: "5px 10px",
              }}
            >
              View Applicants
            </button>
          </div>
        ))
      )}

      <hr />

      {/* ================= APPLICANTS ================= */}
      <h3>Applicants</h3>

      {!selectedJob ? (
        <p>Select a job to view applicants</p>
      ) : applicants.length === 0 ? (
        <p>No applicants yet</p>
      ) : (
        applicants.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid green",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p><b>Name:</b> {a.candidate_name}</p>
            <p><b>Email:</b> {a.candidate_email}</p>
            <p><b>Status:</b> {a.status}</p>

            <p>
              <b>Applied:</b>{" "}
              {a.applied_at
                ? new Date(a.applied_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}