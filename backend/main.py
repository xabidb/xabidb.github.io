from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.router import api_router
from app.schemas import HealthCheck


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
    from app.db.session import engine, Base, AsyncSessionLocal
    from app.api.v1.endpoints.auth import seed_demo_users
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await seed_demo_users(session)
    yield
    # Shutdown actions



app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="Explorium StaffOpt V2 Backend API - Visitor Footfall Forecasting & Staff Planning Engine",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(f"{settings.API_V1_STR}/health", response_model=HealthCheck, tags=["Health"])
async def health_check():
    """Health verification endpoint."""
    return HealthCheck(
        status="ok",
        version="2.0.0",
        data_dir_exists=settings.DATA_DIR.exists(),
        data_dir_path=str(settings.DATA_DIR),
    )


# Include API Routers
app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
