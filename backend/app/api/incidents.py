"""NTRO API - Incidents endpoints"""
import logging
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()

VALID_STATUSES = ["OPEN", "INVESTIGATING", "CONTAINMENT", "ERADICATION", "RECOVERY", "RESOLVED"]


class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None


@router.get("")
def list_incidents(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    status: str = Query(None),
    sector: str = Query(None),
):
    conn = get_connection()
    try:
        offset = (page - 1) * limit
        conditions = []
        params = []

        if status:
            conditions.append("status = ?")
            params.append(status.upper())
        if sector:
            conditions.append("sector LIKE ?")
            params.append(f"%{sector}%")

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        total = conn.execute(
            f"SELECT COUNT(*) FROM incidents {where}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"SELECT * FROM incidents {where} ORDER BY created_at DESC LIMIT ? OFFSET ?",
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


@router.get("/{incident_id}")
def get_incident(incident_id: str):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM incidents WHERE incident_id = ?", (incident_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Incident not found")

        incident = dict(row)

        # Source/target asset details
        src = conn.execute(
            "SELECT * FROM assets WHERE asset_id = ?", (incident["source_asset_id"],)
        ).fetchone()
        tgt = conn.execute(
            "SELECT * FROM assets WHERE asset_id = ?", (incident["target_asset_id"],)
        ).fetchone()

        # Related predictions
        preds = conn.execute("""
            SELECT * FROM attack_predictions
            WHERE source_asset_id = ? OR target_asset_id = ?
            ORDER BY timestamp DESC LIMIT 5
        """, (incident["source_asset_id"], incident["target_asset_id"])).fetchall()

        return {
            "incident": incident,
            "source_asset": dict(src) if src else None,
            "target_asset": dict(tgt) if tgt else None,
            "related_predictions": [dict(r) for r in preds],
        }
    finally:
        conn.close()


@router.patch("/{incident_id}")
def update_incident(incident_id: str, update: IncidentUpdate):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM incidents WHERE incident_id = ?", (incident_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Incident not found")

        fields = []
        params = []
        if update.status:
            if update.status.upper() not in VALID_STATUSES:
                raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {VALID_STATUSES}")
            fields.append("status = ?")
            params.append(update.status.upper())
        if update.title:
            fields.append("title = ?")
            params.append(update.title)

        if fields:
            params.append(incident_id)
            conn.execute(
                f"UPDATE incidents SET {', '.join(fields)} WHERE incident_id = ?",
                params
            )
            conn.commit()

        updated = conn.execute(
            "SELECT * FROM incidents WHERE incident_id = ?", (incident_id,)
        ).fetchone()
        return {"message": "Incident updated", "incident": dict(updated)}
    finally:
        conn.close()
