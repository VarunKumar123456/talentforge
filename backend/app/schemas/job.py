from pydantic import BaseModel


class JobCreate(BaseModel):
    title: str
    description: str
    location: str | None = None
    salary: int | None = None
    experience: int | None = None

    category: str | None = None
    job_type: str | None = None

    company_id: int


class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str | None
    salary: int | None
    experience: int | None

    category: str | None
    job_type: str | None

    company_id: int
    created_by: int

    class Config:
        from_attributes = True