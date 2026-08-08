from sqlmodel import SQLModel, Session, create_engine
from db.models.user import User
from db.models.research import Research
from db.models.analysis import Analysis
from db.models.lead_score import LeadScore

from core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,
)


def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)