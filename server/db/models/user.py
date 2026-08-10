from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    name: str

    email: str = Field(index=True, unique=True)

    hashed_password: str

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )