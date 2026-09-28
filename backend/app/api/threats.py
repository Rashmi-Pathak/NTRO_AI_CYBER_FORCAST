"""NTRO API - Threats endpoints (live monitor with real-time ML ingestion)"""
import logging
import random
import uuid
import pandas as pd
from datetime import datetime, timezone
from fastapi import APIRouter, Query, HTTPException
from app.database.db import get_connection

from app.ml.anomaly_detection import get_detector
from app.ml.attack_classifier import get_classifier
from app.ml.forecasting import get_forecaster
from app.ml.risk_scoring import calculate_risk
from app.ml.feature_engineering import engineer_features

logger = logging.getLogger(__name__)
router = APIRouter()

PROTOCOLS = ["TCP", "UDP", "HTTP", "HTTPS", "SSH", "SMB", "DNS", "ICMP"]
SECTORS = ["Government", "Banking & Finance", "Power Infrastructure", "Telecom", "Defence", "Healthcare"]

def generate_live_event():
    """Generates a raw, unclassified network event."""
    return {
        "event_id": f"LIVE-{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "source_asset_id": f"AST-{random.randint(1, 500):04d}",
        "target_asset_id": f"AST-{random.randint(1, 500):04d}",
        "source_ip": f"{random.randint(10,200)}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}",
        "destination_ip": f"10.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}",
        "protocol": random.choice(PROTOCOLS),
        "source_port": random.randint(1024, 65535),
        "destination_port": random.choice([22, 80, 443, 445, 3389, 8080, 1433]),
        "packet_count": random.randint(5, 5000),
        "byte_count": random.randint(100, 5000000),
        "duration_seconds": round(random.uniform(0.1, 120), 2),
        "failed_auth_count": random.choice([0, 0, 0, 1, 5, 20]),
        "unique_destinations": random.randint(1, 50),
        "port_diversity": random.randint(1, 100),
        "outbound_ratio": round(random.uniform(0.1, 1.0), 3),
        "traffic_burst": round(random.uniform(0.5, 15), 2),
        "event_type": "Live Stream Traffic",
        "attack_label": "UNKNOWN",  # Will be classified by ML
        "sector_id": f"SEC-00{random.randint(1,6)}",
        "sector": random.choice(SECTORS),
        "asset_criticality": random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    }

