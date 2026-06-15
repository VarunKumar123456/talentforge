from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.role_checker import require_role
from app.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


# =========================
# CREATE JOB (Recruiter)
# =========================
@router.post("/")
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    print("🔥 JOB ROUTE HIT")

    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=403,
            detail="Only recruiters can create jobs"
        )

    new_job = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        salary=job.salary,
        experience=job.experience,
        category=job.category,
        job_type=job.job_type,
        company_id=job.company_id,
        created_by=current_user.id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# =========================
# GET ALL JOBS (Candidates)
# =========================
@router.get("/")
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs


# =========================
# GET MY JOBS (Recruiter)
# =========================
@router.get("/my")
def my_jobs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    jobs = db.query(Job).filter(
        Job.created_by == user.id
    ).all()

    return jobs


# =========================
# SEARCH JOBS
# =========================
@router.get("/search")
def search_jobs(
    keyword: str = "",
    location: str = "",
    category: str = "",
    db: Session = Depends(get_db)
):

    query = db.query(Job)

    if keyword:
        query = query.filter(
            Job.title.ilike(f"%{keyword}%")
        )

    if location:
        query = query.filter(
            Job.location.ilike(f"%{location}%")
        )

    if category:
        query = query.filter(
            Job.category.ilike(f"%{category}%")
        )

    return query.all()


# =========================
# JOB COUNT (Recruiter Dashboard)
# =========================
@router.get("/count")
def job_count(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    count = (
        db.query(Job)
        .filter(
            Job.created_by == user.id
        )
        .count()
    )

    return {
        "total_jobs": count
    }