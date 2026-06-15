import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/admin/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const deleteJob = async (id) => {
    try {
      await api.delete(`/admin/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Jobs</h1>

      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "10px",
            background: "white",
          }}
        >
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <p>
            <b>Recruiter:</b> {job.recruiter_email}
          </p>

          <button
            onClick={() => deleteJob(job.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}