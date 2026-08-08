from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from api.auth import get_current_user
from crew.lead_scoring_crew import run_lead_scoring
from db.database import get_session
from db.models.analysis import Analysis
from db.models.lead_score import LeadScore
from db.models.research import Research
from db.models.user import User


router = APIRouter(
    prefix="/lead-score",
    tags=["Lead Scoring"],
)


@router.post("/{analysis_id}")
def score_lead(
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

    research = session.get(
        Research,
        analysis.research_id,
    )

    if research is None:
        raise HTTPException(
            status_code=404,
            detail="Research not found.",
        )

    product_context = """
    We are building an AI-powered SDR platform that helps sales teams
    research companies, identify prospects, score leads, and generate
    personalized outreach emails.
    """

    result = run_lead_scoring(
        research=research.research,
        analysis=analysis.analysis,
        product_context=product_context,
    )

    output = result.pydantic

    if output.score >= 80:
        priority = "High"
    elif output.score >= 50:
        priority = "Medium"
    else:
        priority = "Low"

    lead_score = LeadScore(
        user_id=current_user.id,
        analysis_id=analysis.id,
        score=output.score,
        priority=priority,
        confidence=output.confidence,
        reasons=output.reasons,
    )

    session.add(lead_score)
    session.commit()
    session.refresh(lead_score)

    return {
        "id": lead_score.id,
        "analysis_id": lead_score.analysis_id,
        "score": lead_score.score,
        "priority": lead_score.priority,
        "confidence": lead_score.confidence,
        "reasons": lead_score.reasons,
        "created_at": lead_score.created_at,
    }