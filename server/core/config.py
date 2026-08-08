from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    _raw_db_url = os.getenv("DATABASE_URL", "")
    DATABASE_URL = (
        _raw_db_url.replace("postgresql://", "postgresql+psycopg://", 1)
        if _raw_db_url.startswith("postgresql://")
        else _raw_db_url
    )
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    )


settings = Settings()