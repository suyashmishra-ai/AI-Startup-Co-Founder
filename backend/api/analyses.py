from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.user import User
from backend.models.project import Project
from backend.models.analysis import Analysis
from backend.schemas.blueprint import AnalysisResponse
from backend.services.auth_service import get_current_user

router = APIRouter(prefix="/analyses", tags=["Analyses"])

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = db.query(Analysis).join(Project).filter(Analysis.id == analysis_id, Project.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    return analysis

def generate_markdown_report(r: dict) -> str:
    names = r.get("startupNames", ["Startup Blueprint"])
    title = names[0] if names else "Startup Blueprint"
    pitch = r.get("elevatorPitch", "")
    prob = r.get("problem", {})
    sol = r.get("solution", {})
    tc = r.get("targetCustomers", {})
    ms = r.get("marketSize", {})
    comps = r.get("competitors", [])
    rev = r.get("revenueModel", [])
    bmc = r.get("bmc", {})
    mvp = r.get("mvpFeatures", {})
    tech = r.get("techStack", {})
    mkt = r.get("marketingPlan", [])
    launch = r.get("launchStrategy", [])
    risks = r.get("risks", {})
    swot = r.get("swot", {})
    roadmap = r.get("roadmap30day", [])
    investor = r.get("investorPitch", "")
    score = r.get("startupScore", {})

    lines = [
        f"# {title}",
        f"",
        f"**Elevator Pitch:** {pitch}",
        f"",
        f"## Problem",
        f"{prob.get('statement', '')}",
        f"- **Who:** {prob.get('who', '')}",
        f"- **Why it matters:** {prob.get('why', '')}",
        f"",
        f"## Solution",
        f"{sol.get('description', '')}",
        f"- **Edge:** {sol.get('advantage', '')}",
        f"",
        f"## Unique Selling Proposition",
        f"{r.get('usp', '')}",
        f"",
        f"## Target Customers",
        f"- **Age:** {tc.get('ageGroup', '')} | **Occupation:** {tc.get('occupation', '')}",
        f"- **Location:** {tc.get('location', '')} | **Income:** {tc.get('incomeLevel', '')}",
        f"- **Persona:** {tc.get('persona', '')}",
        f"",
        f"## Market Size",
        f"- **TAM:** {ms.get('tam', '')}",
        f"- **SAM:** {ms.get('sam', '')}",
        f"- **SOM:** {ms.get('som', '')}",
        f"",
        f"## Competitors",
    ]
    for c in comps:
        lines.append(f"- **{c.get('name', '')}** — Strength: {c.get('strength', '')} | Weakness: {c.get('weakness', '')}")

    lines.extend([
        f"",
        f"## Revenue Model",
    ])
    for item in rev:
        lines.append(f"- {item}")

    lines.extend([
        f"",
        f"## Business Model Canvas",
    ])
    for k, v in bmc.items():
        lines.append(f"- **{k}:** {v}")

    lines.extend([
        f"",
        f"## MVP Features",
        f"- **Must Have:** {', '.join(mvp.get('mustHave', []))}",
        f"- **Nice to Have:** {', '.join(mvp.get('niceToHave', []))}",
        f"- **Future:** {', '.join(mvp.get('future', []))}",
        f"",
        f"## Tech Stack",
    ])
    for k, v in tech.items():
        lines.append(f"- **{k}:** {v}")

    lines.extend([
        f"",
        f"## Go-To-Market & Launch Strategy",
        f"### Marketing Channels",
    ])
    for item in mkt:
        lines.append(f"- {item}")

    lines.append(f"### Launch Sequence")
    for idx, item in enumerate(launch, 1):
        lines.append(f"{idx}. {item}")

    lines.extend([
        f"",
        f"## Risks",
    ])
    for k, v in risks.items():
        lines.append(f"- **{k}:** {v}")

    lines.extend([
        f"",
        f"## SWOT Analysis",
        f"- **Strengths:** {', '.join(swot.get('strengths', []))}",
        f"- **Weaknesses:** {', '.join(swot.get('weaknesses', []))}",
        f"- **Opportunities:** {', '.join(swot.get('opportunities', []))}",
        f"- **Threats:** {', '.join(swot.get('threats', []))}",
        f"",
        f"## 30-Day Action Roadmap",
    ])
    for w in roadmap:
        lines.append(f"- **{w.get('week', '')}:** {w.get('actions', '')}")

    lines.extend([
        f"",
        f"## Investor Pitch",
        f"{investor}",
        f"",
        f"## Startup Score (Overall: {score.get('overall', 0)}/100)",
        f"- Innovation: {score.get('innovation', 0)}/100",
        f"- Feasibility: {score.get('feasibility', 0)}/100",
        f"- Market Potential: {score.get('marketPotential', 0)}/100",
        f"- Scalability: {score.get('scalability', 0)}/100",
        f"- Execution Complexity: {score.get('executionComplexity', 0)}/100"
    ])

    return "\n".join(lines)

@router.get("/{analysis_id}/report")
def export_report(analysis_id: str, format: str = Query(default="md"), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    analysis = db.query(Analysis).join(Project).filter(Analysis.id == analysis_id, Project.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

    md_content = generate_markdown_report(analysis.blueprint_json)
    filename = f"startup-blueprint-{analysis_id[:8]}.md"

    return Response(
        content=md_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
