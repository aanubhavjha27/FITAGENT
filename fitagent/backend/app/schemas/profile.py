from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ProfileCreate(BaseModel):
    age:int
    gender:str
    height_cm:float
    current_weight_kg:float
    goal_weight_kg: float
    goal_type: str
    activity_level: str
    dietary_preference: str
    dietary_restrictions: list[str] = []
    available_equipment: str
    busy_days: list[str] = []
    health_conditions: list[str] = []
    workout_days_per_week: int = 4

class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    age: int
    gender: str
    height_cm: float
    current_weight_kg: float
    goal_weight_kg: float
    goal_type: str
    activity_level: str
    dietary_preference: str
    dietary_restrictions: list[str]
    available_equipment: str
    busy_days: list[str]
    health_conditions: list[str]
    workout_days_per_week: int

    class Config:
        from_attributes = True