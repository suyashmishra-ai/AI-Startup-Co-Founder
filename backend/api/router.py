from fastapi import APIRouter
from backend.api.health import router as health_router
from backend.api.auth import router as auth_router
from backend.api.projects import router as projects_router
from backend.api.analyses import router as analyses_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(analyses_router)
