# 🚀 TalentForge

### AI-Powered Job Portal & Applicant Tracking System (ATS)

### 🌟 Modern Full-Stack Recruitment Platform for Candidates, Recruiters & Administrators

## 📖 Overview

TalentForge is a production-ready full-stack recruitment platform that streamlines the hiring process through intelligent candidate management, real-time communication, applicant tracking, interview scheduling, and AI-powered resume matching.

The platform enables:

👨‍💻 Candidates to discover opportunities and manage their career journey.

🏢 Recruiters to post jobs, manage applicants, schedule interviews, and hire talent.

🛡️ Administrators to oversee the complete recruitment ecosystem.

---

# 🌐 Live Demo

### 🔗 Frontend

https://talentforge-sepia.vercel.app

### 🔗 Backend API

https://talentforge-backend-oncn.onrender.com

### 🔗 API Documentation

https://talentforge-backend-oncn.onrender.com/docs

### 🔗 GitHub Repository

https://github.com/VarunKumar123456/talentforge

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React + Vite          │
│         Frontend            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        FastAPI API          │
│         Backend             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     Neon PostgreSQL DB      │
└─────────────────────────────┘

               ▲
               │
┌─────────────────────────────┐
│      Gmail SMTP Server      │
└─────────────────────────────┘

               ▲
               │
┌─────────────────────────────┐
│     WebSocket Messaging     │
└─────────────────────────────┘
```

---

# ✨ Features

## 👨‍💻 Candidate Features

### 🔐 Authentication

* User Registration
* Secure Login
* JWT Authentication
* Role-Based Access

### 💼 Job Portal

* Browse Jobs
* Search Jobs
* Save Jobs
* Apply for Jobs
* Track Applications

### 📄 Resume Management

* Upload Resume
* Resume Storage
* Resume Viewing

### 👤 Profile Management

* Skills
* Education
* Experience
* Bio
* LinkedIn URL
* GitHub URL
* Portfolio URL

### 💬 Communication

* Real-Time Chat
* Notifications
* Application Updates
* Interview Updates
* Email Alerts

### 📅 Interviews

* View Scheduled Interviews
* Meeting Links
* Interview Tracking

---

## 🏢 Recruiter Features

### 🏭 Company Management

* Create Company
* Manage Companies
* Company Profiles

### 📢 Job Management

* Create Jobs
* Manage Jobs
* Edit Jobs
* Delete Jobs

### 👥 Applicant Management

* View Applicants
* Candidate Profiles
* Resume Review
* Candidate Evaluation

### 🎯 Hiring Pipeline

* Applied
* Shortlisted
* Interview
* Accepted
* Rejected
* Hired

### 📊 Analytics

* Application Analytics
* Hiring Statistics
* Recruitment Insights

### 📅 Interview Scheduling

* Schedule Interviews
* Share Meeting Links
* Notify Candidates

### 💬 Real-Time Messaging

* Recruiter ↔ Candidate Chat
* Instant Communication
* Live Updates

---

## 🛡️ Admin Features

### ⚙️ Platform Management

* Manage Users
* Manage Companies
* Manage Jobs
* Manage Applications

### 📈 Dashboard Analytics

* Total Users
* Total Jobs
* Total Applications
* Total Companies

### 🔒 Administrative Controls

* Role Management
* Platform Monitoring
* Data Oversight

---

# 🤖 AI Resume Matching

TalentForge includes an AI-powered resume matching module that compares:

✅ Candidate Skills

✅ Job Requirements

✅ Experience Levels

✅ Resume Content

and generates:

* Match Score
* Compatibility Rating
* Recruitment Recommendation

---

# 💬 Real-Time Chat System

Built using FastAPI WebSockets.

### Features

* Instant Messaging
* Recruiter ↔ Candidate Conversations
* Application-Based Chat Rooms
* Message History
* Live Updates
* Unread Message Tracking

---

# 🔐 Security

### Authentication

* JWT Tokens
* Password Hashing
* Protected Endpoints

### Authorization

* Candidate Role
* Recruiter Role
* Admin Role

### Data Security

* Secure Password Storage
* Role-Based Permissions
* Protected APIs

---

# ⚙️ Technology Stack

## Frontend

| Technology   | Purpose           |
| ------------ | ----------------- |
| React.js     | UI Development    |
| Vite         | Build Tool        |
| React Router | Routing           |
| Axios        | API Communication |
| React Icons  | UI Components     |

---

## Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| FastAPI    | REST API            |
| Python     | Backend Language    |
| SQLAlchemy | ORM                 |
| JWT        | Authentication      |
| WebSockets | Real-Time Messaging |
| SMTP       | Email Notifications |

---

## Database

| Technology | Purpose             |
| ---------- | ------------------- |
| PostgreSQL | Relational Database |
| Neon       | Cloud Database      |

---

## Deployment

| Service | Purpose          |
| ------- | ---------------- |
| Vercel  | Frontend Hosting |
| Render  | Backend Hosting  |
| Neon    | Database Hosting |

---

# 📂 Project Structure

```bash
talentforge/

