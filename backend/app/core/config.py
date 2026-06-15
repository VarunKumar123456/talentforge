import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "super-secret-key-change-this"
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:varun123@localhost/job_portal_db"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")