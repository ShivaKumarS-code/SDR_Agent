from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from crew.research_crew import run_research
from api.auth import get_current_user
from db.models.user import User
from db.models.research import Research
from sqlmodel import Session, select
from db.database import get_session
from uuid import UUID

class ResearchRequest(BaseModel):
    company: str

router = APIRouter(prefix='/research')

@router.post("/")
def generate(data: ResearchRequest, current_user: User = Depends(get_current_user),
   session:Session = Depends(get_session)
):
    result = run_research(data.company)
    
    research = Research(
        user_id=current_user.id,
        company_name=data.company,
        research=result.raw
    )

    session.add(research)
    session.commit()
    session.refresh(research)

    return {
        "id": research.id,
        "company": research.company_name,
        "report": research.research,
        "created_at": research.created_at,
    }
    

@router.get("/history")
def get_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    research = session.exec(
        select(Research)
        .where(Research.user_id == current_user.id)
        .order_by(Research.created_at.desc())
    ).all()

    return [
        {
            "id": item.id,
            "company": item.company_name,
            "created_at": item.created_at,
        }
        for item in research
    ]

@router.get("/{research_id}")
def get_research(
    research_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    research = session.get(Research, research_id)

    if research is None:
        raise HTTPException(
            status_code=404,
            detail="Research not found",
        )

    if research.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this research.",
        )

    return {
        "id": research.id,
        "company": research.company_name,
        "report": research.research,
        "created_at": research.created_at,
    }