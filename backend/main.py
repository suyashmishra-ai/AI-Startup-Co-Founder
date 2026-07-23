import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.connection import init_db
from backend.api.router import api_router

app = FastAPI(
    title="AI Startup Co-Founder API",
    description="Intelligent full-stack API generating structured startup blueprints",
    version="1.0.0"
)

# CORS setup
cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router)
