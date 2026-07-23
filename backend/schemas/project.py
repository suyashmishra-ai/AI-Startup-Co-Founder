from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProjectCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    idea: str = Field(..., min_length=5)
    industry: str = Field(..., min_length=2)
    audience: Optional[str] = "not specified"
    country: Optional[str] = "not specified"
    budget: Optional[str] = "not specified"
    team: Optional[str] = "not specified"
    stage: str = Field(default="Idea")
    goal: str = Field(..., min_length=2)

class ProjectUpdateRequest(BaseModel):
    name: Optional[str] = None
    idea: Optional[str] = None
    industry: Optional[str] = None
    audience: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None
    team: Optional[str] = None
    stage: Optional[str] = None
    goal: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    idea: str
    industry: str
    audience: Optional[str] = None
    country: Optional[str] = None
    budget: Optional[str] = None
    team: Optional[str] = None
    stage: str
    goal: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AnalyzeRequest(BaseModel):
    idea: str = Field(..., min_length=5)
    industry: str = Field(..., min_length=2)
    audience: Optional[str] = "not specified"
    country: Optional[str] = "not specified"
    budget: Optional[str] = "not specified"
    team: Optional[str] = "not specified"
    stage: str = Field(default="Idea")
    goal: str = Field(..., min_length=2)
