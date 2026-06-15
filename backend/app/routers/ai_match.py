import os
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from PyPDF2 import PdfReader
from docx import Document

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.role_checker import require_role
from app.models.application import Application
from app.models.job import Job
from app.models.user import User


router = APIRouter(
    prefix="/ai-match",
    tags=["AI Resume Match"]
)


SKILL_KEYWORDS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "node",
    "fastapi",
    "django",
    "flask",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "aws",
    "azure",
    "docker",
    "kubernetes",
    "git",
    "github",
    "linux",
    "machine learning",
    "deep learning",
    "data science",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "excel",
    "power bi",
    "tableau",
]


def extract_text_from_pdf(path: str):
    text = ""

    reader = PdfReader(path)

    for page in reader.pages:
        content = page.extract_text()
        if content:
            text += content + " "

    return text


def extract_text_from_docx(path: str):
    document = Document(path)

    text = ""

    for para in document.paragraphs:
        text += para.text + " "

    return text


def extract_resume_text(resume_url: str | None):
    if not resume_url:
        return ""

    path = os.path.join("uploads", resume_url)

    if not os.path.exists(path):
        return ""

    if path.lower().endswith(".pdf"):
        return extract_text_from_pdf(path)

    if path.lower().endswith(".docx"):
        return extract_text_from_docx(path)

    return ""


def clean_text(text: str):
    return re.sub(
        r"[^a-zA-Z0-9+#. ]",
        " ",
        text.lower()
    )


def extract_skills(text: str):
    text = clean_text(text)

    found = []

    for skill in SKILL_KEYWORDS:
        if skill.lower() in text:
            found.append(skill)

    return list(set(found))


def calculate_score(job_text: str, candidate_text: str):
    job_skills = extract_skills(job_text)
    candidate_skills = extract_skills(candidate_text)

    if not job_skills:
        return {
            "score": 50,
            "job_skills": [],
            "matched_skills": [],
            "missing_skills": [],
            "recommendation": "Job has limited skill keywords"
        }

    matched = [
        skill for skill in job_skills
        if skill in candidate_skills
    ]

    missing = [
        skill for skill in job_skills
        if skill not in candidate_skills
    ]

    score = int((len(matched) / len(job_skills)) * 100)

    if score >= 80:
        recommendation = "Strong candidate"
    elif score >= 50:
        recommendation = "Moderate match"
    else:
        recommendation = "Weak match"

    return {
        "score": score,
        "job_skills": job_skills,
        "matched_skills": matched,
        "missing_skills": missing,
        "recommendation": recommendation
    }


@router.get("/application/{application_id}")
def match_application(
    application_id: int,
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

    candidate = (
        db.query(User)
        .filter(User.id == application.candidate_id)
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    resume_text = extract_resume_text(candidate.resume_url)

    profile_text = " ".join([
        candidate.skills or "",
        candidate.bio or "",
        candidate.education or "",
        candidate.experience_details or ""
    ])

    candidate_text = resume_text + " " + profile_text

    job_text = " ".join([
        job.title or "",
        job.description or "",
        job.category or "",
        job.job_type or ""
    ])

    result = calculate_score(
        job_text,
        candidate_text
    )

    return {
        "candidate_name": candidate.name,
        "job_title": job.title,
        "resume_found": bool(resume_text),
        **result
    }