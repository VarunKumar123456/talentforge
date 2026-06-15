from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.auth.dependencies import get_admin_user

from app.models.user import User
from app.models.company import Company
from app.models.job import Job
from app.models.application import Application


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# =========================
# ADMIN STATS
# =========================
@router.get("/stats")
def admin_stats(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    total_users = db.query(User).count()
    total_candidates = (
        db.query(User)
        .filter(User.role == "candidate")
        .count()
    )
    total_recruiters = (
        db.query(User)
        .filter(User.role == "recruiter")
        .count()
    )
    total_admins = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    total_companies = db.query(Company).count()
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()

    applied = (
        db.query(Application)
        .filter(Application.status == "applied")
        .count()
    )
    shortlisted = (
        db.query(Application)
        .filter(Application.status == "shortlisted")
        .count()
    )
    interview = (
        db.query(Application)
        .filter(Application.status == "interview")
        .count()
    )
    accepted = (
        db.query(Application)
        .filter(Application.status == "accepted")
        .count()
    )
    hired = (
        db.query(Application)
        .filter(Application.status == "hired")
        .count()
    )
    rejected = (
        db.query(Application)
        .filter(Application.status == "rejected")
        .count()
    )

    return {
        "total_users": total_users,
        "total_candidates": total_candidates,
        "total_recruiters": total_recruiters,
        "total_admins": total_admins,
        "total_companies": total_companies,
        "total_jobs": total_jobs,
        "total_applications": total_applications,
        "applied": applied,
        "shortlisted": shortlisted,
        "interview": interview,
        "accepted": accepted,
        "hired": hired,
        "rejected": rejected,
    }


# =========================
# USERS
# =========================
@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "resume_url": u.resume_url,
            "skills": u.skills,
            "education": u.education,
            "experience_details": u.experience_details,
            "linkedin_url": u.linkedin_url,
            "github_url": u.github_url,
            "portfolio_url": u.portfolio_url,
        }
        for u in users
    ]


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Cannot delete admin user"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


# =========================
# COMPANIES
# =========================
@router.get("/companies")
def get_all_companies(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    companies = (
        db.query(
            Company.id,
            Company.name,
            Company.description,
            Company.website,
            Company.owner_id,
            User.name.label("owner_name"),
            User.email.label("owner_email")
        )
        .join(User, Company.owner_id == User.id)
        .all()
    )

    return [
        {
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "website": c.website,
            "owner_id": c.owner_id,
            "owner_name": c.owner_name,
            "owner_email": c.owner_email,
        }
        for c in companies
    ]


@router.delete("/companies/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    company = (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    db.delete(company)
    db.commit()

    return {
        "message": "Company deleted successfully"
    }


# =========================
# JOBS
# =========================
@router.get("/jobs")
def get_all_jobs(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    jobs = (
        db.query(
            Job.id,
            Job.title,
            Job.description,
            Job.location,
            Job.salary,
            Job.experience,
            Job.category,
            Job.job_type,
            Job.company_id,
            Job.created_by,
            User.name.label("recruiter_name"),
            User.email.label("recruiter_email")
        )
        .join(User, Job.created_by == User.id)
        .all()
    )

    return [
        {
            "id": j.id,
            "title": j.title,
            "description": j.description,
            "location": j.location,
            "salary": j.salary,
            "experience": j.experience,
            "category": j.category,
            "job_type": j.job_type,
            "company_id": j.company_id,
            "created_by": j.created_by,
            "recruiter_name": j.recruiter_name,
            "recruiter_email": j.recruiter_email,
        }
        for j in jobs
    ]


@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }


# =========================
# APPLICATIONS
# =========================
@router.get("/applications")
def get_all_applications(
    db: Session = Depends(get_db),
    admin=Depends(get_admin_user)
):

    applications = (
        db.query(
            Application.id,
            Application.status,
            Application.applied_at,
            Job.title.label("job_title"),
            User.name.label("candidate_name"),
            User.email.label("candidate_email"),
        )
        .join(Job, Application.job_id == Job.id)
        .join(User, Application.candidate_id == User.id)
        .all()
    )

    return [
        {
            "id": a.id,
            "status": a.status,
            "applied_at": a.applied_at,
            "job_title": a.job_title,
            "candidate_name": a.candidate_name,
            "candidate_email": a.candidate_email,
        }
        for a in applications
    ]