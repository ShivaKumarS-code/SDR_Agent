from fastapi import FastAPI
from db.database import create_db_and_tables
from api.auth import router as auth_router
from api.debug.research import router as research_router
from api.debug.analysis import router as analysis_router
from api.debug.lead_score import router as lead_score_router
from api.generate import router as generate_router

app = FastAPI(title="SDR Agent API")
app.include_router(auth_router)
app.include_router(research_router)
app.include_router(analysis_router)
app.include_router(lead_score_router)
app.include_router(generate_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the SDR Agent API"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
