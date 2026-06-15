import { useState } from "react";
import {
  FaBuilding,
  FaFileAlt,
  FaGlobe,
  FaImage,
} from "react-icons/fa";
import api from "../services/api";

export default function CreateCompany() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
  });

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCompany = async () => {
    try {
      const res = await api.post("/companies/", form);
      const companyId = res.data.id;

      if (logo) {
        const logoData = new FormData();
        logoData.append("file", logo);
        await api.post(`/companies/${companyId}/logo`, logoData);
      }

      if (banner) {
        const bannerData = new FormData();
        bannerData.append("file", banner);
        await api.post(`/companies/${companyId}/banner`, bannerData);
      }

      alert("Company created successfully ✔");

      setForm({
        name: "",
        description: "",
        website: "",
      });
      setLogo(null);
      setBanner(null);
    } catch (err) {
      console.log(err.response?.data);
      alert(
        err.response?.data?.detail ||
          "Failed to create company"
      );
    }
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
          <FaBuilding /> TalentForge
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "50px 20px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            background: "white",
            padding: "35px",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Create Company</h2>

          <label>Company Name</label>
          <div style={inputBox}>
            <FaBuilding color="#2563eb" />
            <input
              name="name"
              placeholder="Enter company name"
              value={form.name}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <label>Company Description</label>
          <div style={textareaBox}>
            <FaFileAlt color="#2563eb" />
            <textarea
              rows="5"
              name="description"
              placeholder="Describe your company..."
              value={form.description}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>

          <label>Company Website</label>
          <div style={inputBox}>
            <FaGlobe color="#2563eb" />
            <input
              name="website"
              placeholder="https://yourcompany.com"
              value={form.website}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <label>Company Logo</label>
          <div style={inputBox}>
            <FaImage color="#2563eb" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              style={inputStyle}
            />
          </div>

          <label>Company Banner</label>
          <div style={inputBox}>
            <FaImage color="#7c3aed" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBanner(e.target.files[0])}
              style={inputStyle}
            />
          </div>

          <button onClick={createCompany} style={buttonStyle}>
            Create Company
          </button>
        </div>
      </div>
    </div>
  );
}

const inputBox = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "20px",
};

const textareaBox = {
  ...inputBox,
  alignItems: "flex-start",
};

const inputStyle = {
  border: "none",
  outline: "none",
  width: "100%",
  marginLeft: "10px",
};

const textareaStyle = {
  ...inputStyle,
  resize: "none",
};

const buttonStyle = {
  width: "100%",
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};