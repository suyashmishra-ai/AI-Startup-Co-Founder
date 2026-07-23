import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from backend.models.base import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    idea = Column(String(2000), nullable=False)
    industry = Column(String(255), nullable=False)
    audience = Column(String(255), nullable=True)
    country = Column(String(255), nullable=True)
    budget = Column(String(255), nullable=True)
    team = Column(String(255), nullable=True)
    stage = Column(String(50), nullable=False, default="Idea")
    goal = Column(String(1000), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner = relationship("User", back_populates="projects")
    analyses = relationship("Analysis", back_populates="project", cascade="all, delete-orphan")
