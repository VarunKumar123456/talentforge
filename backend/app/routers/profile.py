from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.role_checker import require_role

from app.models.user import User


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


class ProfileUpdate(BaseModel):
    bio: str | None = None
    skills: str | None = None
    education: str | None = None
    experience_details: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None


@router.get("/me")
def get_profile(
    current_user=Depends(get_current_user)
):
    return current_user


@router.put("/me")
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = (
        db.query(User)
        .filter(User.id == current_user.id)
        .first()
    )

    user.bio = data.bio
    user.skills = data.skills
    user.education = data.education
    user.experience_details = data.experience_details
    user.linkedin_url = data.linkedin_url
    user.github_url = data.github_url
    user.portfolio_url = data.portfolio_url

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully"
    }


@router.get("/candidates")
def get_all_candidates(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    candidates = (
        db.query(User)
        .filter(User.role == "candidate")
        .all()
    )

    return candidates


@router.get("/candidates/search")
def search_candidates(
    skill: str = "",
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    query = (
        db.query(User)
        .filter(User.role == "candidate")
    )

    if skill:
        query = query.filter(
            User.skills.ilike(f"%{skill}%")
        )

    return query.all()


@router.get("/candidates/{candidate_id}")
def get_candidate_by_id(
    candidate_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    candidate = (
        db.query(User)
        .filter(
            User.id == candidate_id,
            User.role == "candidate"
        )
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate