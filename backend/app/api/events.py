"""NTRO API - Network Events endpoints"""
import logging
from fastapi import APIRouter, Query, HTTPException
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
def list_events(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    attack_label: str = Query(None),
    sector: str = Query(None),
    protocol: str = Query(None),
):
    conn = get_connection()
    try:
        offset = (page - 1) * limit
        conditions = []
        params = []

        if attack_label:
            conditions.append("attack_label = ?")
            params.append(attack_label.upper())
        if sector:
            conditions.append("sector LIKE ?")
            params.append(f"%{sector}%")
        if protocol:
            conditions.append("protocol = ?")
            params.append(protocol.upper())

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        total = conn.execute(
            f"SELECT COUNT(*) FROM network_events {where}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"SELECT * FROM network_events {where} ORDER BY timestamp DESC LIMIT ? OFFSET ?",
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


@router.get("/{event_id}")
def get_event(event_id: str):
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM network_events WHERE event_id = ?", (event_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")
        return dict(row)
    finally:
        conn.close()

@router.get('/{event_id}')
def get_event_detail(event_id: str):
    conn = get_connection()
    row = conn.execute('SELECT * FROM network_events WHERE event_id = ?', (event_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail='Event not found')
    return dict(row)

@router.get('/{event_id}/related')
def get_event_related(event_id: str):
    conn = get_connection()
    row = conn.execute('SELECT source_ip, destination_ip FROM network_events WHERE event_id = ?', (event_id,)).fetchone()
    if not row:
        return []
    events = conn.execute('SELECT * FROM network_events WHERE (source_ip = ? OR destination_ip = ?) AND event_id != ? LIMIT 10', (row[0], row[1], event_id)).fetchall()
    return [dict(e) for e in events]

