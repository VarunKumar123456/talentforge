import { useEffect, useState } from "react";
import {
  FaBuilding,
  FaGlobe,
  FaImage,
  FaInfoCircle,
} from "react-icons/fa";

import api from "../services/api";

export default function MyCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies/my");
      setCompanies(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const uploadLogo = async (companyId, file) => {
    const data = new FormData();
    data.append("file", file);
    await api.post(`/companies/${companyId}/logo`, data);
    fetchCompanies();
  };

  const uploadBanner = async (companyId, file) => {
    const data = new FormData();
    data.append("file", file);
    await api.post(`/companies/${companyId}/banner`, data);
    fetchCompanies();
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    return `http://127.0.0.1:8000/uploads/${url}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "20px 40px",
        }}
      >
        <h1>
          <FaBuilding /> TalentForge - My Companies
        </h1>
      </div>

      <div style={{ padding: "30px" }}>
        {companies.length === 0 ? (
          <div style={emptyCard}>
            <h3>No Companies Found</h3>
            <p>Create your first company to start posting jobs.</p>
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.id} style={card}>
              {company.banner_url && (
                <img
                  src={getImageUrl(company.banner_url)}
                  alt="Company Banner"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "14px",
                    marginBottom: "20px",
                  }}
                />
              )}

              <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                {company.logo_url ? (
                  <img
                    src={getImageUrl(company.logo_url)}
                    alt="Company Logo"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "3px solid #2563eb",
                    }}
                  />
                ) : (
                  <FaBuilding size={55} color="#2563eb" />
                )}

                <h2 style={{ color: "#2563eb" }}>{company.name}</h2>
              </div>

              <p style={{ color: "#475569", lineHeight: "1.6" }}>
                <FaInfoCircle /> {company.description}
              </p>

              {company.website && (
                <p>
                  <FaGlobe color="#10b981" />{" "}
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
                    Visit Website
                  </a>
                </p>
              )}

              <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
                <label style={uploadButton}>
                  <FaImage /> Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => uploadLogo(company.id, e.target.files[0])}
                  />
                </label>

                <label style={{ ...uploadButton, background: "#7c3aed" }}>
                  <FaImage /> Upload Banner
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => uploadBanner(company.id, e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const emptyCard = {
  ...card,
  textAlign: "center",
};

const uploadButton = {
  background: "#2563eb",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};