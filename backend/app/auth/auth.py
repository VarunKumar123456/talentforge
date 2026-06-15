from app.auth.jwt_handler import create_access_token

def login(user):
    access_token = create_access_token({
        "sub": user.email,
        "role": user.role   # ✅ IMPORTANT FIX
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }