import { useState } from "react";
import api from "../services/api";

export default function UploadResume() {
  const [file, setFile] = useState(null);

  const uploadResume = async () => {
    if (!file) {
      alert("Select resume first");
      return;
    }

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    try {
      const res = await api.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Resume Uploaded");

      console.log(res.data);
    } catch (err) {
      console.log(
        err.response?.data
      );
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload Resume</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
      />

      <br />
      <br />

      <button
        onClick={uploadResume}
      >
        Upload Resume
      </button>
    </div>
  );
}