def process_live_events(conn, count=2):
    """Generates events, runs them through the full ML pipeline, and inserts to DB."""
    detector = get_detector()
    classifier = get_classifier()
    forecaster = get_forecaster()
    
    if not classifier.is_ready():
        return # Skip if models aren't trained

    events = [generate_live_event() for _ in range(count)]
    df = pd.DataFrame(events)
    df = engineer_features(df)
    
    # 1. Anomaly Detection
    df_anomalies = detector.predict(df)
    
    # 2. Attack Classification
    df_classifications = classifier.predict(df)
    
    for i, event in enumerate(events):
        is_anomaly = df_anomalies.iloc[i]["anomaly_label"] == "ANOMALOUS"
        attack_label = df_classifications.iloc[i]["predicted_attack"] if is_anomaly else "NORMAL"
        event["attack_label"] = attack_label
        
        # Insert event
        conn.execute("""
            INSERT INTO network_events (
                event_id, timestamp, source_asset_id, target_asset_id, source_ip, destination_ip,
                protocol, source_port, destination_port, packet_count, byte_count, duration_seconds,
                failed_auth_count, unique_destinations, port_diversity, outbound_ratio, traffic_burst,
                event_type, attack_label, sector_id, sector, asset_criticality
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            event["event_id"], event["timestamp"], event["source_asset_id"], event["target_asset_id"],
            event["source_ip"], event["destination_ip"], event["protocol"], event["source_port"],
            event["destination_port"], event["packet_count"], event["byte_count"], event["duration_seconds"],
            event["failed_auth_count"], event["unique_destinations"], event["port_diversity"],
            event["outbound_ratio"], event["traffic_burst"], event["event_type"], event["attack_label"],
            event["sector_id"], event["sector"], event["asset_criticality"]
        ))
        
        # If malicious, create threat & forecast
        if attack_label != "NORMAL":
            confidence = round(random.uniform(0.7, 0.99), 2)
            risk = calculate_risk(
                attack_stage=attack_label,
                ml_confidence=confidence,
                asset_criticality=event["asset_criticality"],
                anomaly_score=1.0 if is_anomaly else 0.0,
                threat_severity="HIGH",
                sector_baseline_risk="MEDIUM",
                failed_auth_count=event["failed_auth_count"],
                traffic_burst=event["traffic_burst"]
            )
            risk_score = risk.risk_score
            severity = risk.risk_level
            
            threat_id = f"THR-{uuid.uuid4().hex[:8]}"
            conn.execute("""
                INSERT INTO threats (threat_id, event_id, timestamp, threat_type, severity, confidence, risk_score, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
            """, (threat_id, event["event_id"], event["timestamp"], attack_label, severity, confidence, risk_score))
            
            # 3. Forecast Next Stage
            prediction = forecaster.forecast(attack_label)
            conn.execute("""
                INSERT INTO attack_predictions (
                    prediction_id, timestamp, source_asset_id, target_asset_id, sector,
                    current_stage, predicted_stage, confidence, risk_score, estimated_time, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
            """, (
                f"PRED-{uuid.uuid4().hex[:8]}", event["timestamp"], event["source_asset_id"], event["target_asset_id"],
                event["sector"], attack_label, prediction["predicted_next_stage"], prediction["confidence"],
                risk_score, prediction["time_window"]
            ))
            
            # Add to timeline
            conn.execute("""
                INSERT INTO attack_timeline (attack_id, timestamp, stage, event, source_asset_id, target_asset_id, severity, classification, confidence)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'OBSERVED', ?)
            """, (threat_id, event["timestamp"], attack_label, f"Live detected: {attack_label}", event["source_asset_id"], event["target_asset_id"], severity, confidence))

    conn.commit()


@router.get("")
def list_threats(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    severity: str = Query(None),
    status: str = Query(None),
):
    conn = get_connection()
    try:
        offset = (page - 1) * limit
        conditions = []
        params = []

        if severity:
            conditions.append("t.severity = ?")
            params.append(severity.upper())
        if status:
            conditions.append("t.status = ?")
            params.append(status.upper())

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        total = conn.execute(
            f"SELECT COUNT(*) FROM threats t {where}", params
        ).fetchone()[0]

        rows = conn.execute(f"""
            SELECT t.*,
                   e.source_ip, e.destination_ip, e.protocol,
                   e.attack_label, e.sector, e.asset_criticality,
                   e.packet_count, e.byte_count
            FROM threats t
            LEFT JOIN network_events e ON t.event_id = e.event_id
            {where}
            ORDER BY t.timestamp DESC
            LIMIT ? OFFSET ?
        """, params + [limit, offset]).fetchall()

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "data": [dict(r) for r in rows],
        }
    finally:
        conn.close()


@router.get("/live")
def live_threats():
    """Return the 50 most recent threat events. Dynamically generates real-time ML traffic on poll."""
    conn = get_connection()
    try:
        # Fire the real-time ML ingestion pipeline!
        process_live_events(conn, count=random.randint(1, 3))
        
        rows = conn.execute("""
            SELECT t.*,
                   e.source_ip, e.destination_ip, e.protocol,
                   e.attack_label, e.sector, e.asset_criticality,
                   e.source_asset_id, e.target_asset_id
            FROM threats t
            LEFT JOIN network_events e ON t.event_id = e.event_id
            ORDER BY t.timestamp DESC
            LIMIT 50
        """).fetchall()
        return {"data": [dict(r) for r in rows]}
    finally:
        conn.close()


@router.get("/{threat_id}")
def get_threat(threat_id: str):
    conn = get_connection()
    try:
        row = conn.execute("""
            SELECT t.*,
                   e.source_ip, e.destination_ip, e.protocol,
                   e.attack_label, e.sector, e.asset_criticality,
                   e.source_asset_id, e.target_asset_id,
                   e.packet_count, e.byte_count, e.duration_seconds,
                   e.failed_auth_count, e.unique_destinations
            FROM threats t
            LEFT JOIN network_events e ON t.event_id = e.event_id
            WHERE t.threat_id = ?
        """, (threat_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Threat not found")
        return dict(row)
    finally:
        conn.close()