├── backend/
│
├── app/
│   ├── auth/
│   ├── core/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── utils/
│   ├── uploads/
│   └── main.py
│
├── frontend/
│
├── src/
│   ├── pages/
│   ├── services/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
│
└── README.md
```

---

# 🚀 Local Setup

## Clone Repository

```bash
git clone https://github.com/VarunKumar123456/talentforge.git
cd talentforge
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔧 Environment Variables

## Backend (.env)

```env
DATABASE_URL=your_neon_database_url

SECRET_KEY=your_secret_key

ALGORITHM=HS256

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

FRONTEND_URL=https://your-vercel-url.vercel.app
```

---

# 📡 API Modules

| Module         | Description          |
| -------------- | -------------------- |
| /auth          | Authentication       |
| /companies     | Company Management   |
| /jobs          | Job Management       |
| /applications  | Applications         |
| /resume        | Resume Upload        |
| /profile       | User Profiles        |
| /saved-jobs    | Saved Jobs           |
| /notifications | Notifications        |
| /interviews    | Interview Scheduling |
| /messages      | Real-Time Chat       |
| /admin         | Admin Controls       |
| /ai-match      | AI Resume Matching   |

---

# 📈 Achievements

### ✔ Full-Stack Architecture

Designed and developed a complete production-grade recruitment platform from scratch.

### ✔ Cloud Deployment

Successfully deployed:

* Frontend on Vercel
* Backend on Render
* Database on Neon PostgreSQL

### ✔ Real-Time Features

Implemented live recruiter-candidate messaging using WebSockets.

### ✔ Authentication System

Built secure JWT authentication with role-based authorization.

### ✔ AI Integration

Integrated AI-powered resume and job matching capabilities.

---

# 🎯 Skills Demonstrated

* Full Stack Development
* Backend Development
* REST API Design
* Database Design
* Authentication & Authorization
* PostgreSQL
* FastAPI
* React.js
* WebSockets
* Cloud Deployment
* Software Architecture
* System Design
* Production Debugging
* AI Integration

---

# 🔮 Future Enhancements

### Phase 2

* Resume Parsing
* Skill Extraction
* Resume Ranking

### Phase 3

* Google Meet Integration
* Zoom Integration
* Video Interviews

### Phase 4

* Recruiter Premium Plans
* Subscription Billing
* Stripe Payments

### Phase 5

* Docker Deployment
* Kubernetes Scaling
* CI/CD Pipelines
* Monitoring & Logging

---

# 📸 Screenshots

Add project screenshots here:

```markdown
![Login](screenshots/login.png)
<img width="1091" height="736" alt="Screenshot 2026-06-17 122903" src="https://github.com/user-attachments/assets/5871bed4-fd41-4fc2-aad4-1032292dd037" />

![Candidate Dashboard](screenshots/candidate-dashboard.png)
<img width="1898" height="891" alt="Screenshot 2026-06-17 123020" src="https://github.com/user-attachments/assets/43c12fd2-a5cc-436d-81b5-aa2e9d0544ed" />

![Recruiter Dashboard](screenshots/recruiter-dashboard.png)
<img width="1890" height="920" alt="Screenshot 2026-06-17 123120" src="https://github.com/user-attachments/assets/d7fa3024-9dec-4fa9-8011-88d211c8b20e" />
<img width="1827" height="727" alt="Screenshot 2026-06-17 123130" src="https://github.com/user-attachments/assets/71ace845-0ba5-404f-b384-02f828364a45" />

![Admin Dashboard](screenshots/admin-dashboard.png)
<img width="1887" height="895" alt="Screenshot 2026-06-17 123946" src="https://github.com/user-attachments/assets/19e2c0f2-e9d0-484f-80b2-4d904674e80d" />

![Messaging System](screenshots/chat.png)
<img width="1850" height="643" alt="Screenshot 2026-06-17 124218" src="https://github.com/user-attachments/assets/6d5276fd-250d-46e6-b7d3-57625f2f9ea4" />

```

---

# 👨‍💻 Developer

## Varun Kumar

### Full Stack Developer
### Backend Devloper

📧 Email

[chitikenavarunkumar@gmail.com](mailto:chitikenavarunkumar@gmail.com)

🔗 GitHub

https://github.com/VarunKumar123456

🔗 LinkedIn

https://www.linkedin.com/in/varun-kumar-7004532b6/

---

# ⭐ Support

If you found this project valuable:

⭐ Star the Repository

🍴 Fork the Project

💼 Connect on LinkedIn

🚀 Share with the Developer

---

### 🚀 Building Technology That Connects Talent With Opportunity

Made with ❤️ by Varun Kumar
