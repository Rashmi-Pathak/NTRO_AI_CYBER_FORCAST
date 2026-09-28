import logging
import uuid
import asyncio
import pandas as pd
from datetime import datetime, timezone
import json
import sqlite3

from app.database.db import get_connection
from app.ml.anomaly_detection import get_detector
from app.ml.attack_classifier import get_classifier
from app.ml.risk_scoring import calculate_risk
from app.ml.feature_engineering import engineer_features

logger = logging.getLogger(__name__)

# In-memory queues for SSE subscribers
_sse_queues = []

def subscribe_to_stream():
    q = asyncio.Queue()
    _sse_queues.append(q)
    return q

def unsubscribe_from_stream(q):
    if q in _sse_queues:
        _sse_queues.remove(q)

async def publish_event(event_data: dict):
    # Avoid publishing to dead queues by wrapping in try
    msg = f"data: {json.dumps(event_data)}\n\n"
    for q in _sse_queues:
        try:
            q.put_nowait(msg)
        except Exception as e:
            logger.error(f"Error publishing SSE: {e}")

class EventProcessor:
    def __init__(self):
        self.detector = get_detector()
        self.classifier = get_classifier()

    def normalize_event(self, raw: dict) -> dict:
        """Normalizes schema values"""
        try:
            # Timestamp to ISO 8601 UTC
            if "timestamp" in raw:
                dt = pd.to_datetime(raw["timestamp"])
                if dt.tzinfo is None:
                    dt = dt.tz_localize('UTC')
                raw["timestamp"] = dt.isoformat()
            
            # Numeric fields
            numeric_fields = ["packet_count", "byte_count", "duration_seconds", "failed_auth_count", "unique_destinations", "port_diversity", "outbound_ratio", "traffic_burst"]
            for field in numeric_fields:
                if field in raw and raw[field] != '':
                    raw[field] = float(raw[field])

            # Protocol normalization
            if "protocol" in raw:
                raw["protocol"] = str(raw["protocol"]).upper()

            # Threat type normalization
            if "event_type" in raw:
                raw["event_type"] = str(raw["event_type"]).title().strip()
                
            if "attack_label" in raw:
                raw["attack_label"] = str(raw["attack_label"]).upper().strip()
                
            return raw
        except Exception as e:
            logger.error(f"Error normalizing event: {e}")
            return raw

    async def process_and_publish(self, raw_event: dict):
        """Validates, runs ML, saves to DB, publishes to SSE."""
        if not self.classifier.is_ready():
            return None # Skip if ML not loaded

        # 1. Normalize
        event = self.normalize_event(raw_event)
        
        # We need to run ML, which requires a DataFrame
        df = pd.DataFrame([event])
        df = engineer_features(df)
        
        # Predict
        df_anomalies = self.detector.predict(df)
        df_classifications = self.classifier.predict(df)
        
        is_anomaly = df_anomalies.iloc[0]["anomaly_label"] == "ANOMALOUS"
        attack_label = df_classifications.iloc[0]["predicted_attack"] if is_anomaly else "NORMAL"
        confidence = float(df_classifications.iloc[0]["confidence"])
        
        event["attack_label"] = attack_label
        
        # Evaluate Risk
        risk = calculate_risk(
            attack_stage=attack_label,
            ml_confidence=confidence,
            asset_criticality=event.get("asset_criticality", "MEDIUM"),
            anomaly_score=1.0 if is_anomaly else 0.0,
            threat_severity="HIGH" if attack_label != "NORMAL" else "LOW",
            sector_baseline_risk="MEDIUM",
            failed_auth_count=float(event.get("failed_auth_count", 0)),
            traffic_burst=float(event.get("traffic_burst", 0))
        )
        risk_score = risk.risk_score
        severity = risk.risk_level
        
        event_id = event.get("event_id", f"EVT-{uuid.uuid4().hex[:8]}")
        
        # Insert to network_events
        with get_connection() as conn:
            # Check for duplicates
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM network_events WHERE event_id=?", (event_id,))
            if cur.fetchone():
                return # Duplicate
                
            conn.execute("""
                INSERT INTO network_events (
                    event_id, timestamp, source_asset_id, target_asset_id, source_ip, destination_ip, 
                    protocol, source_port, destination_port, packet_count, byte_count, duration_seconds, 
                    failed_auth_count, unique_destinations, port_diversity, outbound_ratio, traffic_burst, 
                    event_type, attack_label, sector_id, sector, asset_criticality
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, (
                event_id, event.get("timestamp"), event.get("source_asset_id"), event.get("target_asset_id"),
                event.get("source_ip"), event.get("destination_ip"), event.get("protocol"), event.get("source_port"),
                event.get("destination_port"), float(event.get("packet_count",0)), float(event.get("byte_count",0)), 
                float(event.get("duration_seconds",0)), float(event.get("failed_auth_count",0)), 
                float(event.get("unique_destinations",0)), float(event.get("port_diversity",0)),
                float(event.get("outbound_ratio",0)), float(event.get("traffic_burst",0)), event.get("event_type"), 
                attack_label, event.get("sector_id"), event.get("sector"), event.get("asset_criticality")
            ))
            
            # Create threat if malicious
            threat_id = None
            if attack_label != "NORMAL":
                threat_id = f"THR-{uuid.uuid4().hex[:8]}"
                conn.execute("""
                    INSERT INTO threats (threat_id, event_id, timestamp, threat_type, severity, confidence, risk_score, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')
                """, (threat_id, event_id, event.get("timestamp"), event.get("event_type"), severity, confidence, risk_score))
                
        # Format payload for SSE
        payload = {
            "eventId": event_id,
            "threatId": threat_id,
            "timestamp": event.get("timestamp"),
            "threatType": event.get("event_type") if attack_label != "NORMAL" else "Normal Traffic",
            "attackLabel": attack_label,
            "severity": severity if attack_label != "NORMAL" else "LOW",
            "sourceIp": event.get("source_ip"),
            "destinationIp": event.get("destination_ip"),
            "sourceAsset": event.get("source_asset_id"),
            "destinationAsset": event.get("target_asset_id"),
            "sector": event.get("sector"),
            "location": "New Delhi", # Default mapped location, in a real system we'd use GeoIP
            "status": "NEW" if attack_label != "NORMAL" else "MONITORING",
            "riskScore": risk_score
        }
        
        await publish_event(payload)
        return payload
