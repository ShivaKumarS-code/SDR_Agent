from datetime import datetime, UTC
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from sqlmodel import Field, SQLModel


class LeadScore(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    user_id: UUID
    analysis_id: UUID

    score: int
    priority: str
    confidence: str

    reasons: list[str] = Field(
        sa_column=Column(JSON)
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC)
    )