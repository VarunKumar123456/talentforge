import { useEffect, useState } from "react";
import {
    FaBriefcase,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaTrash,
} from "react-icons/fa";

import api from "../services/api";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      console.log("Fetching saved jobs...");
      const res = await api.get("/saved-jobs/my");

      console.log("Saved jobs response:", res.data);

      setJobs(res.data);
    } catch (err) {
      console.log("Saved jobs error:", err.response?.data);
      alert(
        err.response?.data?.detail ||
          "Failed to load saved jobs"
      );
    }
  };

  const removeSavedJob = async (savedId) => {
    try {
      await api.delete(`/saved-jobs/${savedId}`);

      setJobs(
        jobs.filter(
          (job) => job.saved_id !== savedId
        )
      );
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const applyJob = async (jobId) => {
    try {
      await api.post("/applications/", {
        job_id: jobId,
      });

      alert("Application submitted successfully ✔");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Error applying job"
      );
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
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "25px 40px",
        }}
      >
        <h1>
          <FaBriefcase /> Saved Jobs
        </h1>

        <p>Jobs you saved for later.</p>
      </div>

      <div
        style={{
          padding: "30px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {jobs.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "14px",
            }}
          >
            No saved jobs yet.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.saved_id}
              style={{
                background: "white",
                padding: "22px",
                borderRadius: "16px",
                marginBottom: "20px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2 style={{ color: "#2563eb" }}>
                {job.title}
              </h2>

              <p style={{ color: "#475569" }}>
                {job.description}
              </p>

              <p>
                <FaMapMarkerAlt color="#ef4444" />{" "}
                {job.location || "N/A"}
              </p>

              {job.salary && (
                <p>
                  <FaMoneyBillWave color="#10b981" />{" "}
                  ₹{job.salary}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() =>
                    applyJob(job.job_id)
                  }
                  style={blueButton}
                >
                  Apply Now
                </button>

                <button
                  onClick={() =>
                    removeSavedJob(job.saved_id)
                  }
                  style={redButton}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const blueButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const redButton = {
  ...blueButton,
  background: "#ef4444",
};