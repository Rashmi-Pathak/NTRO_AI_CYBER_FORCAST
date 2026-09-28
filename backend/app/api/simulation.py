"""NTRO API - Simulation endpoints
Clearly separated from real data. All events are SIMULATED.
"""
import random
import logging
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory simulation state
_sim_state = {
    "running": False,
    "scenario": None,
    "generated_events": [],
    "current_stage_idx": 0,
    "started_at": None,
}

ATTACK_SCENARIOS = {
    "full_kill_chain": [
        "NORMAL", "RECONNAISSANCE", "INITIAL_ACCESS",
        "CREDENTIAL_ACCESS", "EXECUTION", "PERSISTENCE",
        "LATERAL_MOVEMENT", "EXFILTRATION", "IMPACT"
    ],
    "credential_attack": [
        "NORMAL", "RECONNAISSANCE", "CREDENTIAL_ACCESS", "LATERAL_MOVEMENT"
    ],
    "ransomware": [
        "NORMAL", "INITIAL_ACCESS", "EXECUTION", "PERSISTENCE", "IMPACT"
    ],
    "data_exfiltration": [
        "NORMAL", "RECONNAISSANCE", "INITIAL_ACCESS", "EXFILTRATION"
    ],
}

PROTOCOLS = ["TCP", "UDP", "HTTP", "HTTPS", "SSH", "SMB", "DNS", "ICMP"]
SECTORS = ["Government", "Banking & Finance", "Power Infrastructure",
           "Telecom", "Defence", "Healthcare"]


def _generate_synthetic_event(stage: str, scenario: str) -> dict:
    """Generate a single synthetic network event for the given attack stage."""
    now = datetime.now(timezone.utc).isoformat()

    base = {
        "event_id": f"SIM-{random.randint(100000, 999999)}",
        "timestamp": now,
        "source_asset_id": f"AST-{random.randint(1, 500):04d}",
        "target_asset_id": f"AST-{random.randint(1, 500):04d}",
        "source_ip": f"10.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}",
        "destination_ip": f"10.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}",
        "protocol": random.choice(PROTOCOLS),
        "source_port": random.randint(1024, 65535),
        "destination_port": random.choice([22, 80, 443, 445, 3389, 8080, 1433]),
        "packet_count": random.randint(50, 500),
        "byte_count": random.randint(1000, 500000),
        "duration_seconds": round(random.uniform(0.5, 120), 2),
        "attack_label": stage,
        "sector": random.choice(SECTORS),
        "asset_criticality": random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        "event_classification": "SIMULATED",
        "scenario": scenario,
    }

    # Stage-specific anomalies
    if stage == "RECONNAISSANCE":
        base["failed_auth_count"] = 0
        base["unique_destinations"] = random.randint(20, 100)
        base["port_diversity"] = random.randint(30, 100)
        base["traffic_burst"] = round(random.uniform(2, 5), 2)
        base["event_type"] = "Port Scan"
    elif stage == "CREDENTIAL_ACCESS":
        base["failed_auth_count"] = random.randint(15, 50)
        base["unique_destinations"] = random.randint(3, 10)
        base["port_diversity"] = 1
        base["traffic_burst"] = round(random.uniform(4, 8), 2)
        base["event_type"] = "Brute Force"
    elif stage == "LATERAL_MOVEMENT":
        base["failed_auth_count"] = random.randint(5, 20)
        base["unique_destinations"] = random.randint(8, 30)
        base["port_diversity"] = random.randint(5, 20)
        base["traffic_burst"] = round(random.uniform(3, 7), 2)
        base["event_type"] = "Lateral Movement"
    elif stage == "EXFILTRATION":
        base["byte_count"] = random.randint(1000000, 10000000)
        base["outbound_ratio"] = round(random.uniform(0.8, 1.0), 3)
        base["traffic_burst"] = round(random.uniform(6, 12), 2)
        base["event_type"] = "Data Exfiltration"
    elif stage == "IMPACT":
        base["byte_count"] = random.randint(100000, 5000000)
        base["traffic_burst"] = round(random.uniform(8, 15), 2)
        base["event_type"] = "Impact"
    else:
        base["failed_auth_count"] = random.randint(0, 2)
        base["unique_destinations"] = random.randint(1, 5)
        base["port_diversity"] = random.randint(1, 3)
        base["traffic_burst"] = round(random.uniform(0.5, 2), 2)
        base["outbound_ratio"] = round(random.uniform(0.3, 0.6), 3)
        base["event_type"] = "Normal Traffic"

    return base


class SimulationStart(BaseModel):
    scenario: Optional[str] = "full_kill_chain"


@router.get("/status")
def simulation_status():
    return {
        "running": _sim_state["running"],
        "scenario": _sim_state["scenario"],
        "current_stage": (
            ATTACK_SCENARIOS.get(_sim_state["scenario"] or "", [None])[
                _sim_state["current_stage_idx"]
            ] if _sim_state["running"] else None
        ),
        "events_generated": len(_sim_state["generated_events"]),
        "started_at": _sim_state["started_at"],
        "available_scenarios": list(ATTACK_SCENARIOS.keys()),
        "disclaimer": "All events are SIMULATED. Not connected to real network traffic.",
    }


@router.post("/start")
def start_simulation(body: SimulationStart):
    scenario = body.scenario or "full_kill_chain"
    if scenario not in ATTACK_SCENARIOS:
        return {"error": f"Unknown scenario. Available: {list(ATTACK_SCENARIOS.keys())}"}

    _sim_state["running"] = True
    _sim_state["scenario"] = scenario
    _sim_state["generated_events"] = []
    _sim_state["current_stage_idx"] = 0
    _sim_state["started_at"] = datetime.now(timezone.utc).isoformat()

    # Generate events for all stages immediately
    stages = ATTACK_SCENARIOS[scenario]
    for stage in stages:
        for _ in range(random.randint(3, 8)):
            event = _generate_synthetic_event(stage, scenario)
            _sim_state["generated_events"].append(event)

    logger.info(f"Simulation started: scenario={scenario}, events={len(_sim_state['generated_events'])}")
    return {
        "message": "Simulation started",
        "scenario": scenario,
        "stages": stages,
        "events_generated": len(_sim_state["generated_events"]),
        "events": _sim_state["generated_events"],
        "disclaimer": "SIMULATED events only — not real network traffic.",
    }


@router.post("/stop")
def stop_simulation():
    _sim_state["running"] = False
    _sim_state["scenario"] = None
    count = len(_sim_state["generated_events"])
    _sim_state["generated_events"] = []
    _sim_state["current_stage_idx"] = 0
    logger.info("Simulation stopped.")
    return {"message": "Simulation stopped", "total_events_generated": count}


@router.get("/events")
def get_simulation_events():
    """Return all events generated in the current/last simulation."""
    return {
        "running": _sim_state["running"],
        "scenario": _sim_state["scenario"],
        "events": _sim_state["generated_events"],
        "disclaimer": "SIMULATED events only.",
    }
