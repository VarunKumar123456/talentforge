import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaHeart,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import api from "../services/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/");
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/saved-jobs/my");
      setSavedJobIds(res.data.map((job) => job.job_id));
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const searchJobs = async () => {
    try {
      const res = await api.get(
        `/jobs/search?keyword=${keyword}&location=${location}&category=${category}`
      );
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const applyJob = async (jobId) => {
    try {
      await api.post("/applications/", {
        job_id: jobId,
      });

      setAppliedJobs([...appliedJobs, jobId]);
      alert("Application submitted successfully ✔");
    } catch (err) {
      if (err.response?.data?.detail === "Already applied") {
        setAppliedJobs([...appliedJobs, jobId]);
      }

      alert(err.response?.data?.detail || "Error applying job");
    }
  };

  const saveJob = async (jobId) => {
    try {
      await api.post(`/saved-jobs/${jobId}`);
      setSavedJobIds([...savedJobIds, jobId]);
      alert("Job saved successfully ❤️");
    } catch (err) {
      alert(err.response?.data?.detail || "Error saving job");
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
          <FaBriefcase /> TalentForge Jobs
        </h1>
        <p>Discover opportunities and apply instantly.</p>
      </div>

      <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={searchCard}>
          <input
            placeholder="Job Title"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">All Categories</option>
            <option value="Software">Software</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Design">Design</option>
          </select>

          <button onClick={searchJobs} style={blueButton}>
            Search
          </button>

          <button onClick={fetchJobs} style={grayButton}>
            Reset
          </button>
        </div>

        {jobs.length === 0 ? (
          <div style={emptyCard}>No jobs available</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} style={jobCard}>
              <h2 style={{ color: "#2563eb" }}>{job.title}</h2>

              <p style={{ color: "#475569" }}>{job.description}</p>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                <p>
                  <FaMapMarkerAlt color="#ef4444" /> {job.location || "N/A"}
                </p>

                {job.salary && (
                  <p>
                    <FaMoneyBillWave color="#10b981" /> ₹{job.salary}
                  </p>
                )}

                {job.category && (
                  <p>
                    <b>Category:</b> {job.category}
                  </p>
                )}

                {job.job_type && (
                  <p>
                    <b>Type:</b> {job.job_type}
                  </p>
                )}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {appliedJobs.includes(job.id) ? (
                  <button disabled style={greenButton}>
                    <FaCheckCircle /> Applied
                  </button>
                ) : (
                  <button onClick={() => applyJob(job.id)} style={blueButton}>
                    Apply Now
                  </button>
                )}

                {savedJobIds.includes(job.id) ? (
                  <button disabled style={redButton}>
                    <FaHeart /> Saved
                  </button>
                ) : (
                  <button onClick={() => saveJob(job.id)} style={outlineRedButton}>
                    <FaHeart /> Save Job
                  </button>
                )}

                <Link
                  to={`/companies/${job.company_id}`}
                  style={{
                    ...blueButton,
                    background: "#7c3aed",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaBuilding /> View Company
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const searchCard = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const inputStyle = {
  padding: "10px",
  marginRight: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const jobCard = {
  background: "white",
  borderRadius: "16px",
  padding: "22px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const emptyCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const blueButton = {
  padding: "10px 20px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const grayButton = {
  ...blueButton,
  background: "#64748b",
  marginLeft: "10px",
};

const greenButton = {
  ...blueButton,
  background: "#10b981",
};

const redButton = {
  ...blueButton,
  background: "#ef4444",
};

const outlineRedButton = {
  padding: "10px 20px",
  background: "white",
  color: "#ef4444",
  border: "1px solid #ef4444",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};