from pydantic import BaseModel


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: str

    class Config:
        from_attributes = True


class StatusUpdateRequest(BaseModel):
    status: str