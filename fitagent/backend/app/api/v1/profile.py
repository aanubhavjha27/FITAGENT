from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.profile import HealthProfile
from app.schemas.profile import ProfileCreate, ProfileResponse

router = APIRouter()

@router.post("/setup", response_model=ProfileResponse, status_code=201)
def create_profile(
    request: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if profile already exists
    existing = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Profile already exists"
        )

    profile = HealthProfile(
        user_id=current_user.id,
        age=request.age,
        gender=request.gender,
        height_cm=request.height_cm,
        current_weight_kg=request.current_weight_kg,
        goal_weight_kg=request.goal_weight_kg,
        goal_type=request.goal_type,
        activity_level=request.activity_level,
        dietary_preference=request.dietary_preference,
        dietary_restrictions=request.dietary_restrictions,
        available_equipment=request.available_equipment,
        busy_days=request.busy_days,
        health_conditions=request.health_conditions,
        workout_days_per_week=request.workout_days_per_week,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile

@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return profile