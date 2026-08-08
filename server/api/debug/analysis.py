from fastapi import APIRouter, Depends
from pydantic import BaseModel

from api.auth import get_current_user
from crew.debug.analysis_crew import run_analysis
from db.models.user import User


class AnalysisRequest(BaseModel):
    research: str


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.post("/")
def analyze_company(
    data: AnalysisRequest,
    current_user: User = Depends(get_current_user),
):
    result = run_analysis(data.research)

    return {
        "analysis": result.raw,
    }
