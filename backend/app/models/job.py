from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Text

from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    location = Column(
        String,
        nullable=True
    )

    salary = Column(
        Integer,
        nullable=True
    )

    experience = Column(
        Integer,
        nullable=True
    )

    # NEW
    category = Column(
        String,
        nullable=True
    )

    # NEW
    job_type = Column(
        String,
        nullable=True
    )

    # NEW
    featured = Column(
        Integer,
        default=0
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id"),
        nullable=False
    )

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )