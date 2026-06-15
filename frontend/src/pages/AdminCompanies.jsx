import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/admin/companies");
      setCompanies(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const deleteCompany = async (id) => {
    try {
      await api.delete(`/admin/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Companies</h1>

      {companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        companies.map((company) => (
          <div
            key={company.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <h3>{company.name}</h3>

            <p>{company.description}</p>

            <p>
              <b>Website:</b> {company.website || "N/A"}
            </p>

            <p>
              <b>Owner:</b> {company.owner_name}
            </p>

            <p>
              <b>Owner Email:</b> {company.owner_email}
            </p>

            <button
              onClick={() => deleteCompany(company.id)}
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
        ))
      )}
    </div>
  );
}