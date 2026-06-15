from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from datetime import datetime, timezone

from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)

    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))

    status = Column(String, default="applied")

    applied_at = Column(
    DateTime,
    default=lambda: datetime.now(timezone.utc)
)

    # 🔥 ADD THESE RELATIONSHIPS (THIS FIXES YOUR ISSUE)
    job = relationship("Job", backref="applications")
    candidate = relationship("User", backref="applications")
    
  

