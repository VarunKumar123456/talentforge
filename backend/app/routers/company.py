import os
import shutil

from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.auth.dependencies import get_current_user
from app.auth.role_checker import require_role

from app.models.company import Company
from app.models.job import Job
from app.schemas.company import CompanyCreate
from app.schemas.company import CompanyResponse


router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


UPLOAD_FOLDER = "uploads/companies"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@router.post(
    "/",
    response_model=CompanyResponse
)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["recruiter"])

    new_company = Company(
        name=company.name,
        description=company.description,
        website=company.website,
        owner_id=user.id
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company


@router.get("/my")
def get_my_companies(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["recruiter"])

    return (
        db.query(Company)
        .filter(Company.owner_id == user.id)
        .all()
    )


@router.get("/count")
def company_count(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    require_role(user, ["recruiter"])

    count = (
        db.query(Company)
        .filter(Company.owner_id == user.id)
        .count()
    )

    return {
        "total_companies": count
    }


@router.post("/{company_id}/logo")
def upload_company_logo(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["recruiter"])

    company = (
        db.query(Company)
        .filter(
            Company.id == company_id,
            Company.owner_id == user.id
        )
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    if not file.filename.lower().endswith(
        (".png", ".jpg", ".jpeg", ".webp")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only image files allowed"
        )

    filename = f"company_{company_id}_logo_{file.filename}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    company.logo_url = f"companies/{filename}"

    db.commit()
    db.refresh(company)

    return {
        "message": "Company logo uploaded",
        "logo_url": company.logo_url
    }


@router.post("/{company_id}/banner")
def upload_company_banner(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    require_role(user, ["recruiter"])

    company = (
        db.query(Company)
        .filter(
            Company.id == company_id,
            Company.owner_id == user.id
        )
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    if not file.filename.lower().endswith(
        (".png", ".jpg", ".jpeg", ".webp")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only image files allowed"
        )

    filename = f"company_{company_id}_banner_{file.filename}"

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    company.banner_url = f"companies/{filename}"

    db.commit()
    db.refresh(company)

    return {
        "message": "Company banner uploaded",
        "banner_url": company.banner_url
    }


@router.get("/{company_id}")
def get_company_public(
    company_id: int,
    db: Session = Depends(get_db)
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

    return company


@router.get("/{company_id}/jobs")
def get_company_jobs(
    company_id: int,
    db: Session = Depends(get_db)
):

    jobs = (
        db.query(Job)
        .filter(Job.company_id == company_id)
        .all()
    )

    return jobs