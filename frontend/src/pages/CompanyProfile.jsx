import { useEffect, useState } from "react";
import {
    FaBriefcase,
    FaBuilding,
    FaGlobe,
    FaMapMarkerAlt,
    FaMoneyBillWave,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

import api from "../services/api";

export default function CompanyProfile() {
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchCompany();
    fetchCompanyJobs();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await api.get(`/companies/${companyId}`);
      setCompany(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const res = await api.get(`/companies/${companyId}/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    return `http://127.0.0.1:8000/uploads/${url}`;
  };

  if (!company) {
    return <div style={{ padding: "30px" }}>Loading company...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      <div style={{ background: "white" }}>
        {company.banner_url ? (
          <img
            src={getImageUrl(company.banner_url)}
            alt="Company Banner"
            style={{
              width: "100%",
              height: "260px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              height: "260px",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            }}
          />
        )}

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 30px 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "-45px",
            }}
          >
            {company.logo_url ? (
              <img
                src={getImageUrl(company.logo_url)}
                alt="Company Logo"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "5px solid white",
                  background: "white",
                }}
              />
            ) : (
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "5px solid white",
                }}
              >
                <FaBuilding size={55} color="#2563eb" />
              </div>
            )}

            <div>
              <h1 style={{ margin: 0 }}>{company.name}</h1>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  <FaGlobe /> Visit Website
                </a>
              )}
            </div>
          </div>

          <p
            style={{
              color: "#475569",
              lineHeight: "1.7",
              marginTop: "20px",
            }}
          >
            {company.description}
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "30px",
        }}
      >
        <h2>
          <FaBriefcase /> Jobs at {company.name}
        </h2>

        {jobs.length === 0 ? (
          <div style={card}>No jobs posted by this company yet.</div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} style={card}>
              <h2 style={{ color: "#2563eb" }}>{job.title}</h2>
              <p>{job.description}</p>

              <p>
                <FaMapMarkerAlt color="#ef4444" /> {job.location || "N/A"}
              </p>

              {job.salary && (
                <p>
                  <FaMoneyBillWave color="#10b981" /> ₹{job.salary}
                </p>
              )}

              <p>
                <b>Category:</b> {job.category || "N/A"}
              </p>

              <p>
                <b>Type:</b> {job.job_type || "N/A"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "22px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};