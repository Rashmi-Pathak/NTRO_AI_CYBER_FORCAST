"""NTRO API - Attack Predictions + detailed Attack Analysis"""
import json
import logging
from fastapi import APIRouter, Query, HTTPException
from app.database.db import get_connection
from app.ml.attack_graph import build_attack_graph
from app.ml.forecasting import get_forecaster
from app.ml.risk_scoring import calculate_risk

logger = logging.getLogger(__name__)
router = APIRouter()


def _get_asset(conn, asset_id):
    if not asset_id:
        return None
    row = conn.execute("SELECT * FROM assets WHERE asset_id = ?", (asset_id,)).fetchone()
    return dict(row) if row else None


def _get_sector(conn, sector_name):
    if not sector_name:
        return None
    row = conn.execute(
        "SELECT * FROM sectors WHERE sector LIKE ?", (f"%{sector_name}%",)
    ).fetchone()
    return dict(row) if row else None


@router.get("")
def list_attacks(
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
            f"SELECT COUNT(*) FROM attack_predictions {where}", params
        ).fetchone()[0]

        rows = conn.execute(
            f"SELECT * FROM attack_predictions {where} ORDER BY timestamp DESC LIMIT ? OFFSET ?",
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


@router.get("/{prediction_id}")
def get_attack_detail(prediction_id: str):
    """
    Full investigation data for Attack Analysis page.
    Returns prediction + assets + sector + timeline + vulnerabilities +
    related events + graph + risk score + recommended actions.
    """
    conn = get_connection()
    try:
        pred = conn.execute(
            "SELECT * FROM attack_predictions WHERE prediction_id = ?",
            (prediction_id,)
        ).fetchone()
        if not pred:
            raise HTTPException(status_code=404, detail="Prediction not found")

        pred = dict(pred)
        src_asset = _get_asset(conn, pred.get("source_asset_id"))
        tgt_asset = _get_asset(conn, pred.get("target_asset_id"))
        sector = _get_sector(conn, pred.get("sector"))

        # Timeline
        timeline = conn.execute("""
            SELECT * FROM attack_timeline
            WHERE attack_id = ?
            ORDER BY timestamp
        """, (prediction_id,)).fetchall()

        # Vulnerabilities for target asset
        vulns = []
        if tgt_asset:
            vulns = conn.execute("""
                SELECT * FROM vulnerabilities
                WHERE asset_id = ?
                ORDER BY severity DESC
                LIMIT 10
            """, (tgt_asset["asset_id"],)).fetchall()

        # Related events (same source or target)
        related_events = conn.execute("""
            SELECT event_id, timestamp, event_type, attack_label,
                   protocol, source_ip, destination_ip
            FROM network_events
            WHERE source_asset_id = ? OR target_asset_id = ?
            ORDER BY timestamp DESC
            LIMIT 20
        """, (
            pred.get("source_asset_id", ""), pred.get("target_asset_id", "")
        )).fetchall()

        # Threat intelligence indicators
        indicators = []
        if src_asset:
            indicators = conn.execute("""
                SELECT * FROM threat_intelligence
                ORDER BY RANDOM()
                LIMIT 5
            """).fetchall()

        # Risk score calculation
        risk = calculate_risk(
            attack_stage=pred.get("current_stage", "NORMAL"),
            ml_confidence=pred.get("confidence", 0.5),
            asset_criticality=tgt_asset["criticality"] if tgt_asset else "LOW",
            anomaly_score=0.6,
            threat_severity="HIGH" if pred.get("risk_score", 0) > 70 else "MEDIUM",
            sector_baseline_risk=sector["baseline_risk"] if sector else "MEDIUM",
            failed_auth_count=0,
            traffic_burst=0,
            intel_match=len(indicators) > 0,
        )

        # Forecast next stage
        forecaster = get_forecaster()
        forecast = forecaster.forecast(pred.get("predicted_stage", "NORMAL"))

        # Recommended actions
        stage = pred.get("predicted_stage", "NORMAL").upper()
        recommendations = _get_recommendations(stage, tgt_asset, risk.risk_level)

        # Attack stages (from timeline classification)
        attack_stages = list({
            row["stage"]: {
                "stage": row["stage"],
                "classification": row["classification"],
                "severity": row["severity"],
            }
            for row in timeline
        }.values())

        return {
            "prediction": pred,
            "confidence": pred.get("confidence"),
            "risk_score": risk.risk_score,
            "risk_level": risk.risk_level,
            "risk_reasons": risk.reasons,
            "risk_components": risk.components,
            "source_asset": src_asset,
            "target_asset": tgt_asset,
            "sector": sector,
            "location": {
                "latitude": tgt_asset["latitude"] if tgt_asset else None,
                "longitude": tgt_asset["longitude"] if tgt_asset else None,
                "city": tgt_asset["location"] if tgt_asset else None,
            },
            "timeline": [dict(r) for r in timeline],
            "attack_stages": attack_stages,
            "indicators": [dict(r) for r in indicators],
            "vulnerabilities": [dict(r) for r in vulns],
            "related_events": [dict(r) for r in related_events],
            "forecast": forecast,
            "why_flagged": risk.reasons,
            "recommended_actions": recommendations,
        }
    finally:
        conn.close()


@router.get("/{prediction_id}/timeline")
def get_attack_timeline(prediction_id: str):
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT * FROM attack_timeline
            WHERE attack_id = ?
            ORDER BY timestamp
        """, (prediction_id,)).fetchall()
        return {"attack_id": prediction_id, "timeline": [dict(r) for r in rows]}
    finally:
        conn.close()


@router.get("/{prediction_id}/graph")
def get_attack_graph(prediction_id: str):
    return build_attack_graph(prediction_id)


def _get_recommendations(stage: str, asset: dict | None, risk_level: str) -> list[dict]:
    """Generate recommended actions based on attack stage and asset."""
    recs = []
    asset_name = asset["hostname"] if asset else "target asset"
    criticality = asset["criticality"] if asset else "HIGH"

    stage_recs = {
        "RECONNAISSANCE": [
            {"text": f"Block source IPs performing port scanning", "level": "High"},
            {"text": "Enable enhanced logging on perimeter devices", "level": "Medium"},
            {"text": "Review firewall rules for exposed services", "level": "Medium"},
        ],
        "INITIAL_ACCESS": [
            {"text": f"Isolate {asset_name} from network immediately", "level": "Critical"},
            {"text": "Initiate incident response procedure", "level": "Critical"},
            {"text": "Capture memory dump for forensic analysis", "level": "High"},
        ],
        "CREDENTIAL_ACCESS": [
            {"text": "Force password reset for all accounts on affected systems", "level": "Critical"},
            {"text": "Enable MFA if not already active", "level": "Critical"},
            {"text": f"Audit privileged access logs on {asset_name}", "level": "High"},
        ],
        "LATERAL_MOVEMENT": [
            {"text": "Implement network segmentation to contain movement", "level": "Critical"},
            {"text": f"Isolate {asset_name} and adjacent systems", "level": "Critical"},
            {"text": "Review service account privileges", "level": "High"},
        ],
        "EXFILTRATION": [
            {"text": "Block all outbound traffic from affected systems", "level": "Critical"},
            {"text": "Engage Data Loss Prevention controls", "level": "Critical"},
            {"text": "Notify data protection officer", "level": "High"},
        ],
        "IMPACT": [
            {"text": "Activate business continuity plan", "level": "Critical"},
            {"text": "Take offline backups of critical data immediately", "level": "Critical"},
            {"text": "Engage incident response team and CERT", "level": "Critical"},
        ],
    }

    recs = stage_recs.get(stage, [
        {"text": "Increase monitoring on affected assets", "level": "Medium"},
        {"text": "Review security baselines for the sector", "level": "Low"},
    ])

    if risk_level == "CRITICAL" and criticality == "CRITICAL":
        recs.insert(0, {
            "text": "PRIORITY: Escalate to NTRO CISO immediately",
            "level": "Critical"
        })

    return recs

@router.get('/{attack_id}')
def get_attack_detail(attack_id: str):
    conn = get_connection()
    # We mock attack detail based on the ID for the prototype
    # Find first timeline event
    row = conn.execute('SELECT * FROM attack_timeline WHERE attack_id = ? ORDER BY timestamp ASC LIMIT 1', (attack_id,)).fetchone()
    if not row:
        return {'attackId': attack_id, 'status': 'Unknown', 'severity': 'Unknown'}
    return {'attackId': attack_id, 'attackType': row['classification'], 'severity': row['severity'], 'firstSeen': row['timestamp']}

@router.get('/{attack_id}/timeline')
def get_attack_timeline(attack_id: str):
    conn = get_connection()
    rows = conn.execute('SELECT * FROM attack_timeline WHERE attack_id = ? ORDER BY timestamp ASC', (attack_id,)).fetchall()
    return [dict(r) for r in rows]

