import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.base import Base
import backend.models  # Ensures all models are registered with Base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./startup_cofounder.db")

# For SQLite, ensure check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
