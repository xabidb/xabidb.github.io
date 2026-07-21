from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd

from app.core.config import settings
from app.schemas import FootfallDataPoint, DataIngestResponse


class DataIngestionService:
    """Modular service for loading and processing historical footfall datasets."""

    def __init__(self, data_dir: Path = settings.DATA_DIR):
        self.data_dir = data_dir
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def save_inline_data(self, data_points: List[FootfallDataPoint], filename: str = "footfall_history.csv") -> DataIngestResponse:
        file_path = self.data_dir / filename
        records = [dp.model_dump() for dp in data_points]
        df = pd.DataFrame(records)
        df.to_csv(file_path, index=False)
        return DataIngestResponse(
            status="success",
            records_processed=len(df),
            data_file_path=str(file_path),
            message=f"Saved {len(df)} records to {filename}"
        )

    def load_latest_dataset(self, filename: Optional[str] = None) -> pd.DataFrame:
        if filename:
            file_path = self.data_dir / filename
            if not file_path.exists():
                raise FileNotFoundError(f"Dataset file {filename} not found in {self.data_dir}")
            return self._safe_read_csv(file_path)

        # Look for any CSV file in data directory
        csv_files = list(self.data_dir.glob("*.csv"))
        if not csv_files:
            # Return empty DataFrame with expected structure if no file present yet
            return pd.DataFrame(columns=["timestamp", "visitor_count", "temperature", "is_holiday", "event_flag"])

        # Return latest modified CSV
        latest_file = max(csv_files, key=lambda f: f.stat().st_mtime)
        return self._safe_read_csv(latest_file)

    def _safe_read_csv(self, file_path: Path) -> pd.DataFrame:
        encodings = ["utf-8", "latin1", "cp1252", "iso-8859-1"]
        for enc in encodings:
            try:
                return pd.read_csv(file_path, encoding=enc)
            except (UnicodeDecodeError, Exception):
                continue
        return pd.read_csv(file_path, encoding_errors="replace")



ingestion_service = DataIngestionService()
