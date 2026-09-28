"""
NTRO AI Cyber Forecast - FastAPI Main Application
"""
import logging
import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.db import init_db
from app.ml.anomaly_detection import get_detector
from app.ml.attack_classifier import get_classifier
from app.ml.forecasting import get_forecaster
from app.api.live_stream import event_generator_loop
import asyncio

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ]
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("NTRO AI Cyber Forecast Backend starting …")
    init_db()

    # Pre-load ML models
    logger.info("Loading ML models …")
    get_detector()
    get_classifier()
    get_forecaster()
    logger.info('ML models loaded.')

    # Start live stream generator
    asyncio.create_task(event_generator_loop())

    yield

    logger.info("NTRO backend shutting down.")


app = FastAPI(
    title="NTRO AI Cyber Forecast API",
    description="Backend API for NTRO AI Cyber Forecast SIH demonstration",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
from app.api.live_stream import router as live_stream_router
from app.api import (
    dashboard, events, threats, attacks,
    assets, sectors, intelligence, incidents,
    models, simulation, health, live_monitor, attack_forecast,
    attack_path, data
)

app.include_router(dashboard.router,      prefix="/api/dashboard",    tags=["Dashboard"])

app.include_router(attack_forecast.router,prefix="/api/attack-forecast", tags=["AttackForecast"])

app.include_router(live_monitor.router,   prefix="/api/live-monitor", tags=["LiveMonitor"])

app.include_router(events.router,         prefix="/api/events",       tags=["Events"])

app.include_router(threats.router,        prefix="/api/threats",      tags=["Threats"])

app.include_router(attacks.router,        prefix="/api/attacks",      tags=["Attacks"])

app.include_router(assets.router,         prefix="/api/assets",       tags=["Assets"])

app.include_router(sectors.router,        prefix="/api/sectors",      tags=["Sectors"])

app.include_router(intelligence.router,   prefix="/api/intelligence", tags=["Intelligence"])

app.include_router(incidents.router,      prefix="/api/incidents",    tags=["Incidents"])

app.include_router(models.router,         prefix="/api/models",       tags=["Models"])

app.include_router(simulation.router,     prefix="/api/simulation",   tags=["Simulation"])

app.include_router(health.router,         prefix="/api",              tags=["Health"])

app.include_router(attack_path.router,    prefix="/api/attack-path",  tags=["AttackPath"])

app.include_router(data.router,           prefix="/api/data",         tags=["Data"])



@app.get("/")
def root():
    return {"message": "NTRO AI Cyber Forecast API", "status": "running", "version": "1.0.0"}




app.include_router(live_stream_router, tags=['LiveStream'])

