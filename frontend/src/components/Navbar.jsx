export default function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <div
      style={{
        background: "#111827",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h2>Job Portal</h2>

      <div>
        {role}
      </div>
    </div>
  );
}