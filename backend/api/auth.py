from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.user import User
from backend.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    RefreshTokenRequest,
    AuthResponse,
    UserResponse,
    TokenPair,
    StatusResponse
)
from backend.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed = get_password_hash(req.password)
    user = User(email=req.email.lower(), hashed_password=hashed, name=req.name)
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})

    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenPair(access_token=access_token, refresh_token=refresh_token)
    )

@router.post("/login", response_model=AuthResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.id})
    refresh_token = create_refresh_token({"sub": user.id})

    return AuthResponse(
        user=UserResponse.model_validate(user),
        tokens=TokenPair(access_token=access_token, refresh_token=refresh_token)
    )

@router.post("/refresh", response_model=Dict[str, TokenPair])
def refresh_token_endpoint(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = verify_token(req.refresh_token, token_type="refresh")
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    new_access = create_access_token({"sub": user.id})
    new_refresh = create_refresh_token({"sub": user.id})
    return {"tokens": TokenPair(access_token=new_access, refresh_token=new_refresh)}

@router.post("/logout", response_model=StatusResponse)
def logout():
    return StatusResponse(success=True)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
