from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.auth import get_current_user
from crew.debug.lead_scoring_crew import run_lead_scoring
from db.models.user import User


class LeadScoreRequest(BaseModel):
    research: str
    analysis: str
    product_context: str


router = APIRouter(
    prefix="/lead-score",
    tags=["Lead Scoring"],
)


@router.post("/")
def score_lead(
    data: LeadScoreRequest,
    current_user: User = Depends(get_current_user),
):
    result = run_lead_scoring(
        research=data.research,
        analysis=data.analysis,
        product_context=data.product_context,
    )

    output = result.pydantic

    if output.score >= 80:
        priority = "High"
    elif output.score >= 50:
        priority = "Medium"
    else:
        priority = "Low"

    return {
        "score": output.score,
        "priority": priority,
        "confidence": output.confidence,
        "reasons": output.reasons,
    }
