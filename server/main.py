from fastapi import FastAPI
from db.database import create_db_and_tables
from api.auth import router as auth_router

app = FastAPI(title="SDR Agent API")
app.include_router(auth_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the SDR Agent API"}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

