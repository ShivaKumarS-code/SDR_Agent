from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from api.auth import get_current_user
from crew.analysis_crew import run_analysis
from db.database import get_session
from db.models.analysis import Analysis
from db.models.research import Research
from db.models.user import User
from uuid import UUID

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)

@router.post("/{research_id}")
def analyze_company(
    research_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):

    research = session.get(Research, research_id)
    if not research:
        raise HTTPException(status_code=404, detail="Research not found")

    if research.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this research.",
        )

    result = run_analysis(research.research)

    analysis = Analysis(
        user_id=current_user.id,
        research_id=research_id,
        analysis=result.raw,
    )

    session.add(analysis)
    session.commit()
    session.refresh(analysis)

    return {
        "id": analysis.id,
        "research_id": analysis.research_id,
        "analysis": analysis.analysis,
        "created_at": analysis.created_at,
    }

@router.get("/history")
def get_analysis_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    analyses = session.exec(
        select(Analysis)
        .where(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
    ).all()

    return [
        {
            "id": analysis.id,
            "research_id": analysis.research_id,
            "created_at": analysis.created_at,
        }
        for analysis in analyses
    ]


@router.get("/{analysis_id}")
def get_analysis(
    analysis_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    analysis = session.get(Analysis, analysis_id)

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this analysis.",
        )

    return {
        "id": analysis.id,
        "research_id": analysis.research_id,
        "analysis": analysis.analysis,
        "created_at": analysis.created_at,
    }

