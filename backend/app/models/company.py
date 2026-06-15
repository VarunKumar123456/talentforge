from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)

    description = Column(String)

    website = Column(String)

    logo_url = Column(
        String,
        nullable=True
    )

    banner_url = Column(
        String,
        nullable=True
    )

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )