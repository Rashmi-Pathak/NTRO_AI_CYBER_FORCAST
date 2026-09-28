from fastapi import APIRouter
from datetime import datetime
import os
import sqlite3
from app.database.db import get_connection

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "NTRO AI Cyber Forecast API",
    }

@router.get("/system/status")
def system_status():
    conn = get_connection()
    try:
        # Check DB Size
        db_size = os.path.getsize("./data/ntro_cyber.db") / (1024 * 1024) # MB
        
        # Check counts
        events = conn.execute("SELECT COUNT(*) FROM network_events").fetchone()[0]
        models = conn.execute("SELECT COUNT(*) FROM ml_models").fetchone()[0]
        
        return {
            "health": "Healthy",
            "integrations": {"active": 12, "total": 14},
            "pipelines": {"active": 8, "total": 8},
            "models": {"active": models, "total": models},
            "storage": f"{db_size:.2f} MB",
            "uptime": "99.98%",
            
            # Nodes
            "nodes": [
                {"name": "Threat Ingestion Service", "status": "Running", "latency": "99.98%", "cpu": "14%"},
                {"name": "ML Model Service", "status": "Running", "latency": "99.95%", "cpu": "67%"},
                {"name": "Analytics Engine", "status": "Running", "latency": "99.97%", "cpu": "89%"},
                {"name": "Simulation Engine", "status": "Running", "latency": "99.92%", "cpu": "22%"},
                {"name": "Database (Primary)", "status": "Running", "latency": "99.99%", "cpu": "45%"},
                {"name": "Database (Replica)", "status": "Running", "latency": "99.96%", "cpu": "10%"},
                {"name": "API Gateway", "status": "Running", "latency": "99.98%", "cpu": "33%"},
                {"name": "Notification Service", "status": "Running", "latency": "99.93%", "cpu": "5%"},
                {"name": "Auth Service", "status": "Running", "latency": "99.99%", "cpu": "2%"},
            ]
        }
    except Exception as e:
        return {"health": "Degraded", "error": str(e)}
    finally:
        conn.close()

@router.get("/system/logs")
def system_logs():
    return [
        {"time": datetime.utcnow().strftime("%H:%M:%S"), "level": "INFO", "source": "API", "msg": "GET /api/system/logs - 200 OK"},
        {"time": (datetime.utcnow()).strftime("%H:%M:%S"), "level": "INFO", "source": "Threat Engine", "msg": "Processed batch of 5000 events."},
        {"time": (datetime.utcnow()).strftime("%H:%M:%S"), "level": "WARNING", "source": "Database", "msg": "Slow query detected on idx_events_timestamp."},
        {"time": (datetime.utcnow()).strftime("%H:%M:%S"), "level": "INFO", "source": "ML Inference", "msg": "Loaded model AttackForecastModel v1.0"},
    ]
