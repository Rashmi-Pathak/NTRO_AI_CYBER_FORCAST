import logging
from fastapi import APIRouter
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("")
def get_attack_paths():
    conn = get_connection()
    try:
        # Just grab the latest distinct attacks from attack_timeline
        attacks = conn.execute(
            "SELECT DISTINCT attack_id FROM attack_timeline ORDER BY attack_id DESC LIMIT 10"
        ).fetchall()
        return [dict(a) for a in attacks]
    finally:
        conn.close()

@router.get("/{attack_id}")
def get_attack_path_detail(attack_id: str):
    conn = get_connection()
    try:
        # Query the stages and construct a kill chain
        timeline = conn.execute(
            "SELECT * FROM attack_timeline WHERE attack_id = ? ORDER BY timestamp ASC",
            (attack_id,)
        ).fetchall()
        
        stages_found = set([r["stage"] for r in timeline])
        all_stages = [
            "Reconnaissance", "Weaponization", "Delivery", "Exploitation",
            "Installation", "C2 Communication", "Action on Objectives"
        ]
        
        # Build chain
        chain = []
        for i, s in enumerate(all_stages):
            active = s in stages_found
            if active and timeline:
                latest_ev = [t for t in timeline if t["stage"] == s][-1]
                sub = latest_ev["classification"]
            else:
                sub = "Pending"
            chain.append({
                "num": i+1,
                "label": s,
                "sub": sub,
                "active": active
            })
            
        nodes = []
        edges = []
        
        # Build mock nodes/edges just based on DB data
        return {
            "attackId": attack_id,
            "chain": chain,
            "timeline": [dict(t) for t in timeline]
        }
    finally:
        conn.close()
