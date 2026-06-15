import { useState } from "react";
import api from "../services/api";

export default function JobApplicants() {
  const [jobId, setJobId] = useState("");
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    const res = await api.get(
      `/applications/job/${jobId}`
    );

    setApplicants(res.data);
  };

  return (
    <div>
      <h2>Job Applicants</h2>

      <input
        placeholder="Job ID"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
      />

      <button onClick={fetchApplicants}>
        Search
      </button>

      {applicants.map((a) => (
        <div key={a.id}>
          <p>User ID: {a.user_id}</p>
        </div>
      ))}
    </div>
  );
}