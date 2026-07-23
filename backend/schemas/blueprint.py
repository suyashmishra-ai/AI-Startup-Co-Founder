from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class ProblemSchema(BaseModel):
    statement: str = ""
    who: str = ""
    why: str = ""

class SolutionSchema(BaseModel):
    description: str = ""
    advantage: str = ""

class TargetCustomersSchema(BaseModel):
    ageGroup: str = ""
    occupation: str = ""
    location: str = ""
    incomeLevel: str = ""
    persona: str = ""

class MarketSizeSchema(BaseModel):
    tam: str = ""
    sam: str = ""
    som: str = ""

class CompetitorSchema(BaseModel):
    name: str = ""
    strength: str = ""
    weakness: str = ""

class BMCSchema(BaseModel):
    keyPartners: str = ""
    keyActivities: str = ""
    keyResources: str = ""
    valueProposition: str = ""
    customerRelationships: str = ""
    channels: str = ""
    customerSegments: str = ""
    costStructure: str = ""
    revenueStreams: str = ""

class MVPFeaturesSchema(BaseModel):
    mustHave: List[str] = []
    niceToHave: List[str] = []
    future: List[str] = []

class TechStackSchema(BaseModel):
    frontend: str = ""
    backend: str = ""
    database: str = ""
    aiModel: str = ""
    hosting: str = ""
    authentication: str = ""
    storage: str = ""

class RisksSchema(BaseModel):
    technical: str = ""
    financial: str = ""
    legal: str = ""
    market: str = ""
    competition: str = ""

class SWOTSchema(BaseModel):
    strengths: List[str] = []
    weaknesses: List[str] = []
    opportunities: List[str] = []
    threats: List[str] = []

class RoadmapWeekSchema(BaseModel):
    week: str = ""
    actions: str = ""

class StartupScoreSchema(BaseModel):
    overall: int = Field(default=75, ge=0, le=100)
    innovation: int = Field(default=75, ge=0, le=100)
    feasibility: int = Field(default=75, ge=0, le=100)
    marketPotential: int = Field(default=75, ge=0, le=100)
    scalability: int = Field(default=75, ge=0, le=100)
    executionComplexity: int = Field(default=75, ge=0, le=100)

class StartupBlueprint(BaseModel):
    startupNames: List[str] = []
    elevatorPitch: str = ""
    problem: ProblemSchema = Field(default_factory=ProblemSchema)
    solution: SolutionSchema = Field(default_factory=SolutionSchema)
    targetCustomers: TargetCustomersSchema = Field(default_factory=TargetCustomersSchema)
    marketSize: MarketSizeSchema = Field(default_factory=MarketSizeSchema)
    competitors: List[CompetitorSchema] = []
    usp: str = ""
    revenueModel: List[str] = []
    bmc: BMCSchema = Field(default_factory=BMCSchema)
    mvpFeatures: MVPFeaturesSchema = Field(default_factory=MVPFeaturesSchema)
    techStack: TechStackSchema = Field(default_factory=TechStackSchema)
    marketingPlan: List[str] = []
    launchStrategy: List[str] = []
    risks: RisksSchema = Field(default_factory=RisksSchema)
    swot: SWOTSchema = Field(default_factory=SWOTSchema)
    roadmap30day: List[RoadmapWeekSchema] = []
    investorPitch: str = ""
    startupScore: StartupScoreSchema = Field(default_factory=StartupScoreSchema)

class AnalysisResponse(BaseModel):
    id: str
    project_id: str
    blueprint_json: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
