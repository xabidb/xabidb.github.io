from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from typing import Optional, Dict, Any

from app.schemas import ForecastRequest, ForecastResponse
from app.ml.pipeline import pipeline_coordinator
from app.api.deps import require_roles
from app.db.models import User

router = APIRouter()

_latest_forecast_cache: Optional[ForecastResponse] = None


@router.post("/train")
async def train_models(
    current_user: User = Depends(require_roles(["admin"]))
):

    """Triggers ML pipeline preprocessing and multi-model training (LightGBM, XGBoost, Random Forest)."""
    try:
        results = pipeline_coordinator.train_pipeline()
        return {
            "status": "success",
            "message": "ML models trained successfully on backend datasets.",
            "details": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline training failed: {str(e)}")


@router.post("/generate", response_model=ForecastResponse)
async def generate_forecast(request: ForecastRequest = ForecastRequest()):
    """Generate a new footfall forecast using the notebook ML pipeline."""
    global _latest_forecast_cache
    try:
        forecast_result = pipeline_coordinator.generate_forecast(request)
        _latest_forecast_cache = forecast_result
        return forecast_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast generation failed: {str(e)}")


@router.get("/latest", response_model=ForecastResponse)
async def get_latest_forecast():
    """Retrieve the most recently generated forecast output."""
    global _latest_forecast_cache
    if _latest_forecast_cache is None:
        _latest_forecast_cache = pipeline_coordinator.generate_forecast(ForecastRequest())
    return _latest_forecast_cache


@router.get("/evaluation", response_model=Any)
async def get_pipeline_evaluation(horizon: str = "24h"):
    """Fetch test evaluation split metrics and predicted vs actual curves."""
    try:
        return pipeline_coordinator.get_evaluation_data(horizon)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

