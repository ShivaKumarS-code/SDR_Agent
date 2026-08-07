from datetime import datetime, UTC
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field


class Analysis(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    user_id: UUID
    research_id: UUID

    analysis: str

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC)
    )