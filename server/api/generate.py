from fastapi import APIRouter, Depends
from pydantic import BaseModel
from crew import run_research
from api.auth import get_current_user
from db.models.user import User
from db.models.research import Research
from sqlmodel import Session
from db.database import get_session

class ResearchRequest(BaseModel):
    company: str

router = APIRouter(prefix='/generate')

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
    