import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from lightgbm import LGBMRegressor
from xgboost import XGBRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class MLForecastingEngine:
    """Multi-model ML forecasting engine (LightGBM, XGBoost, Random Forest) for 24h & 72h horizons."""

    def __init__(self):
        self.models_24h = {}
        self.models_72h = {}
        self.best_model_name_24h = "LightGBM"
        self.best_model_name_72h = "LightGBM"
        self.metrics_summary = {}
        self.test_eval_predictions_24h = []
        self.test_eval_predictions_72h = []
        self.feature_importances_24h = []
        self.feature_importances_72h = []



    @staticmethod
    def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
        mae = float(mean_absolute_error(y_true, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
        r2 = float(r2_score(y_true, y_pred))
        mape = float(np.mean(np.abs((y_true - y_pred) / (y_true + 1e-10))) * 100)
        return {
            "MAE": round(mae, 2),
            "RMSE": round(rmse, 2),
            "R2": round(r2, 2),
            "MAPE": round(mape, 2)
        }

    def train_horizon_arena(self, df_matrix: pd.DataFrame, target_col: str, horizon_name: str, test_days: int = 98) -> Dict[str, Dict[str, float]]:
        df_model = df_matrix.copy()
        if "date" in df_model.columns:
            df_model.drop(columns=["date"], inplace=True)

        features = [c for c in df_model.columns if c != target_col]
        X_train = df_model[features].iloc[:-test_days]
        y_train = df_model[target_col].iloc[:-test_days]
        X_test = df_model[features].iloc[-test_days:]
        y_test = df_model[target_col].iloc[-test_days:]

        models = {
            "LightGBM": LGBMRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42, verbose=-1),
            "XGBoost": XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42),
            "Random Forest": RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
        }

        horizon_metrics = {}
        best_mae = float("inf")
        best_name = "LightGBM"
        best_preds = None

        for name, model in models.items():
            model.fit(X_train, y_train)
            preds = np.maximum(model.predict(X_test), 0)
            metrics = self.calculate_metrics(y_test.values, preds)
            horizon_metrics[name] = metrics

            if metrics["MAE"] < best_mae:
                best_mae = metrics["MAE"]
                best_name = name
                best_preds = preds

        # Store test split predictions for evaluation chart
        test_dates = df_matrix["date"].iloc[-test_days:].dt.strftime("%Y-%m-%d").values
        eval_points = []
        for d, act, pred in zip(test_dates, y_test.values, best_preds):
            eval_points.append({
                "date": str(d),
                "actual": float(act),
                "predicted": float(pred)
            })

        # Calculate feature importances for the best model
        best_model_obj = models[best_name]
        importances = best_model_obj.feature_importances_
        total_imp = sum(importances) if sum(importances) > 0 else 1.0
        norm_importances = [float((val / total_imp) * 100) for val in importances]

        feature_importance_list = []
        for feat, imp in zip(features, norm_importances):
            # Categorize feature type
            feat_lower = feat.lower()
            if any(w in feat_lower for w in ["temp", "rain", "sun"]):
                feat_type = "WEATHER"
            elif any(c in feat_lower for c in ["holiday", "event", "closure", "op_status", "parties"]):
                feat_type = "CALENDAR"
            else:
                feat_type = "ENGINEERED"

            # Clean name for readable display on dashboard
            clean_name = feat.replace("Lag_Walkin_", "Lag ").replace("Rolling_", "").replace("_T1", "").replace("_T3", "").replace("_", " ")

            feature_importance_list.append({
                "name": clean_name,
                "value": round(imp, 1),
                "type": feat_type
            })

        feature_importance_list = sorted(feature_importance_list, key=lambda x: x["value"], reverse=True)[:5]

        if horizon_name == "24h":
            self.models_24h = models
            self.best_model_name_24h = best_name
            self.test_eval_predictions_24h = eval_points
            self.feature_importances_24h = feature_importance_list
        else:
            self.models_72h = models
            self.best_model_name_72h = best_name
            self.test_eval_predictions_72h = eval_points
            self.feature_importances_72h = feature_importance_list

        return horizon_metrics



    def predict_latest(self, df_24h: pd.DataFrame, df_72h: pd.DataFrame) -> Tuple[float, float, str, str]:
        """Runs predictions for the most recent observation in the feature matrices."""
        # 24h prediction
        features_24h = [c for c in df_24h.columns if c not in ["date", "Y_Target_Walkin_24h"]]
        X_latest_24h = df_24h[features_24h].tail(1)
        model_24h = self.models_24h.get(self.best_model_name_24h)
        pred_24h = float(np.maximum(model_24h.predict(X_latest_24h)[0], 0)) if model_24h else 0.0

        # 72h prediction
        features_72h = [c for c in df_72h.columns if c not in ["date", "Y_Target_Volatile_72h"]]
        X_latest_72h = df_72h[features_72h].tail(1)
        model_72h = self.models_72h.get(self.best_model_name_72h)
        pred_72h = float(np.maximum(model_72h.predict(X_latest_72h)[0], 0)) if model_72h else 0.0

        return round(pred_24h, 1), round(pred_72h, 1), self.best_model_name_24h, self.best_model_name_72h


forecasting_engine = MLForecastingEngine()
