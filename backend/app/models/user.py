from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )

    resume_url = Column(
        String,
        nullable=True
    )

    # ======================
    # PROFILE FIELDS
    # ======================

    profile_photo = Column(
        String,
        nullable=True
    )

    bio = Column(
        Text,
        nullable=True
    )

    skills = Column(
        Text,
        nullable=True
    )

    education = Column(
        Text,
        nullable=True
    )

    experience_details = Column(
        Text,
        nullable=True
    )

    linkedin_url = Column(
        String,
        nullable=True
    )

    github_url = Column(
        String,
        nullable=True
    )

    portfolio_url = Column(
        String,
        nullable=True
    )