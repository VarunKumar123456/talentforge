from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.role_checker import require_role

from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.models.notification import Notification

from app.schemas.application import ApplicationResponse
from app.utils.email import send_email


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


# =========================
# REQUEST SCHEMAS
# =========================
class ApplyRequest(BaseModel):
    job_id: int


class StatusUpdateRequest(BaseModel):
    status: str


# =========================
# APPLY JOB (CANDIDATE)
# =========================
@router.post("/", response_model=ApplicationResponse)
def apply_job(
    data: ApplyRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["candidate"])

    job = (
        db.query(Job)
        .filter(Job.id == data.job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    existing = (
        db.query(Application)
        .filter(
            Application.job_id == data.job_id,
            Application.candidate_id == user.id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already applied"
        )

    new_app = Application(
        job_id=data.job_id,
        candidate_id=user.id,
        status="applied"
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return new_app


# =========================
# MY APPLICATIONS (CANDIDATE)
# =========================
@router.get("/my")
def my_applications(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["candidate"])

    applications = (
        db.query(
            Application.id,
            Application.status,
            Application.applied_at,
            Job.title,
            Job.location
        )
        .join(Job, Application.job_id == Job.id)
        .filter(Application.candidate_id == user.id)
        .all()
    )

    return [
        {
            "id": a.id,
            "status": a.status,
            "applied_at": a.applied_at,
            "job_title": a.title,
            "job_location": a.location
        }
        for a in applications
    ]


# =========================
# JOB APPLICANTS (RECRUITER)
# =========================
@router.get("/job/{job_id}")
def job_applicants(
    job_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.created_by == user.id
        )
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=403,
            detail="Not your job"
        )

    applications = (
        db.query(
            Application.id,
            Application.status,
            Application.applied_at,

            User.name.label("candidate_name"),
            User.email.label("candidate_email"),
            User.resume_url.label("resume_url"),

            # PHASE 7 PROFILE FIELDS
            User.bio.label("bio"),
            User.skills.label("skills"),
            User.education.label("education"),
            User.experience_details.label("experience_details"),
            User.linkedin_url.label("linkedin_url"),
            User.github_url.label("github_url"),
            User.portfolio_url.label("portfolio_url"),
        )
        .join(User, Application.candidate_id == User.id)
        .filter(Application.job_id == job_id)
        .all()
    )

    return [
        {
            "id": a.id,
            "status": a.status,
            "applied_at": a.applied_at,

            "candidate_name": a.candidate_name,
            "candidate_email": a.candidate_email,
            "resume_url": a.resume_url,

            "bio": a.bio,
            "skills": a.skills,
            "education": a.education,
            "experience_details": a.experience_details,
            "linkedin_url": a.linkedin_url,
            "github_url": a.github_url,
            "portfolio_url": a.portfolio_url,
        }
        for a in applications
    ]


# =========================
# UPDATE APPLICATION STATUS
# =========================
@router.put("/{application_id}/status")
def update_application_status(
    application_id: int,
    data: StatusUpdateRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    job = (
        db.query(Job)
        .filter(Job.id == application.job_id)
        .first()
    )

    if not job or job.created_by != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not your job"
        )

    allowed = [
        "applied",
        "shortlisted",
        "accepted",
        "rejected",
        "interview",
        "hired",
    ]

    status = data.status.lower().strip()

    if status not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    candidate = (
        db.query(User)
        .filter(User.id == application.candidate_id)
        .first()
    )

    application.status = status

    message = (
        f"Your application status for {job.title} "
        f"changed to {status}"
    )

    new_notification = Notification(
        user_id=application.candidate_id,
        message=message
    )

    db.add(new_notification)

    db.commit()
    db.refresh(application)

    print("🔥 STATUS UPDATED")
    print("🔥 NOTIFICATION CREATED")
    print("CANDIDATE:", candidate.email)
    print("MESSAGE:", message)

    email_subject = (
        f"TalentForge Application Update - {job.title}"
    )

    email_body = f"""
    <h2>TalentForge Application Update</h2>

    <p>Hello {candidate.name},</p>

    <p>Your application for <b>{job.title}</b> has been updated.</p>

    <p>Status: <b>{status.upper()}</b></p>

    <p>Thank you for using TalentForge.</p>
    """

    send_email(
        candidate.email,
        email_subject,
        email_body
    )

    return {
        "message": "Status updated successfully",
        "status": application.status
    }

# =========================
# RECRUITER ANALYTICS
# =========================
@router.get("/analytics")
def recruiter_analytics(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    recruiter_job_ids = (
        db.query(Job.id)
        .filter(Job.created_by == user.id)
    )

    total_applications = (
        db.query(Application)
        .filter(Application.job_id.in_(recruiter_job_ids))
        .count()
    )

    shortlisted = (
        db.query(Application)
        .filter(
            Application.job_id.in_(recruiter_job_ids),
            Application.status == "shortlisted"
        )
        .count()
    )

    accepted = (
        db.query(Application)
        .filter(
            Application.job_id.in_(recruiter_job_ids),
            Application.status == "accepted"
        )
        .count()
    )

    rejected = (
        db.query(Application)
        .filter(
            Application.job_id.in_(recruiter_job_ids),
            Application.status == "rejected"
        )
        .count()
    )

    interview = (
        db.query(Application)
        .filter(
            Application.job_id.in_(recruiter_job_ids),
            Application.status == "interview"
        )
        .count()
    )

    hired = (
        db.query(Application)
        .filter(
            Application.job_id.in_(recruiter_job_ids),
            Application.status == "hired"
        )
        .count()
    )

    return {
        "total_applications": total_applications,
        "shortlisted": shortlisted,
        "accepted": accepted,
        "rejected": rejected,
        "interview": interview,
        "hired": hired
    }