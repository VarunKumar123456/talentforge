import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get("/admin/applications");
      setApps(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Applications</h1>

      {apps.length === 0 ? (
        <p>No applications found</p>
      ) : (
        apps.map((app) => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "white",
            }}
          >
            <h3>{app.job_title}</h3>

            <p>
              <b>Candidate:</b> {app.candidate_name}
            </p>

            <p>
              <b>Email:</b> {app.candidate_email}
            </p>

            <p>
              <b>Status:</b> {app.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}