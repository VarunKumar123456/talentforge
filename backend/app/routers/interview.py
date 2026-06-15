from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.role_checker import require_role

from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.models.notification import Notification
from app.models.interview import Interview

from app.utils.email import send_email


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)


class InterviewCreate(BaseModel):
    application_id: int
    interview_date: str
    interview_time: str
    meeting_link: str | None = None
    notes: str | None = None


@router.post("/")
def schedule_interview(
    data: InterviewCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["recruiter"])

    application = (
        db.query(Application)
        .filter(Application.id == data.application_id)
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

    candidate = (
        db.query(User)
        .filter(User.id == application.candidate_id)
        .first()
    )

    interview = Interview(
        application_id=application.id,
        recruiter_id=user.id,
        candidate_id=application.candidate_id,
        job_id=application.job_id,
        interview_date=data.interview_date,
        interview_time=data.interview_time,
        meeting_link=data.meeting_link,
        notes=data.notes
    )

    application.status = "interview"

    message = (
        f"Interview scheduled for {job.title} "
        f"on {data.interview_date} at {data.interview_time}"
    )

    notification = Notification(
        user_id=application.candidate_id,
        message=message
    )

    db.add(interview)
    db.add(notification)
    db.commit()
    db.refresh(interview)

    email_subject = (
        f"TalentForge Interview Scheduled - {job.title}"
    )

    email_body = f"""
    <h2>TalentForge Interview Scheduled</h2>

    <p>Hello {candidate.name},</p>

    <p>Your interview for <b>{job.title}</b> has been scheduled.</p>

    <p><b>Date:</b> {data.interview_date}</p>
    <p><b>Time:</b> {data.interview_time}</p>

    <p><b>Meeting Link:</b>
    {data.meeting_link or "Will be shared later"}</p>

    <p><b>Notes:</b> {data.notes or "No notes"}</p>

    <p>Good luck!</p>
    """

    send_email(
        candidate.email,
        email_subject,
        email_body
    )

    return {
        "message": "Interview scheduled successfully",
        "interview": interview
    }


@router.get("/my")
def my_interviews(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["candidate"])

    interviews = (
        db.query(
            Interview.id,
            Interview.interview_date,
            Interview.interview_time,
            Interview.meeting_link,
            Interview.notes,
            Job.title.label("job_title"),
            Job.location.label("job_location")
        )
        .join(Job, Interview.job_id == Job.id)
        .filter(Interview.candidate_id == user.id)
        .all()
    )

    return [
        {
            "id": i.id,
            "interview_date": i.interview_date,
            "interview_time": i.interview_time,
            "meeting_link": i.meeting_link,
            "notes": i.notes,
            "job_title": i.job_title,
            "job_location": i.job_location,
        }
        for i in interviews
    ]
    
@router.get("/recruiter/my")
def recruiter_interviews(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["recruiter"])

    interviews = (
        db.query(
            Interview.id,
            Interview.interview_date,
            Interview.interview_time,
            Interview.meeting_link,
            Interview.notes,
            Job.title.label("job_title"),
            User.name.label("candidate_name"),
            User.email.label("candidate_email")
        )
        .join(Job, Interview.job_id == Job.id)
        .join(User, Interview.candidate_id == User.id)
        .filter(Interview.recruiter_id == user.id)
        .all()
    )

    return [
        {
            "id": i.id,
            "interview_date": i.interview_date,
            "interview_time": i.interview_time,
            "meeting_link": i.meeting_link,
            "notes": i.notes,
            "job_title": i.job_title,
            "candidate_name": i.candidate_name,
            "candidate_email": i.candidate_email,
        }
        for i in interviews
    ]