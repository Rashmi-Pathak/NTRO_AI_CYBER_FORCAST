"""NTRO API - Dashboard summary endpoint"""
import logging
from fastapi import APIRouter
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/summary")
def dashboard_summary():
    conn = get_connection()
    try:
        total_events = conn.execute("SELECT COUNT(*) FROM network_events").fetchone()[0]
        suspicious = conn.execute(
            "SELECT COUNT(*) FROM network_events WHERE attack_label != 'NORMAL'"
        ).fetchone()[0]
        critical_threats = conn.execute(
            "SELECT COUNT(*) FROM threats WHERE severity IN ('CRITICAL','HIGH')"
        ).fetchone()[0]
        affected_sectors = conn.execute(
            "SELECT COUNT(DISTINCT sector_id) FROM network_events WHERE attack_label != 'NORMAL'"
        ).fetchone()[0]
        active_incidents = conn.execute(
            "SELECT COUNT(*) FROM incidents WHERE status NOT IN ('RESOLVED')"
        ).fetchone()[0]
        high_risk_assets = conn.execute(
            "SELECT COUNT(*) FROM assets WHERE criticality IN ('CRITICAL','HIGH')"
        ).fetchone()[0]

        # Attack type distribution
        attack_dist = conn.execute("""
            SELECT attack_label, COUNT(*) as count
            FROM network_events
            GROUP BY attack_label
            ORDER BY count DESC
        """).fetchall()

        # Sector distribution of threats
        sector_dist = conn.execute("""
            SELECT sector, COUNT(*) as count
            FROM network_events
            WHERE attack_label != 'NORMAL'
            GROUP BY sector
            ORDER BY count DESC
            LIMIT 10
        """).fetchall()

        # Protocol distribution
        protocol_dist = conn.execute("""
            SELECT protocol, COUNT(*) as count
            FROM network_events
            GROUP BY protocol
            ORDER BY count DESC
            LIMIT 8
        """).fetchall()

        # Recent threats (last 20)
        recent_threats = conn.execute("""
            SELECT t.threat_id, t.timestamp, t.threat_type, t.severity,
                   t.confidence, t.risk_score, t.status,
                   e.sector, e.attack_label, e.source_ip
            FROM threats t
            LEFT JOIN network_events e ON t.event_id = e.event_id
            ORDER BY t.timestamp DESC
            LIMIT 20
        """).fetchall()

        # Trend data: events per day
        trend_data = conn.execute("""
            SELECT DATE(timestamp) as date,
                   COUNT(*) as total,
                   SUM(CASE WHEN attack_label != 'NORMAL' THEN 1 ELSE 0 END) as threats
            FROM network_events
            GROUP BY DATE(timestamp)
            ORDER BY date
        """).fetchall()

        return {
            "summary": {
                "total_events": total_events,
                "suspicious_events": suspicious,
                "critical_threats": critical_threats,
                "affected_sectors": affected_sectors,
                "active_incidents": active_incidents,
                "high_risk_assets": high_risk_assets,
                "total_assets": conn.execute("SELECT COUNT(*) FROM assets").fetchone()[0],
                "total_sectors": conn.execute("SELECT COUNT(*) FROM sectors").fetchone()[0],
            },
            "attack_distribution": [
                {"label": r["attack_label"], "count": r["count"]}
                for r in attack_dist
            ],
            "sector_distribution": [
                {"sector": r["sector"], "count": r["count"]}
                for r in sector_dist
            ],
            "protocol_distribution": [
                {"protocol": r["protocol"], "count": r["count"]}
                for r in protocol_dist
            ],
            "recent_threats": [dict(r) for r in recent_threats],
            "trend_data": [dict(r) for r in trend_data],
        }
    finally:
        conn.close()
