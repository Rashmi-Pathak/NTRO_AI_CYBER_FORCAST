"""NTRO API - Sectors endpoints"""
import logging
from fastapi import APIRouter, HTTPException
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
def list_sectors():
    conn = get_connection()
    try:
        sectors = conn.execute("SELECT * FROM sectors").fetchall()
        result = []
        for s in sectors:
            s = dict(s)
            sid = s["sector_id"]
            sector_name = s["sector"]

            # Counts
            event_count = conn.execute(
                "SELECT COUNT(*) FROM network_events WHERE sector_id = ?", (sid,)
            ).fetchone()[0]
            threat_count = conn.execute(
                "SELECT COUNT(*) FROM network_events WHERE sector_id = ? AND attack_label != 'NORMAL'",
                (sid,)
            ).fetchone()[0]
            asset_count = conn.execute(
                "SELECT COUNT(*) FROM assets WHERE sector_id = ?", (sid,)
            ).fetchone()[0]
            critical_assets = conn.execute(
                "SELECT COUNT(*) FROM assets WHERE sector_id = ? AND criticality = 'CRITICAL'",
                (sid,)
            ).fetchone()[0]
            incident_count = conn.execute(
                "SELECT COUNT(*) FROM incidents WHERE sector LIKE ?",
                (f"%{sector_name}%",)
            ).fetchone()[0]

            # Top attack types
            top_attacks = conn.execute("""
                SELECT attack_label, COUNT(*) as count
                FROM network_events
                WHERE sector_id = ? AND attack_label != 'NORMAL'
                GROUP BY attack_label
                ORDER BY count DESC
                LIMIT 5
            """, (sid,)).fetchall()

            s.update({
                "event_count": event_count,
                "threat_count": threat_count,
                "asset_count": asset_count,
                "critical_assets": critical_assets,
                "incident_count": incident_count,
                "top_attack_types": [
                    {"label": r["attack_label"], "count": r["count"]}
                    for r in top_attacks
                ],
            })
            result.append(s)

        return {"data": result}
    finally:
        conn.close()


@router.get("/{sector_id}")
def get_sector(sector_id: str):
    conn = get_connection()
    try:
        sector = conn.execute(
            "SELECT * FROM sectors WHERE sector_id = ?", (sector_id,)
        ).fetchone()
        if not sector:
            raise HTTPException(status_code=404, detail="Sector not found")
        sector = dict(sector)

        # Assets in this sector
        assets = conn.execute(
            "SELECT * FROM assets WHERE sector_id = ? ORDER BY criticality DESC LIMIT 50",
            (sector_id,)
        ).fetchall()

        # Recent incidents
        incidents = conn.execute("""
            SELECT * FROM incidents
            WHERE sector LIKE ?
            ORDER BY created_at DESC LIMIT 10
        """, (f"%{sector['sector']}%",)).fetchall()

        # Attack distribution
        attack_dist = conn.execute("""
            SELECT attack_label, COUNT(*) as count
            FROM network_events
            WHERE sector_id = ?
            GROUP BY attack_label
            ORDER BY count DESC
        """, (sector_id,)).fetchall()

        # Timeline (last 30 days events per day)
        trend = conn.execute("""
            SELECT DATE(timestamp) as date, COUNT(*) as total,
                   SUM(CASE WHEN attack_label != 'NORMAL' THEN 1 ELSE 0 END) as threats
            FROM network_events
            WHERE sector_id = ?
            GROUP BY DATE(timestamp)
            ORDER BY date
        """, (sector_id,)).fetchall()

        return {
            "sector": sector,
            "assets": [dict(r) for r in assets],
            "incidents": [dict(r) for r in incidents],
            "attack_distribution": [
                {"label": r["attack_label"], "count": r["count"]} for r in attack_dist
            ],
            "trend": [dict(r) for r in trend],
        }
    finally:
        conn.close()
