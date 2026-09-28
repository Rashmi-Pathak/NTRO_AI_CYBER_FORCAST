"""NTRO API - Threat Intelligence endpoints"""
import logging
from fastapi import APIRouter, Query, HTTPException
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
def list_intelligence(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    indicator_type: str = Query(None),
    risk: str = Query(None),
):
    conn = get_connection()
    try:
        offset = (page - 1) * limit
        conditions = []
        params = []

        if indicator_type:
            conditions.append("indicator_type = ?")
            params.append(indicator_type.upper())
        if risk:
            conditions.append("risk = ?")
            params.append(risk.upper())

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        total = conn.execute(
            f"SELECT COUNT(*) FROM threat_intelligence {where}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"SELECT * FROM threat_intelligence {where} ORDER BY confidence DESC LIMIT ? OFFSET ?",
            params + [limit, offset]
        ).fetchall()

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "data": [dict(r) for r in rows],
        }
    finally:
        conn.close()


@router.get("/ioc/{indicator}")
def search_indicator(indicator: str):
    """Search for a specific indicator of compromise."""
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM threat_intelligence
            WHERE indicator LIKE ?
            ORDER BY confidence DESC
            LIMIT 10
        """, (f"%{indicator}%",)).fetchall()

        if not rows:
            return {
                "indicator": indicator,
                "found": False,
                "results": [],
                "message": "Indicator not found in threat intelligence database",
            }

        return {
            "indicator": indicator,
            "found": True,
            "results": [dict(r) for r in rows],
        }
    finally:
        conn.close()


@router.get("/{intel_id}")
def get_intelligence(intel_id: str):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM threat_intelligence WHERE intel_id = ?", (intel_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Intelligence record not found")
        return dict(row)
    finally:
        conn.close()
