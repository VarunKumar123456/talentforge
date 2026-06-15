from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user

from app.models.message import Message
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.models.notification import Notification

from app.websocket_manager import manager


router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


class MessageCreate(BaseModel):
    application_id: int
    message: str


def verify_application_access(
    application_id: int,
    db: Session,
    user
):
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

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if user.role == "recruiter":
        if job.created_by != user.id:
            raise HTTPException(
                status_code=403,
                detail="Not your job"
            )

        other_user_id = application.candidate_id

    elif user.role == "candidate":
        if application.candidate_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="Not your application"
            )

        other_user_id = job.created_by

    else:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return application, job, other_user_id


@router.post("/")
async def send_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role not in ["recruiter", "candidate"]:
        raise HTTPException(
            status_code=403,
            detail="Only recruiter or candidate can send messages"
        )

    application, job, receiver_id = verify_application_access(
        data.application_id,
        db,
        user
    )

    new_message = Message(
        application_id=data.application_id,
        sender_id=user.id,
        receiver_id=receiver_id,
        message=data.message
    )

    notification = Notification(
        user_id=receiver_id,
        message=f"New message from {user.name}"
    )

    db.add(new_message)
    db.add(notification)
    db.commit()
    db.refresh(new_message)

    message_data = {
        "id": new_message.id,
        "application_id": new_message.application_id,
        "sender_id": new_message.sender_id,
        "receiver_id": new_message.receiver_id,
        "message": new_message.message,
        "is_read": new_message.is_read,
        "created_at": str(new_message.created_at),
        "sender_name": user.name,
        "sender_role": user.role,
    }

    await manager.broadcast(
        data.application_id,
        message_data
    )

    return {
        "message": "Message sent successfully",
        "data": message_data
    }


@router.get("/application/{application_id}")
def get_application_messages(
    application_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    verify_application_access(
        application_id,
        db,
        user
    )

    messages = (
        db.query(
            Message.id,
            Message.application_id,
            Message.sender_id,
            Message.receiver_id,
            Message.message,
            Message.is_read,
            Message.created_at,
            User.name.label("sender_name"),
            User.role.label("sender_role")
        )
        .join(User, Message.sender_id == User.id)
        .filter(Message.application_id == application_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return [
        {
            "id": m.id,
            "application_id": m.application_id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "message": m.message,
            "is_read": m.is_read,
            "created_at": m.created_at,
            "sender_name": m.sender_name,
            "sender_role": m.sender_role,
        }
        for m in messages
    ]


@router.put("/application/{application_id}/read")
def mark_conversation_read(
    application_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    verify_application_access(
        application_id,
        db,
        user
    )

    unread_messages = (
        db.query(Message)
        .filter(
            Message.application_id == application_id,
            Message.receiver_id == user.id,
            Message.is_read == False
        )
        .all()
    )

    for msg in unread_messages:
        msg.is_read = True

    db.commit()

    return {
        "message": "Conversation marked as read",
        "updated_count": len(unread_messages)
    }


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    count = (
        db.query(Message)
        .filter(
            Message.receiver_id == user.id,
            Message.is_read == False
        )
        .count()
    )

    return {
        "unread_count": count
    }


@router.get("/my-conversations")
def my_conversations(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role == "candidate":
        applications = (
            db.query(
                Application.id.label("application_id"),
                Application.status,
                Job.title.label("job_title"),
                Job.location.label("job_location"),
                User.name.label("recruiter_name"),
                User.email.label("recruiter_email")
            )
            .join(Job, Application.job_id == Job.id)
            .join(User, Job.created_by == User.id)
            .filter(Application.candidate_id == user.id)
            .all()
        )

        return [
            {
                "application_id": a.application_id,
                "status": a.status,
                "job_title": a.job_title,
                "job_location": a.job_location,
                "other_user_name": a.recruiter_name,
                "other_user_email": a.recruiter_email,
                "unread_count": (
                    db.query(Message)
                    .filter(
                        Message.application_id == a.application_id,
                        Message.receiver_id == user.id,
                        Message.is_read == False
                    )
                    .count()
                )
            }
            for a in applications
        ]

    if user.role == "recruiter":
        applications = (
            db.query(
                Application.id.label("application_id"),
                Application.status,
                Job.title.label("job_title"),
                Job.location.label("job_location"),
                User.name.label("candidate_name"),
                User.email.label("candidate_email")
            )
            .join(Job, Application.job_id == Job.id)
            .join(User, Application.candidate_id == User.id)
            .filter(Job.created_by == user.id)
            .all()
        )

        return [
            {
                "application_id": a.application_id,
                "status": a.status,
                "job_title": a.job_title,
                "job_location": a.job_location,
                "other_user_name": a.candidate_name,
                "other_user_email": a.candidate_email,
                "unread_count": (
                    db.query(Message)
                    .filter(
                        Message.application_id == a.application_id,
                        Message.receiver_id == user.id,
                        Message.is_read == False
                    )
                    .count()
                )
            }
            for a in applications
        ]

    raise HTTPException(
        status_code=403,
        detail="Access denied"
    )


@router.put("/{message_id}/read")
def mark_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    message = (
        db.query(Message)
        .filter(
            Message.id == message_id,
            Message.receiver_id == user.id
        )
        .first()
    )

    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found"
        )

    message.is_read = True

    db.commit()

    return {
        "message": "Message marked as read"
    }