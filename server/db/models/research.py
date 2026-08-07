from uuid import UUID, uuid4
from datetime import datetime, UTC

from sqlmodel import SQLModel, Field


class Research(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)

    user_id: UUID = Field(index=True, foreign_key="users.id")

    company_name: str
    research: str

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC)
    )