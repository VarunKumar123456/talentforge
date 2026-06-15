import { useEffect, useState } from "react";
import {
    FaGithub,
    FaGlobe,
    FaLinkedin,
    FaSave,
    FaUser,
} from "react-icons/fa";

import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    bio: "",
    skills: "",
    education: "",
    experience_details: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/profile/me");

      setProfile({
        bio: res.data.bio || "",
        skills: res.data.skills || "",
        education: res.data.education || "",
        experience_details:
          res.data.experience_details || "",
        linkedin_url:
          res.data.linkedin_url || "",
        github_url:
          res.data.github_url || "",
        portfolio_url:
          res.data.portfolio_url || "",
      });
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const saveProfile = async () => {
    try {
      await api.put("/profile/me", profile);

      alert("Profile Updated Successfully ✔");
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to update profile");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
      }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "25px 40px",
        }}
      >
        <h1
          style={{
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUser />
          My Profile
        </h1>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "30px auto",
          background: "white",
          borderRadius: "18px",
          padding: "30px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            color: "#2563eb",
          }}
        >
          Professional Profile
        </h2>

        {/* Bio */}
        <label>
          <strong>Bio</strong>
        </label>

        <textarea
          rows={4}
          value={profile.bio}
          onChange={(e) =>
            setProfile({
              ...profile,
              bio: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        {/* Skills */}
        <label>
          <strong>Skills</strong>
        </label>

        <input
          value={profile.skills}
          onChange={(e) =>
            setProfile({
              ...profile,
              skills: e.target.value,
            })
          }
          placeholder="Python, React, FastAPI..."
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        {/* Education */}
        <label>
          <strong>Education</strong>
        </label>

        <input
          value={profile.education}
          onChange={(e) =>
            setProfile({
              ...profile,
              education: e.target.value,
            })
          }
          placeholder="B.Tech CSE"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        {/* Experience */}
        <label>
          <strong>Experience</strong>
        </label>

        <textarea
          rows={4}
          value={profile.experience_details}
          onChange={(e) =>
            setProfile({
              ...profile,
              experience_details:
                e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        {/* LinkedIn */}
        <label>
          <strong>
            <FaLinkedin /> LinkedIn URL
          </strong>
        </label>

        <input
          value={profile.linkedin_url}
          onChange={(e) =>
            setProfile({
              ...profile,
              linkedin_url: e.target.value,
            })
          }
          placeholder="https://linkedin.com/in/..."
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        {/* GitHub */}
        <label>
          <strong>
            <FaGithub /> GitHub URL
          </strong>
        </label>

        <input
          value={profile.github_url}
          onChange={(e) =>
            setProfile({
              ...profile,
              github_url: e.target.value,
            })
          }
          placeholder="https://github.com/..."
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
          }}
        />

        {/* Portfolio */}
        <label>
          <strong>
            <FaGlobe /> Portfolio URL
          </strong>
        </label>

        <input
          value={profile.portfolio_url}
          onChange={(e) =>
            setProfile({
              ...profile,
              portfolio_url: e.target.value,
            })
          }
          placeholder="https://portfolio.com"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "25px",
          }}
        />

        <button
          onClick={saveProfile}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <FaSave /> Save Profile
        </button>
      </div>
    </div>
  );
}