import { useEffect, useState } from "react";
import {
    FaBriefcase,
    FaEnvelope,
    FaFilePdf,
    FaGithub,
    FaLinkedin,
    FaSearch,
    FaUser,
} from "react-icons/fa";

import api from "../services/api";

export default function CandidateDirectory() {
  const [candidates, setCandidates] = useState([]);
  const [skill, setSkill] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await api.get("/profile/candidates");
      setCandidates(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const searchCandidates = async () => {
    try {
      const res = await api.get(
        `/profile/candidates/search?skill=${skill}`
      );

      setCandidates(res.data);
    } catch (err) {
      console.log(err.response?.data);
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
          padding: "20px 40px",
        }}
      >
        <h1>
          <FaBriefcase /> TalentForge Candidate Directory
        </h1>
        <p>Search candidates by skill and view their profiles.</p>
      </div>

      <div style={{ padding: "30px" }}>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <input
            placeholder="Search skill e.g. React, Python, SQL"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            style={{
              width: "70%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              marginRight: "10px",
            }}
          />

          <button
            onClick={searchCandidates}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <FaSearch /> Search
          </button>

          <button
            onClick={fetchCandidates}
            style={{
              marginLeft: "10px",
              background: "#64748b",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reset
          </button>
        </div>

        {candidates.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
            }}
          >
            No candidates found.
          </div>
        ) : (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                marginBottom: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <h2 style={{ color: "#2563eb" }}>
                <FaUser /> {candidate.name}
              </h2>

              <p>
                <FaEnvelope /> {candidate.email}
              </p>

              <p>
                <b>Skills:</b>{" "}
                {candidate.skills || "Not added"}
              </p>

              <p>
                <b>Education:</b>{" "}
                {candidate.education || "Not added"}
              </p>

              <p>
                <b>Experience:</b>{" "}
                {candidate.experience_details || "Not added"}
              </p>

              <p>
                <b>Bio:</b>{" "}
                {candidate.bio || "Not added"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    style={linkButton("#0a66c2")}
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                )}

                {candidate.github_url && (
                  <a
                    href={candidate.github_url}
                    target="_blank"
                    rel="noreferrer"
                    style={linkButton("#111827")}
                  >
                    <FaGithub /> GitHub
                  </a>
                )}

                {candidate.resume_url && (
                  <a
                    href={`http://127.0.0.1:8000/uploads/${candidate.resume_url}`}
                    target="_blank"
                    rel="noreferrer"
                    style={linkButton("#10b981")}
                  >
                    <FaFilePdf /> Resume
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function linkButton(color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: color,
    color: "white",
    padding: "9px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  };
}