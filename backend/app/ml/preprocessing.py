import re
from pathlib import Path
from typing import Dict, Tuple, Optional, List
import numpy as np
import pandas as pd

from app.core.config import settings


class DataPreprocessor:
    """Implements data cleaning, atomic ticket regex parsing, weather rollup, and horizon lag engineering from VisitorPrediction.ipynb."""

    ALLOWED_TICKETS = [
        "science ticket - general admission",
        "vr ticket - vr session",
        "science ticket - 4 person admission",
        "conquer your fears ticket - conquer your fears",
        "urban climb ticket - urban climb",
        "science ticket - 5 person admission",
        "ar ticket - ar admission",
        "science ticket - carer pass",
        "urban climb - xplorer - urban climb",
        "science ticket - 6 person admission",
        "science ticket - senior citizen (65+)",
        "science ticket - 7 person admission",
        "science party - science party ticket",
        "climbing party - urban climb - urban climb party",
        "xplorer ticket - general admission",
        "climbing party - conquer your fears - conquer your fears party",
        "vr ticket - vr session - walk in",
        "ar ticket - complimentary",
        "science party! - general admission",
        "climbing party - urban climb! - general admission",
        "urban climb ticket - urban climb - walk in",
        "science party 3 - general admission",
        "climbing party - conquer your fears! - general admission",
    ]

    TICKET_MAPPING = {
        "science ticket - general admission": "Science_Ticket",
        "science ticket - 4 person admission": "Science_Ticket",
        "science ticket - 5 person admission": "Science_Ticket",
        "science ticket - 6 person admission": "Science_Ticket",
        "science ticket - 7 person admission": "Science_Ticket",
        "science ticket - carer pass": "Science_Ticket",
        "science ticket - senior citizen (65+)": "Science_Ticket",
        "science party - science party ticket": "Science_Party_Ticket",
        "science party! - general admission": "Science_Party_Ticket",
        "science party 3 - general admission": "Science_Party_Ticket",
        "urban climb ticket - urban climb": "UC_Ticket",
        "urban climb ticket - urban climb - walk in": "UC_Ticket",
        "urban climb - xplorer - urban climb": "UC_Ticket",
        "climbing party - urban climb - urban climb party": "UC_Party_Ticket",
        "climbing party - urban climb! - general admission": "UC_Party_Ticket",
        "conquer your fears ticket - conquer your fears": "CYF_Ticket",
        "xplorer ticket - general admission": "CYF_Ticket",
        "climbing party - conquer your fears - conquer your fears party": "CYF_Party_Ticket",
        "climbing party - conquer your fears! - general admission": "CYF_Party_Ticket",
        "vr ticket - vr session": "VR_Ticket",
        "vr ticket - vr session - walk in": "VR_Ticket",
        "ar ticket - ar admission": "AR_Ticket",
        "ar ticket - complimentary": "AR_Ticket",
    }

    def __init__(self, data_dir: Path = settings.DATA_DIR):
        self.data_dir = data_dir

    def _safe_read(self, filename: str) -> pd.DataFrame:
        file_path = self.data_dir / filename
        if not file_path.exists():
            raise FileNotFoundError(f"Required dataset '{filename}' not found in {self.data_dir}")
        
        encodings = ["utf-8", "windows-1252", "latin1", "cp1252"]
        for enc in encodings:
            try:
                return pd.read_csv(file_path, encoding=enc)
            except Exception:
                continue
        return pd.read_csv(file_path, encoding_errors="replace")

    @staticmethod
    def _extract_quantity_and_multiplier(text: str) -> Tuple[int, str]:
        text_str = str(text).strip()
        match_base = re.match(r"^(\d+)\s*x\s*(.*)$", text_str, re.IGNORECASE)
        if match_base:
            quantity = int(match_base.group(1))
            ticket_name = match_base.group(2).strip()
        else:
            quantity = 1
            ticket_name = text_str

        match_multiplier = re.search(r"(\d+)\s*Person", ticket_name, re.IGNORECASE)
        if match_multiplier:
            multiplier = int(match_multiplier.group(1))
            quantity = quantity * multiplier

        return quantity, ticket_name

    def load_and_clean_bookings(self) -> pd.DataFrame:
        df_raw = self._safe_read("Explorium_BookingsCore.csv")
        
        # Valid status filtering
        valid_statuses = ["Fully Paid", "Partially Paid", "Complimentary"]
        if "Status" in df_raw.columns:
            df_raw = df_raw[df_raw["Status"].isin(valid_statuses)].copy()

        # Date normalization
        df_raw["Booking_Date"] = pd.to_datetime(df_raw["Booking Date"], format="mixed", dayfirst=True).dt.normalize()
        df_raw["Transaction_Date"] = pd.to_datetime(df_raw["Transaction Date"], format="mixed", dayfirst=True).dt.normalize()

        df_clean = df_raw[["Items", "Booking_Date", "Transaction_Date", "Booking ID"]].copy()
        df_clean["date"] = df_clean["Booking_Date"].dt.date
        df_clean = df_clean.sort_values(by="date").reset_index(drop=True)

        # Atomic transformation (Explode commas)
        df_clean["Items"] = df_clean["Items"].astype(str).str.strip()
        df_atomic = df_clean.assign(Items=df_clean["Items"].str.split(",")).explode("Items")
        df_atomic["Items"] = df_atomic["Items"].str.strip()

        # Quantity and ticket extraction
        extracted = df_atomic["Items"].apply(self._extract_quantity_and_multiplier)
        df_atomic["quantity"] = [e[0] for e in extracted]
        df_atomic["ticket_name"] = [e[1] for e in extracted]

        # Allowed ticket filtering
        df_atomic["ticket_match_temp"] = df_atomic["ticket_name"].astype(str).str.strip().str.lower()
        df_filtered = df_atomic[df_atomic["ticket_match_temp"].isin(self.ALLOWED_TICKETS)].copy()
        df_filtered["ticket_category"] = df_filtered["ticket_match_temp"].map(self.TICKET_MAPPING)

        # Macro Category tagging
        def categorize(ticket: str) -> str:
            t_lower = str(ticket).lower()
            if "party" in t_lower:
                return "Party"
            elif "science" in t_lower:
                return "Science"
            else:
                return "Activities"

        df_filtered["Macro_Category"] = df_filtered["ticket_category"].apply(categorize)
        df_filtered.drop(columns=["ticket_match_temp"], inplace=True)
        return df_filtered.reset_index(drop=True)

    def build_feature_matrix(self) -> Tuple[pd.DataFrame, pd.DataFrame, List[str], List[str]]:

        """Builds continuous 24h and 72h horizon matrices for training."""
        df_bookings = self.load_and_clean_bookings()
        df_calendar = self._safe_read("Master_Calendar.csv")
        df_weather = self._safe_read("Casement_Airport_Weather_Dataset.csv")

        # Lead time calculation & Sanity filter
        df_bookings["Lead_Time_Days"] = (df_bookings["Booking_Date"] - df_bookings["Transaction_Date"]).dt.days
        df_bookings = df_bookings[df_bookings["Lead_Time_Days"] >= 0].copy()

        # Target & Feature Aggregations
        target_24h = df_bookings[
            (df_bookings["Macro_Category"] == "Activities") & (df_bookings["Lead_Time_Days"] == 0)
        ].groupby("Booking_Date")["quantity"].sum().reset_index(name="Y_Target_Walkin_24h")

        target_72h = df_bookings[
            (df_bookings["Macro_Category"] == "Activities") & (df_bookings["Lead_Time_Days"] < 3)
        ].groupby("Booking_Date")["quantity"].sum().reset_index(name="Y_Target_Volatile_72h")

        feat_science_24h = df_bookings[
            (df_bookings["Macro_Category"] == "Science") & (df_bookings["Lead_Time_Days"] >= 1)
        ].groupby("Booking_Date")["quantity"].sum().reset_index(name="X_Science_Known_24h")

        feat_science_72h = df_bookings[
            (df_bookings["Macro_Category"] == "Science") & (df_bookings["Lead_Time_Days"] >= 3)
        ].groupby("Booking_Date")["quantity"].sum().reset_index(name="X_Science_Known_72h")

        feat_parties = df_bookings[
            (df_bookings["Macro_Category"] == "Party")
        ].groupby("Booking_Date")["quantity"].sum().reset_index(name="X_Known_Parties")

        # Weather rollup
        df_weather["datetime"] = pd.to_datetime(df_weather["date"], dayfirst=True)
        df_weather["date_dt"] = df_weather["datetime"].dt.normalize()
        df_weather_daily = df_weather.groupby("date_dt").agg(
            Daily_Total_Rain_mm=("rain", "sum"),
            Daily_Max_Temp_C=("temp", "max"),
            Daily_Mean_Temp_C=("temp", "mean"),
            Daily_Total_Sun_hrs=("sun", "sum"),
        ).reset_index().rename(columns={"date_dt": "date"})

        # Master calendar setup
        df_calendar["date"] = pd.to_datetime(df_calendar["date"]).dt.normalize()
        df_master = pd.merge(df_calendar, df_weather_daily, on="date", how="left")


        # Merge targets and features
        for df, key in [
            (target_24h, "Booking_Date"),
            (target_72h, "Booking_Date"),
            (feat_science_24h, "Booking_Date"),
            (feat_science_72h, "Booking_Date"),
            (feat_parties, "Booking_Date"),
        ]:
            df_master = pd.merge(df_master, df, left_on="date", right_on=key, how="left")
            if key in df_master.columns and key != "date":
                df_master.drop(columns=[key], inplace=True)

        # Impute zeros for ticket counts
        ticket_cols = [
            "Y_Target_Walkin_24h", "Y_Target_Volatile_72h",
            "X_Science_Known_24h", "X_Science_Known_72h", "X_Known_Parties"
        ]
        df_master[ticket_cols] = df_master[ticket_cols].fillna(0)

        # Weather interpolation
        weather_cols = ["Daily_Total_Rain_mm", "Daily_Mean_Temp_C", "Daily_Max_Temp_C", "Daily_Total_Sun_hrs"]
        df_master[weather_cols] = df_master[weather_cols].interpolate(method="linear").bfill().ffill()

        # Lag Engineering & Features
        df_feat = df_master.sort_values("date").copy()

        df_feat["Lag_Walkin_1d"] = df_feat["Y_Target_Walkin_24h"].shift(1)
        df_feat["Lag_Walkin_2d"] = df_feat["Y_Target_Walkin_24h"].shift(2)
        df_feat["Lag_Walkin_3d"] = df_feat["Y_Target_Walkin_24h"].shift(3)
        df_feat["Lag_Walkin_7d"] = df_feat["Y_Target_Walkin_24h"].shift(7)
        df_feat["Lag_Walkin_14d"] = df_feat["Y_Target_Walkin_24h"].shift(14)
        df_feat["Lag_Walkin_21d"] = df_feat["Y_Target_Walkin_24h"].shift(21)
        df_feat["Lag_Walkin_28d"] = df_feat["Y_Target_Walkin_24h"].shift(28)

        new_24h_rolling = []
        new_72h_rolling = []

        for window in [2, 3, 7, 14, 30, 60, 90]:
            # 24h Model (T-1)
            c_mean_t1 = f"Rolling_mean_{window}d_T1"
            c_max_t1 = f"Rolling_max_{window}d_T1"
            c_std_t1 = f"Rolling_std_{window}d_T1"
            df_feat[c_mean_t1] = df_feat["Lag_Walkin_1d"].rolling(window, min_periods=1).mean()
            df_feat[c_max_t1] = df_feat["Lag_Walkin_1d"].rolling(window, min_periods=1).max()
            df_feat[c_std_t1] = df_feat["Lag_Walkin_1d"].rolling(window, min_periods=1).std().fillna(0)
            new_24h_rolling.extend([c_mean_t1, c_max_t1, c_std_t1])

            # 72h Model (T-3)
            c_mean_t3 = f"Rolling_mean_{window}d_T3"
            c_max_t3 = f"Rolling_max_{window}d_T3"
            c_std_t3 = f"Rolling_std_{window}d_T3"
            df_feat[c_mean_t3] = df_feat["Lag_Walkin_3d"].rolling(window, min_periods=1).mean()
            df_feat[c_max_t3] = df_feat["Lag_Walkin_3d"].rolling(window, min_periods=1).max()
            df_feat[c_std_t3] = df_feat["Lag_Walkin_3d"].rolling(window, min_periods=1).std().fillna(0)
            new_72h_rolling.extend([c_mean_t3, c_max_t3, c_std_t3])

        df_feat["Science_Booking_Velocity_24h"] = df_feat["X_Science_Known_24h"] - df_feat["X_Science_Known_72h"]

        # Cyclical encoding
        df_feat["dow"] = df_feat["date"].dt.dayofweek
        df_feat["month"] = df_feat["date"].dt.month
        df_feat["doy"] = df_feat["date"].dt.dayofyear

        df_feat["dow_sin"] = np.sin(2 * np.pi * df_feat["dow"] / 7)
        df_feat["dow_cos"] = np.cos(2 * np.pi * df_feat["dow"] / 7)
        df_feat["month_sin"] = np.sin(2 * np.pi * (df_feat["month"] - 1) / 12)
        df_feat["month_cos"] = np.cos(2 * np.pi * (df_feat["month"] - 1) / 12)
        df_feat["doy_sin"] = np.sin(2 * np.pi * df_feat["doy"] / 365)
        df_feat["doy_cos"] = np.cos(2 * np.pi * df_feat["doy"] / 365)
        cyclical_cols = ["dow_sin", "dow_cos", "month_sin", "month_cos", "doy_sin", "doy_cos"]

        # EWMA
        for span in [7, 14, 30]:
            c_ewma_t1 = f"EWMA_{span}d_T1"
            c_ewma_t3 = f"EWMA_{span}d_T3"
            df_feat[c_ewma_t1] = df_feat["Lag_Walkin_1d"].ewm(span=span, adjust=False).mean()
            df_feat[c_ewma_t3] = df_feat["Lag_Walkin_3d"].ewm(span=span, adjust=False).mean()
            new_24h_rolling.append(c_ewma_t1)
            new_72h_rolling.append(c_ewma_t3)

        # Filter op_status > 0 and drop NaNs
        df_feat = df_feat[df_feat["op_status"] > 0].copy()
        df_feat.dropna(inplace=True)
        df_feat.reset_index(drop=True, inplace=True)

        features_shared = ["date", "op_status", "is_school_holiday", "is_bank_holiday", "X_Known_Parties"]
        features_weather = ["Daily_Max_Temp_C", "Daily_Total_Rain_mm", "Daily_Total_Sun_hrs"]
        features_deep_lags = ["Lag_Walkin_7d", "Lag_Walkin_14d", "Lag_Walkin_21d", "Lag_Walkin_28d"]

        cols_24h_model = features_shared + features_weather + features_deep_lags + cyclical_cols + [
            "X_Science_Known_24h", "Lag_Walkin_1d", "Lag_Walkin_2d", "Lag_Walkin_3d",
            "Science_Booking_Velocity_24h", "Y_Target_Walkin_24h"
        ] + new_24h_rolling

        cols_72h_model = features_shared + features_weather + features_deep_lags + cyclical_cols + [
            "X_Science_Known_72h", "Lag_Walkin_3d", "Y_Target_Volatile_72h"
        ] + new_72h_rolling

        df_24h = df_feat[cols_24h_model].copy()
        df_72h = df_feat[cols_72h_model].copy()

        return df_24h, df_72h, cols_24h_model, cols_72h_model


preprocessor = DataPreprocessor()
