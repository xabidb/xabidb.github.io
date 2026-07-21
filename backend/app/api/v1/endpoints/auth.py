from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db, Base, engine
from app.db.models import User
from app.schemas import UserLogin, UserResponse, Token, UserCreate
from app.core.security import verify_password, hash_password, create_access_token
from app.api.deps import get_current_user, require_roles

router = APIRouter()


async def seed_demo_users(db: AsyncSession):
    """Seed pre-configured demo users if they do not exist."""
    demo_users = [
        {
            "email": "admin@explorium.io",
            "full_name": "System Administrator",
            "password": "adminpassword",
            "role": "admin",
        },
        {
            "email": "manager@explorium.io",
            "full_name": "Store Manager",
            "password": "managerpassword",
            "role": "manager",
        },
        {
            "email": "viewer@explorium.io",
            "full_name": "Guest Viewer",
            "password": "viewerpassword",
            "role": "viewer",
        },
    ]

    for user_data in demo_users:
        result = await db.execute(select(User).where(User.email == user_data["email"]))
        existing_user = result.scalars().first()
        if not existing_user:
            new_user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=hash_password(user_data["password"]),
                role=user_data["role"],
                is_active=True,
            )
            db.add(new_user)
    await db.commit()


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user credentials and return JWT access token."""
    # Always ensure DB tables exist and default demo users are seeded
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_demo_users(db)

    result = await db.execute(select(User).where(User.email == credentials.email.lower().strip()))
    user = result.scalars().first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive.",
        )

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return Token(access_token=access_token, token_type="bearer", user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve active authenticated user details."""
    return UserResponse.model_validate(current_user)


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    admin_user: User = Depends(require_roles(["admin"]))
):
    """Retrieve list of all system users (Admin permission required)."""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [UserResponse.model_validate(u) for u in users]
