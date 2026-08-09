from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from uuid import UUID

from api.auth import get_current_user
from crew.sdr_crew import run_sdr_pipeline
from db.database import get_session
from db.models.generation import Generation
from db.models.user import User


router = APIRouter(prefix="/generate", tags=["Generations"])


class GenerateRequest(BaseModel):
    company: str
    company_context: str


@router.get("/")
def get_all_generations(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    generations = session.exec(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .order_by(Generation.created_at.desc())
    ).all()

    return [
        {
            "id": str(g.id),
            "company": g.company_name,
            "company_context": g.company_context,
            "research": g.research,
            "analysis": g.analysis,
            "lead_score": {
                "score": g.lead_score,
                "priority": g.lead_priority,
                "confidence": g.lead_confidence,
                "reasons": g.lead_reasons,
            },
            "email": {
                "subject": g.email_subject,
                "body": g.email_body,
            },
            "created_at": g.created_at.isoformat(),
        }
        for g in generations
    ]


@router.get("/{generation_id}")
def get_generation_by_id(
    generation_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    generation = session.exec(
        select(Generation)
        .where(Generation.id == generation_id)
        .where(Generation.user_id == current_user.id)
    ).first()

    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    return {
        "id": str(generation.id),
        "company": generation.company_name,
        "company_context": generation.company_context,
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
        "created_at": generation.created_at.isoformat(),
    }


@router.post("/")
def generate(
    data: GenerateRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    try:
        result = run_sdr_pipeline(
            company=data.company,
            product_context=data.company_context,
        )

        research_txt = result.get("research")
        if not research_txt or not isinstance(research_txt, str) or not research_txt.strip():
            raise ValueError("Research agent output is missing or empty")

        analysis_txt = result.get("analysis")
        if not analysis_txt or not isinstance(analysis_txt, str) or not analysis_txt.strip():
            raise ValueError("Analysis agent output is missing or empty")

        score_obj = result.get("lead_score")
        if not score_obj or not hasattr(score_obj, "score") or not hasattr(score_obj, "confidence") or not hasattr(score_obj, "reasons"):
            raise ValueError("Lead scoring agent output is missing required fields")

        score_val = getattr(score_obj, "score", None)
        if score_val is None or not isinstance(score_val, (int, float)):
            raise ValueError("Lead scoring score is invalid")
        score_val = int(score_val)

        confidence_val = getattr(score_obj, "confidence", None)
        if not confidence_val or not isinstance(confidence_val, str):
            raise ValueError("Lead scoring confidence is missing or invalid")

        reasons_val = getattr(score_obj, "reasons", None)
        if not isinstance(reasons_val, list):
            raise ValueError("Lead scoring reasons must be a list")

        email_obj = result.get("email")
        if not isinstance(email_obj, dict):
            raise ValueError("Email agent output is missing or invalid")

        email_subject = email_obj.get("subject")
        email_body = email_obj.get("body")
        if not email_subject or not isinstance(email_subject, str) or not email_subject.strip():
            raise ValueError("Email subject is missing or empty")
        if not email_body or not isinstance(email_body, str) or not email_body.strip():
            raise ValueError("Email body is missing or empty")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline generation failed: {str(e)}")

    if score_val >= 70:
        priority = "High"
    elif score_val >= 40:
        priority = "Medium"
    else:
        priority = "Low"

    generation = Generation(
        user_id=current_user.id,
        company_name=data.company,
        company_context=data.company_context,
        research=research_txt,
        analysis=analysis_txt,
        lead_score=score_val,
        lead_priority=priority,
        lead_confidence=confidence_val,
        lead_reasons=reasons_val,
        email_subject=email_subject,
        email_body=email_body,
    )

    session.add(generation)
    session.commit()
    session.refresh(generation)

    return {
        "id": str(generation.id),
        "company": generation.company_name,
        "company_context": generation.company_context,
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
        "created_at": generation.created_at.isoformat(),
    }