from fastapi import HTTPException


def require_role(user, allowed_roles: list):

    if user.role not in allowed_roles:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to perform this action"
        )