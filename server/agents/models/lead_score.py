from pydantic import BaseModel, Field


class LeadScoreOutput(BaseModel):
    score: int = Field(ge=0, le=100)
    confidence: str
    reasons: list[str]