from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSON
from sqlmodel import Field, SQLModel


class Generation(SQLModel, table=True):
    __tablename__ = "generations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)

    company_name: str
    company_context: str

    research: str
    analysis: str

    lead_score: int
    lead_priority: str
    lead_confidence: str
    lead_reasons: list[str] = Field(sa_column=Column(JSON, nullable=False))

    email_subject: str
    email_body: str

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )