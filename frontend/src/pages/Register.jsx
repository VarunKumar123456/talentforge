import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import api from "../services/api";

export default function Register() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("candidate");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert(
        "Registration Successful"
      );

      window.location.href =
        "/login";
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Registration Failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#2563eb,#7c3aed)",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <FaBriefcase
            size={50}
            color="#2563eb"
          />

          <h1>TalentForge</h1>

          <p>Create your account</p>
        </div>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <option value="candidate">
            Candidate
          </option>

          <option value="recruiter">
            Recruiter
          </option>
        </select>

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Register
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/login")
          }
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #2563eb",
            background: "white",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          Back To Login
        </button>
      </div>
    </div>
  );
}