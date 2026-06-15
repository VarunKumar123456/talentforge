from fastapi import APIRouter
from fastapi import Depends

from app.auth.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def get_me(
    current_user=Depends(
        get_current_user
    )
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }