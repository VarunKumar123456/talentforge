from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.role_checker import require_role

from app.models.saved_job import SavedJob
from app.models.job import Job


router = APIRouter(
    prefix="/saved-jobs",
    tags=["Saved Jobs"]
)


@router.post("/{job_id}")
def save_job(
    job_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["candidate"])

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    existing = (
        db.query(SavedJob)
        .filter(
            SavedJob.job_id == job_id,
            SavedJob.candidate_id == user.id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Job already saved"
        )

    saved = SavedJob(
        job_id=job_id,
        candidate_id=user.id
    )

    db.add(saved)
    db.commit()
    db.refresh(saved)

    return {
        "message": "Job saved successfully"
    }


@router.get("/my")
def my_saved_jobs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["candidate"])

    saved_jobs = (
        db.query(
            SavedJob.id.label("saved_id"),
            Job.id.label("job_id"),
            Job.title,
            Job.description,
            Job.location,
            Job.salary,
            Job.experience,
            Job.category,
            Job.job_type
        )
        .join(Job, SavedJob.job_id == Job.id)
        .filter(SavedJob.candidate_id == user.id)
        .all()
    )

    return [
        {
            "saved_id": s.saved_id,
            "job_id": s.job_id,
            "title": s.title,
            "description": s.description,
            "location": s.location,
            "salary": s.salary,
            "experience": s.experience,
            "category": s.category,
            "job_type": s.job_type,
        }
        for s in saved_jobs
    ]


@router.delete("/{saved_id}")
def remove_saved_job(
    saved_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["candidate"])

    saved = (
        db.query(SavedJob)
        .filter(
            SavedJob.id == saved_id,
            SavedJob.candidate_id == user.id
        )
        .first()
    )

    if not saved:
        raise HTTPException(
            status_code=404,
            detail="Saved job not found"
        )

    db.delete(saved)
    db.commit()

    return {
        "message": "Saved job removed"
    }