"""NTRO API - ML Models Intelligence endpoints"""
import json
import logging
from fastapi import APIRouter
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
def list_models():
    conn = get_connection()
    try:
        rows = conn.execute("SELECT * FROM ml_models").fetchall()
        models = []
        for r in rows:
            m = dict(r)
            # Parse JSON fields
            for field in ["features_used", "confusion_matrix"]:
                if m.get(field):
                    try:
                        m[field] = json.loads(m[field])
                    except Exception:
                        pass
            models.append(m)
        return {"data": models}
    finally:
        conn.close()
