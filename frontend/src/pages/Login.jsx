import { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      const payload = JSON.parse(
        atob(res.data.access_token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);
      localStorage.setItem("email", payload.sub);

      alert(`Login Successful as ${payload.role}`);

      if (payload.role === "admin") {
        window.location.href =
          "/admin-dashboard";
      } else if (
        payload.role === "recruiter"
      ) {
        window.location.href =
          "/dashboard";
      } else {
        window.location.href =
          "/candidate-dashboard";
      }
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Login Failed"
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
          width: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <FaBriefcase
            size={50}
            color="#2563eb"
          />

          <h1
            style={{
              marginTop: "10px",
            }}
          >
            TalentForge
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            Connecting Talent with Opportunity
          </p>
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleLogin}
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
          Login
        </button>

        <button
          onClick={() =>
            (window.location.href =
              "/register")
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
          Create Account
        </button>
      </div>
    </div>
  );
}