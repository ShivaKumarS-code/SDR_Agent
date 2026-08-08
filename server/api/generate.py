from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from api.auth import get_current_user
from crew.sdr_crew import run_sdr_pipeline
from db.database import get_session
from db.models.generation import Generation
from db.models.user import User


router = APIRouter(prefix="/generate")


class GenerateRequest(BaseModel):
    company: str
    company_context: str


@router.post("/")
def generate(
    data: GenerateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    result = run_sdr_pipeline(
        company=data.company,
        product_context=data.company_context,
    )

    score = result["lead_score"]

    if score.score >= 70:
        priority = "High"
    elif score.score >= 40:
        priority = "Medium"
    else:
        priority = "Low"

    email = result["email"]

    generation = Generation(
        user_id=current_user.id,
        company_name=data.company,
        company_context=data.company_context,
        research=result["research"],
        analysis=result["analysis"],
        lead_score=score.score,
        lead_priority=priority,
        lead_confidence=score.confidence,
        lead_reasons=score.reasons,
        email_subject=email["subject"],
        email_body=email["body"],
    )

    session.add(generation)
    session.commit()
    session.refresh(generation)

    return {
        "id": generation.id,
        "company": generation.company_name,
        "research": generation.research,
        "analysis": generation.analysis,
        "lead_score": {
            "score": generation.lead_score,
            "priority": generation.lead_priority,
            "confidence": generation.lead_confidence,
            "reasons": generation.lead_reasons,
        },
        "email": {
            "subject": generation.email_subject,
            "body": generation.email_body,
        },
        "created_at": generation.created_at,
    }