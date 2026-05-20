from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    email:str
    password:str
    full_name:str

class UserResponse(BaseModel):
    id:UUID
    full_name:str
    created_at:datetime
    email:str

    class Config:
        from_attributes=True

class LoginRequest(BaseModel):
    email:str
    password:str

class TokenResponse(BaseModel):
    access_token:str
    token_type:str="bearer" 
