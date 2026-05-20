from sqlalchemy import Integer,Column,String,Float,DateTime,ForeignKey
from sqlalchemy.dialects.postgresql import UUID,ARRAY
import uuid
from datetime import datetime
from app.core.database import Base

class HealthProfile(Base):
    __tablename__="health_profiles"

    id=Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    user_id=Column(UUID(as_uuid=True),ForeignKey("users.id"),unique=True,nullable=False)

    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    height_cm = Column(Float, nullable=False)
    current_weight_kg = Column(Float, nullable=False)
    goal_weight_kg = Column(Float, nullable=False)
    goal_type = Column(String, nullable=False)
    activity_level = Column(String, nullable=False)
    dietary_preference = Column(String, nullable=False)
    dietary_restrictions = Column(ARRAY(String), default=[])
    available_equipment = Column(String, nullable=False)
    busy_days = Column(ARRAY(String), default=[])
    health_conditions = Column(ARRAY(String), default=[])
    workout_days_per_week = Column(Integer, default=4)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)