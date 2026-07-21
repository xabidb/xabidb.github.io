from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field



# --- Health Schema ---
class HealthCheck(BaseModel):
    status: str = "ok"
    version: str = "2.0.0"
    data_dir_exists: bool
    data_dir_path: str


# --- Data Ingestion Schemas ---
class FootfallDataPoint(BaseModel):
    timestamp: datetime
    visitor_count: int = Field(ge=0, description="Observed footfall visitor count")
    temperature: Optional[float] = None
    is_holiday: Optional[bool] = False
    event_flag: Optional[bool] = False


class DataIngestRequest(BaseModel):
    filename: Optional[str] = Field(default="footfall_history.csv", description="Target filename in data folder")
    data: Optional[List[FootfallDataPoint]] = Field(default=None, description="Inline data points if not importing file")


class DataIngestResponse(BaseModel):
    status: str
    records_processed: int
    data_file_path: str
    message: str


# --- Forecast Schemas ---
class ForecastRequest(BaseModel):
    horizon_hours: int = Field(default=168, ge=1, le=8760, description="Forecast horizon in hours (default 7 days / 168 hrs)")
    model_type: str = Field(default="auto", description="Forecasting model type: 'auto', 'lightgbm', 'prophet', 'moving_average'")
    include_confidence_intervals: bool = True


class ForecastDataPoint(BaseModel):
    timestamp: datetime
    predicted_footfall: float = Field(ge=0, description="Predicted visitor footfall count")
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None


class ForecastResponse(BaseModel):
    status: str
    generated_at: datetime
    model_used: str
    horizon_hours: int
    total_predicted_visitors: float
    predictions: List[ForecastDataPoint]


# --- Evaluation Schemas ---
class EvaluationDataPoint(BaseModel):
    date: str
    actual: float
    predicted: float


class EvaluationResponse(BaseModel):
    status: str
    horizon: str
    best_model: str
    metrics: Dict[str, Dict[str, float]]
    test_eval_points: List[EvaluationDataPoint]


# --- Auth & User Schemas ---
class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    VIEWER = "viewer"


class UserLogin(BaseModel):
    email: str
    password: str


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: UserRole = UserRole.VIEWER


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None


