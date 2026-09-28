"""NTRO API - Assets endpoints"""
import logging
from fastapi import APIRouter, Query, HTTPException
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
def list_assets(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    criticality: str = Query(None),
    sector: str = Query(None),
    asset_type: str = Query(None),
    status: str = Query(None),
):
    conn = get_connection()
    try:
        offset = (page - 1) * limit
        conditions = []
        params = []

        if criticality:
            conditions.append("criticality = ?")
            params.append(criticality.upper())
        if sector:
            conditions.append("sector LIKE ?")
            params.append(f"%{sector}%")
        if asset_type:
            conditions.append("asset_type LIKE ?")
            params.append(f"%{asset_type}%")
        if status:
            conditions.append("status = ?")
            params.append(status.upper())

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        total = conn.execute(
            f"SELECT COUNT(*) FROM assets {where}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"SELECT * FROM assets {where} ORDER BY criticality DESC, asset_id LIMIT ? OFFSET ?",
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


@router.get("/{asset_id}")
def get_asset(asset_id: str):
    conn = get_connection()
    try:
        asset = conn.execute(
            "SELECT * FROM assets WHERE asset_id = ?", (asset_id,)
        ).fetchone()
        if not asset:
            raise HTTPException(status_code=404, detail="Asset not found")

        asset = dict(asset)

        # Vulnerabilities
        vulns = conn.execute("""
            SELECT * FROM vulnerabilities
            WHERE asset_id = ?
            ORDER BY severity DESC
        """, (asset_id,)).fetchall()

        # Recent events involving this asset
        recent_events = conn.execute("""
            SELECT event_id, timestamp, event_type, attack_label,
                   protocol, source_ip, destination_ip
            FROM network_events
            WHERE source_asset_id = ? OR target_asset_id = ?
            ORDER BY timestamp DESC
            LIMIT 20
        """, (asset_id, asset_id)).fetchall()

        # Incidents involving this asset
        incidents = conn.execute("""
            SELECT * FROM incidents
            WHERE source_asset_id = ? OR target_asset_id = ?
            ORDER BY created_at DESC
            LIMIT 10
        """, (asset_id, asset_id)).fetchall()

        return {
            "asset": asset,
            "vulnerabilities": [dict(r) for r in vulns],
            "recent_events": [dict(r) for r in recent_events],
            "incidents": [dict(r) for r in incidents],
        }
    finally:
        conn.close()
