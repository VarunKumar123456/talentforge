import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CandidateDashboard from "./pages/CandidateDashboard";
import Dashboard from "./pages/Dashboard";

import CompanyProfile from "./pages/CompanyProfile";
import CreateCompany from "./pages/CreateCompany";
import MyCompanies from "./pages/MyCompanies";

import CreateJob from "./pages/CreateJob";
import Jobs from "./pages/jobs";

import MyApplications from "./pages/MyApplications";
import RecruiterApplications from "./pages/RecruiterApplications";

import CandidateDirectory from "./pages/CandidateDirectory";
import Interviews from "./pages/Interviews";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import RecruiterInterviews from "./pages/RecruiterInterviews";
import SavedJobs from "./pages/SavedJobs";
import UploadResume from "./pages/UploadResume";

import AdminApplications from "./pages/AdminApplications";
import AdminCompanies from "./pages/AdminCompanies";
import AdminDashboard from "./pages/AdminDashboard";
import AdminJobs from "./pages/AdminJobs";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-company" element={<CreateCompany />} />
      <Route path="/my-companies" element={<MyCompanies />} />
      <Route path="/companies/:companyId" element={<CompanyProfile />} />

      <Route path="/interviews" element={<Interviews />} />
      <Route path="/recruiter-interviews" element={<RecruiterInterviews />} />
      <Route path="/create-job" element={<CreateJob />} />
      <Route path="/job-applicants" element={<RecruiterApplications />} />

      <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/my-applications" element={<MyApplications />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/upload-resume" element={<UploadResume />} />
      <Route path="/saved-jobs" element={<SavedJobs />} />

      <Route path="/candidate-directory" element={<CandidateDirectory />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notifications />} />

      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-companies" element={<AdminCompanies />} />
      <Route path="/admin-jobs" element={<AdminJobs />} />
      <Route path="/admin-applications" element={<AdminApplications />} />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;