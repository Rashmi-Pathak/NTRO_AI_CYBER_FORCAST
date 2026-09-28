import asyncio
import logging
from fastapi import APIRouter, Request, Query
from fastapi.responses import StreamingResponse
from app.database.db import get_connection

from app.ingestion.replay_engine import replay_engine
from app.ingestion.event_processor import subscribe_to_stream, unsubscribe_from_stream

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/events/stream")
async def event_stream(request: Request):
    """Server-Sent Events (SSE) endpoint for live event updates."""
    async def event_generator():
        q = subscribe_to_stream()
        try:
            while True:
                if await request.is_disconnected():
                    break
                # Wait for next event
                msg = await q.get()
                yield msg
        except asyncio.CancelledError:
            pass
        finally:
            unsubscribe_from_stream(q)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/replay/start")
async def start_replay():
    return replay_engine.start()

@router.post("/replay/pause")
async def pause_replay():
    return replay_engine.pause()

@router.post("/replay/resume")
async def resume_replay():
    return replay_engine.resume()

@router.post("/replay/stop")
async def stop_replay():
    return replay_engine.stop()

@router.get("/replay/status")
async def replay_status():
    return replay_engine.get_status()

@router.get("/summary")
def get_summary():
    with get_connection() as conn:
        cur = conn.cursor()
        # total events
        cur.execute("SELECT COUNT(*) FROM network_events")
        total_events = cur.fetchone()[0]
        
        # suspicious events
        cur.execute("SELECT COUNT(*) FROM network_events WHERE attack_label != 'NORMAL'")
        suspicious_events = cur.fetchone()[0]
        
        # critical threats
        cur.execute("SELECT COUNT(*) FROM threats WHERE severity = 'CRITICAL'")
        critical_threats = cur.fetchone()[0]
        
        # affected sectors
        cur.execute("SELECT COUNT(DISTINCT sector_id) FROM threats t JOIN network_events e ON t.event_id = e.event_id")
        affected_sectors = cur.fetchone()[0]
        
    return {
        "totalEvents": total_events,
        "suspiciousEvents": suspicious_events,
        "criticalThreats": critical_threats,
        "affectedSectors": affected_sectors,
        "eventsPerSecond": replay_engine.get_status()["eventsPerSecond"]
    }

@router.get("/top-threats")
def get_top_threats():
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT threat_type, severity, COUNT(*) as count 
            FROM threats 
            GROUP BY threat_type, severity 
            ORDER BY count DESC 
            LIMIT 5
        """)
        rows = cur.fetchall()
        
    # Calculate total for percentage
    total = sum(r[2] for r in rows) if rows else 1
    
    return [
        {
            "threatType": r[0],
            "severity": r[1],
            "eventCount": r[2],
            "percentage": round((r[2] / total) * 100, 1)
        } for r in rows
    ]

@router.get("/threat-distribution")
def get_threat_distribution():
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT severity, COUNT(*) FROM threats GROUP BY severity")
        rows = cur.fetchall()
        
    total = sum(r[1] for r in rows) if rows else 1
    
    result = {
        "CRITICAL": {"count": 0, "percentage": 0.0},
        "HIGH": {"count": 0, "percentage": 0.0},
        "MEDIUM": {"count": 0, "percentage": 0.0},
        "LOW": {"count": 0, "percentage": 0.0}
    }
    
    for r in rows:
        sev = r[0].upper()
        if sev in result:
            result[sev] = {
                "count": r[1],
                "percentage": round((r[1] / total) * 100, 1)
            }
            
    return result

@router.get("/protocol-distribution")
def get_protocol_distribution():
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("SELECT protocol, COUNT(*) FROM network_events GROUP BY protocol ORDER BY COUNT(*) DESC LIMIT 5")
        rows = cur.fetchall()
        
    return [{"name": r[0], "value": r[1]} for r in rows]

@router.get("/map")
def get_map_data():
    with get_connection() as conn:
        cur = conn.cursor()
        # Group active threats by sector/location logic
        # Our dataset has 'sector' but no strict lat/long. We'll map sectors to common Indian cities for the demo map.
        cur.execute("""
            SELECT e.sector, t.severity, COUNT(*) 
            FROM threats t 
            JOIN network_events e ON t.event_id = e.event_id 
            WHERE t.status != 'RESOLVED'
            GROUP BY e.sector, t.severity
        """)
        rows = cur.fetchall()

    # Pre-defined mapping for SIH demo to put points on India map
    location_map = {
        "Government": {"city": "New Delhi", "lat": 28.6139, "lng": 77.2090},
        "Finance": {"city": "Mumbai", "lat": 19.0760, "lng": 72.8777},
        "Healthcare": {"city": "Bengaluru", "lat": 12.9716, "lng": 77.5946},
        "Energy": {"city": "Ahmedabad", "lat": 23.0225, "lng": 72.5714},
        "Defense": {"city": "Chandigarh", "lat": 30.7333, "lng": 76.7794},
        "Telecom": {"city": "Hyderabad", "lat": 17.3850, "lng": 78.4867},
        "Education": {"city": "Chennai", "lat": 13.0827, "lng": 80.2707},
        "Manufacturing": {"city": "Pune", "lat": 18.5204, "lng": 73.8567},
    }

    results = []
    for r in rows:
        sector, severity, count = r
        loc = location_map.get(sector, location_map["Government"])
        results.append({
            "location": loc["city"],
            "latitude": loc["lat"],
            "longitude": loc["lng"],
            "eventCount": count,
            "severity": severity,
            "sector": sector
        })
        
    return results

@router.get("/events")
def get_events(
    severity: str | None = None,
    sector: str | None = None,
    threatType: str | None = None,
    status: str | None = None,
    limit: int = Query(50, le=200),
    offset: int = 0
):
    with get_connection() as conn:
        cur = conn.cursor()
        query = """
            SELECT 
                e.event_id, e.timestamp, t.threat_type, t.severity, 
                e.source_ip, e.destination_ip, e.source_asset_id, e.target_asset_id,
                e.sector, t.status, t.risk_score
            FROM network_events e
            LEFT JOIN threats t ON e.event_id = t.event_id
            WHERE 1=1
        """
        params = []
        if severity:
            query += " AND t.severity = ?"
            params.append(severity)
        if sector:
            query += " AND e.sector = ?"
            params.append(sector)
        if threatType:
            query += " AND t.threat_type = ?"
            params.append(threatType)
        if status:
            query += " AND t.status = ?"
            params.append(status)
            
        query += " ORDER BY e.timestamp DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cur.execute(query, params)
        rows = cur.fetchall()
        
    return [
        {
            "eventId": r[0],
            "timestamp": r[1],
            "threatType": r[2] or "Normal Traffic",
            "severity": r[3] or "LOW",
            "sourceIp": r[4],
            "destinationIp": r[5],
            "sourceAsset": r[6],
            "destinationAsset": r[7],
            "sector": r[8],
            "status": r[9] or "MONITORING",
            "riskScore": r[10] or 0
        }
        for r in rows
    ]

@router.get("/events/{event_id}")
def get_event_detail(event_id: str):
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            SELECT e.*, t.threat_id, t.threat_type, t.severity, t.risk_score, t.status, t.confidence
            FROM network_events e
            LEFT JOIN threats t ON e.event_id = t.event_id
            WHERE e.event_id = ?
        """, (event_id,))
        row = cur.fetchone()
        
    if not row:
        return {"error": "Event not found"}, 404
        
    return dict(row)
