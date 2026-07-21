import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Explorium StaffOpt V2"
    API_V1_STR: str = "/api/v1"
    
    # Base Directory
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    
    # Data Directory (Protected from git)
    DATA_DIR: Path = BASE_DIR / "data"
    
    # JWT Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "explorium-staffopt-v2-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database Configuration (Async SQLite default for V1 single-location)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite+aiosqlite:///{BASE_DIR}/staffopt_v1.db"
    )


    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )


settings = Settings()

# Ensure DATA_DIR exists
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
