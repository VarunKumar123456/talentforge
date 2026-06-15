import os
import shutil

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.dependencies import get_current_user

from app.models.user import User

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@router.post("/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    allowed_extensions = (
        ".pdf",
        ".doc",
        ".docx"
    )

    if not file.filename.lower().endswith(
        allowed_extensions
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF/DOC/DOCX allowed"
        )

    filename = (
        f"{current_user.id}_{file.filename}"
    )

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    user = (
        db.query(User)
        .filter(User.id == current_user.id)
        .first()
    )

    # Store only filename
    user.resume_url = filename

    db.commit()

    return {
        "message": "Resume uploaded successfully",
        "resume_url": filename
    }


@router.get("/my")
def get_my_resume(
    current_user=Depends(get_current_user)
):
    return {
        "resume_url": current_user.resume_url
    }