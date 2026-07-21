from typing import Dict, Any
from datetime import datetime, timedelta
import numpy as np
import pandas as pd


from app.ml.preprocessing import preprocessor
from app.ml.forecaster import forecasting_engine
from app.schemas import ForecastRequest, ForecastResponse, ForecastDataPoint


class MLPipelineCoordinator:
    """Coordinates data loading, feature matrix construction, model arena training, and forecast generation."""

    def __init__(self):
        self.is_trained = False
        self.last_trained_at = None
        self.metrics_24h = {}
        self.metrics_72h = {}
        self.df_24h = None
        self.df_72h = None

    def train_pipeline(self) -> Dict[str, Any]:
        """Executes full preprocessing and multi-model training arena."""
        self.df_24h, self.df_72h, _, _ = preprocessor.build_feature_matrix()

        # Train 24h & 72h arenas
        self.metrics_24h = forecasting_engine.train_horizon_arena(
            self.df_24h, target_col="Y_Target_Walkin_24h", horizon_name="24h"
        )
        self.metrics_72h = forecasting_engine.train_horizon_arena(
            self.df_72h, target_col="Y_Target_Volatile_72h", horizon_name="72h"
        )

        self.is_trained = True
        self.last_trained_at = datetime.now()

        return {
            "status": "success",
            "trained_at": self.last_trained_at.isoformat(),
            "best_model_24h": forecasting_engine.best_model_name_24h,
            "best_model_72h": forecasting_engine.best_model_name_72h,
            "metrics_24h": self.metrics_24h,
            "metrics_72h": self.metrics_72h,
        }

    def generate_forecast(self, request: ForecastRequest) -> ForecastResponse:
        """Generates forecast using trained models if available, or auto-trains first."""
        if not self.is_trained:
            self.train_pipeline()

        pred_24h, pred_72h, model_24h_name, model_72h_name = forecasting_engine.predict_latest(
            self.df_24h, self.df_72h
        )

        now = datetime.now().replace(minute=0, second=0, microsecond=0)
        predictions = []
        total_visitors = 0.0

        # Generate hourly curve from daily target baseline
        for h in range(1, request.horizon_hours + 1):
            future_time = now + timedelta(hours=h)
            hour = future_time.hour
            is_weekend = future_time.weekday() in (5, 6)

            # Use 24h model prediction for day 1, 72h model prediction for day 2-3
            daily_base = pred_24h if h <= 24 else pred_72h

            # Hourly diurnal distribution (active hours 9am - 6pm)
            if 9 <= hour <= 18:
                hourly_share = np.sin((hour - 9) * np.pi / 9) / 6.0
            else:
                hourly_share = 0.01

            weekend_boost = 1.3 if is_weekend else 1.0
            predicted_count = max(0.0, round((daily_base * hourly_share) * weekend_boost, 1))

            lower = round(predicted_count * 0.85, 1) if request.include_confidence_intervals else None
            upper = round(predicted_count * 1.15, 1) if request.include_confidence_intervals else None
            total_visitors += predicted_count

            predictions.append(ForecastDataPoint(
                timestamp=future_time,
                predicted_footfall=predicted_count,
                lower_bound=lower,
                upper_bound=upper
            ))

        return ForecastResponse(
            status="success",
            generated_at=now,
            model_used=f"{model_24h_name} (24h) & {model_72h_name} (72h)",
            horizon_hours=request.horizon_hours,
            total_predicted_visitors=round(total_visitors, 1),
            predictions=predictions
        )

    def get_evaluation_data(self, horizon: str = "24h") -> Dict[str, Any]:
        if not self.is_trained:
            self.train_pipeline()
            
        if horizon == "24h":

            return {
                "status": "success",
                "horizon": "24h",
                "best_model": forecasting_engine.best_model_name_24h,
                "metrics": self.metrics_24h,
                "test_eval_points": forecasting_engine.test_eval_predictions_24h,
                "feature_importances": forecasting_engine.feature_importances_24h
            }
        else:
            return {
                "status": "success",
                "horizon": "72h",
                "best_model": forecasting_engine.best_model_name_72h,
                "metrics": self.metrics_72h,
                "test_eval_points": forecasting_engine.test_eval_predictions_72h,
                "feature_importances": forecasting_engine.feature_importances_72h
            }



pipeline_coordinator = MLPipelineCoordinator()

