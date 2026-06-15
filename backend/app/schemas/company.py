from pydantic import BaseModel
from typing import Optional


class CompanyCreate(BaseModel):
    name: str
    description: str
    website: Optional[str] = None


class CompanyResponse(BaseModel):
    id: int
    name: str
    description: str
    website: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    owner_id: int

    class Config:
        from_attributes = True