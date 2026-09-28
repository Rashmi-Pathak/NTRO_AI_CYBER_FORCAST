"""
NTRO AI Cyber Forecast - Risk Scoring
Transparent, multi-factor risk scoring.
"""
import logging
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)

# Stage weights: higher stage = higher base risk
STAGE_WEIGHTS = {
    "NORMAL": 0,
    "RECONNAISSANCE": 10,
    "INITIAL_ACCESS": 20,
    "CREDENTIAL_ACCESS": 35,
    "EXECUTION": 45,
    "PERSISTENCE": 50,
    "LATERAL_MOVEMENT": 65,
    "EXFILTRATION": 80,
    "IMPACT": 90,
}

CRITICALITY_WEIGHTS = {
    "CRITICAL": 30,
    "HIGH": 20,
    "MEDIUM": 10,
    "LOW": 5,
}

SEVERITY_WEIGHTS = {
    "CRITICAL": 25,
    "HIGH": 15,
    "MEDIUM": 8,
    "LOW": 3,
}

SECTOR_RISK = {
    "HIGH": 15,
    "MEDIUM": 8,
    "LOW": 3,
}


@dataclass
class RiskScore:
    risk_score: float
    risk_level: str
    reasons: list[str] = field(default_factory=list)
    components: dict = field(default_factory=dict)


def calculate_risk(
    attack_stage: str = "NORMAL",
    ml_confidence: float = 0.0,
    asset_criticality: str = "LOW",
    anomaly_score: float = 0.0,
    threat_severity: str = "LOW",
    sector_baseline_risk: str = "LOW",
    failed_auth_count: int = 0,
    traffic_burst: float = 0.0,
    intel_match: bool = False,
) -> RiskScore:
    """
    Calculate a transparent, composable risk score (0–100).
    Each factor contributes a known amount.
    """
    reasons = []
    components = {}

    # 1. Attack stage contribution
    stage_score = STAGE_WEIGHTS.get(attack_stage.upper(), 0) * ml_confidence
    components["attack_stage"] = round(stage_score, 2)
    if stage_score > 20:
        reasons.append(f"{attack_stage.replace('_', ' ').title()} pattern detected (confidence {ml_confidence:.0%})")

    # 2. Asset criticality
    crit_score = CRITICALITY_WEIGHTS.get(asset_criticality.upper(), 5)
    components["asset_criticality"] = crit_score
    if asset_criticality.upper() in ("CRITICAL", "HIGH"):
        reasons.append(f"{asset_criticality.title()} criticality asset targeted")

    # 3. Anomaly score (0..1 → 0..25)
    anomaly_contrib = anomaly_score * 25
    components["anomaly"] = round(anomaly_contrib, 2)
    if anomaly_score > 0.7:
        reasons.append("Very high network anomaly score")
    elif anomaly_score > 0.4:
        reasons.append("Elevated network anomaly score")

    # 4. Threat severity
    sev_score = SEVERITY_WEIGHTS.get(threat_severity.upper(), 3)
    components["threat_severity"] = sev_score
    if threat_severity.upper() in ("CRITICAL", "HIGH"):
        reasons.append(f"{threat_severity.title()} severity threat detected")

    # 5. Sector baseline risk
    sector_score = SECTOR_RISK.get(sector_baseline_risk.upper(), 3)
    components["sector_risk"] = sector_score
    if sector_baseline_risk.upper() == "HIGH":
        reasons.append("High-risk sector targeted")

    # 6. Authentication failures
    if failed_auth_count > 20:
        auth_score = 10
        reasons.append(f"Critical: {failed_auth_count} authentication failures")
    elif failed_auth_count > 10:
        auth_score = 6
        reasons.append(f"Multiple authentication failures ({failed_auth_count})")
    elif failed_auth_count > 3:
        auth_score = 3
        reasons.append("Authentication failures detected")
    else:
        auth_score = 0
    components["auth_failures"] = auth_score

    # 7. Traffic burst
    if traffic_burst > 10:
        burst_score = 8
        reasons.append("Abnormal traffic burst detected")
    elif traffic_burst > 5:
        burst_score = 4
        reasons.append("Elevated traffic burst")
    else:
        burst_score = 0
    components["traffic_burst"] = burst_score

    # 8. Threat intelligence match
    intel_score = 10 if intel_match else 0
    components["intel_match"] = intel_score
    if intel_match:
        reasons.append("Indicator matches known threat intelligence")

    # Total (capped at 100)
    total = sum(components.values())
    total = min(100.0, max(0.0, total))

    if total >= 80:
        level = "CRITICAL"
    elif total >= 60:
        level = "HIGH"
    elif total >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    if not reasons:
        reasons.append("Low risk — normal network activity")

    return RiskScore(
        risk_score=round(total, 1),
        risk_level=level,
        reasons=reasons,
        components=components,
    )
