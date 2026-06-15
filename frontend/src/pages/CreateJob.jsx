import { useEffect, useState } from "react";
import {
    FaBriefcase,
    FaBuilding,
    FaMapMarkerAlt,
    FaMoneyBillWave,
} from "react-icons/fa";

import api from "../services/api";

export default function CreateJob() {
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    experience: "",
    company_id: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/companies/my");

      setCompanies(res.data);

      if (res.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          company_id: res.data[0].id,
        }));
      }
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createJob = async () => {
    try {
      const payload = {
        ...form,
        salary: Number(form.salary),
        experience: Number(form.experience),
        company_id: Number(form.company_id),
      };

      const res = await api.post(
        "/jobs/",
        payload
      );

      console.log(res.data);

      alert("✅ Job Created Successfully");

      setForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        experience: "",
        company_id:
          companies.length > 0
            ? companies[0].id
            : "",
      });
    } catch (err) {
      console.log(err.response?.data);

      alert(
        err.response?.data?.detail ||
          "Error creating job"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#7c3aed)",
          color: "white",
          padding: "25px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            margin: 0,
          }}
        >
          TalentForge
        </h1>

        <p
          style={{
            marginTop: "8px",
          }}
        >
          Create New Job Posting
        </p>
      </div>

      {/* FORM */}

      <div
        style={{
          maxWidth: "800px",
          margin: "30px auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            color: "#2563eb",
          }}
        >
          <FaBriefcase /> Post New Job
        </h2>

        {/* TITLE */}

        <label>
          Job Title
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Backend Developer"
          style={inputStyle}
        />

        {/* DESCRIPTION */}

        <label>
          Job Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          placeholder="Enter complete job description..."
          style={textareaStyle}
        />

        {/* LOCATION */}

        <label>
          <FaMapMarkerAlt /> Location
        </label>

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Hyderabad"
          style={inputStyle}
        />

        {/* SALARY */}

        <label>
          <FaMoneyBillWave /> Salary
        </label>

        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="600000"
          style={inputStyle}
        />

        {/* EXPERIENCE */}

        <label>
          Experience (Years)
        </label>

        <input
          type="number"
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="2"
          style={inputStyle}
        />

        {/* COMPANY */}

        <label>
          <FaBuilding /> Company
        </label>

        <select
          name="company_id"
          value={form.company_id}
          onChange={handleChange}
          style={inputStyle}
        >
          {companies.map((company) => (
            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>
          ))}
        </select>

        <button
          onClick={createJob}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Create Job
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "15px",
  resize: "vertical",
  boxSizing: "border-box",
};