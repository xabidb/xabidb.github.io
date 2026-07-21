from fastapi import APIRouter
from app.api.v1.endpoints import data, forecast, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Access Control"])
api_router.include_router(data.router, prefix="/data", tags=["Data Ingestion"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["Forecasting"])

