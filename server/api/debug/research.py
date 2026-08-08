from fastapi import APIRouter, Depends
from pydantic import BaseModel
from crew.debug.research_crew import run_research
from api.auth import get_current_user
from db.models.user import User


class ResearchRequest(BaseModel):
    company: str


router = APIRouter(prefix='/research')


@router.post("/")
def generate(
    data: ResearchRequest,
    current_user: User = Depends(get_current_user),
):
    result = run_research(data.company)

    return {
        "company": data.company,
        "report": result.raw,
    }
