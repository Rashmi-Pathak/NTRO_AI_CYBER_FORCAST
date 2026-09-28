"""
NTRO AI Cyber Forecast - Application Settings
"""
from pydantic_settings import BaseSettings
from pathlib import Path
import os


class Settings(BaseSettings):
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_debug: bool = False
    log_level: str = "INFO"

    # Database
    db_path: str = "./data/ntro_cyber.db"

    # Data paths
    raw_data_dir: str = "./data/raw"
    models_dir: str = "./data/models"
    logs_dir: str = "./logs"

    # ML
    anomaly_threshold: float = 0.1
    risk_threshold_critical: int = 80
    risk_threshold_high: int = 60
    risk_threshold_medium: int = 40

    # Simulation
    simulation_speed: float = 1.0
    simulation_interval_seconds: int = 5

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Security
    secret_key: str = "change-me-in-production"

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def db_url(self) -> str:
        return f"sqlite:///{self.db_path}"

    @property
    def raw_data_path(self) -> Path:
        return Path(self.raw_data_dir)

    @property
    def models_path(self) -> Path:
        return Path(self.models_dir)


settings = Settings()
