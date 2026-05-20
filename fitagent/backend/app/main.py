from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import user
from app.models import profile
from app.models import plan
from app.api.v1 import auth
from app.api.v1 import profile as profile_router
from app.api.v1 import chat as chat_router

app = FastAPI(title="FitAgent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=["Auth"]
)

app.include_router(
    profile_router.router,
    prefix="/api/v1/profile",
    tags=["Profile"]
)

app.include_router(
    chat_router.router,
    prefix="/api/v1/chat",
    tags=["Chat"]
)

@app.get("/")
def root():
    return {"message": "FitAgent Backend Running ✅"}