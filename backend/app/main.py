import os

from fastapi import FastAPI
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import FRONTEND_URL
from app.database import Base, engine

from app.routers import auth
from app.routers import company
from app.routers import job
from app.routers import application
from app.routers import resume
from app.routers import profile
from app.routers import saved_job
from app.routers import notification
from app.routers import interview
from app.routers import admin
from app.routers import ai_match
from app.routers import message

from app.models import notification as notification_model
from app.models import interview as interview_model
from app.models import saved_job as saved_job_model
from app.models import message as message_model

from app.websocket_manager import manager


os.makedirs("uploads", exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentForge API",
    version="1.0.0"
)

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://talentforge-sepia.vercel.app",
]

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(allowed_origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(company.router)
app.include_router(job.router)
app.include_router(application.router)
app.include_router(resume.router)
app.include_router(profile.router)
app.include_router(saved_job.router)
app.include_router(notification.router)
app.include_router(interview.router)
app.include_router(admin.router)
app.include_router(ai_match.router)
app.include_router(message.router)


@app.websocket("/ws/messages/{application_id}")
async def websocket_messages(
    websocket: WebSocket,
    application_id: int
):
    await manager.connect(application_id, websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(application_id, websocket)


app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


@app.get("/")
def root():
    return {
        "message": "TalentForge API is running 🚀"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": "TalentForge"
    }