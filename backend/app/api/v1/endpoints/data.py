from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import Optional
from pathlib import Path
import shutil

from app.schemas import DataIngestRequest, DataIngestResponse
from app.ml.ingestion import ingestion_service
from app.core.config import settings
from app.api.deps import require_roles
from app.db.models import User

router = APIRouter()


@router.post("/ingest", response_model=DataIngestResponse)
async def ingest_data(
    payload: Optional[DataIngestRequest] = None,
    current_user: User = Depends(require_roles(["admin", "manager"]))
):

    """Ingest historical footfall data from payload or existing data folder."""
    if payload and payload.data:
        return ingestion_service.save_inline_data(payload.data, payload.filename or "footfall_history.csv")
    
    # Try loading existing file in backend/data/
    try:
        filename = payload.filename if payload else "footfall_history.csv"
        df = ingestion_service.load_latest_dataset(filename)
        return DataIngestResponse(
            status="success",
            records_processed=len(df),
            data_file_path=str(settings.DATA_DIR / filename),
            message=f"Successfully loaded {len(df)} records from existing data file."
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")


@router.post("/upload", response_model=DataIngestResponse)
async def upload_csv_file(file: UploadFile = File(...)):
    """Upload a CSV dataset file directly to the backend/data directory."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    
    destination = settings.DATA_DIR / file.filename
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        df = ingestion_service.load_latest_dataset(file.filename)
        return DataIngestResponse(
            status="success",
            records_processed=len(df),
            data_file_path=str(destination),
            message=f"File '{file.filename}' uploaded and parsed successfully."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")
