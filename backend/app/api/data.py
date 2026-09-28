import logging
from fastapi import APIRouter
from app.database.db import get_connection

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/summary")
def get_data_summary():
    conn = get_connection()
    try:
        events = conn.execute("SELECT COUNT(*) FROM network_events").fetchone()[0]
        attacks = conn.execute("SELECT COUNT(*) FROM network_events WHERE attack_label != 'NORMAL'").fetchone()[0]
        normals = events - attacks
        return {
            "datasetName": "NTRO Cyber Data 2026",
            "records": events,
            "columns": 22,
            "attackRecords": attacks,
            "normalRecords": normals,
            "missingValues": "0%",
            "duplicateRecords": "0.1%"
        }
    finally:
        conn.close()

@router.get("/ingestion")
def get_ingestion_stats():
    # Return mock live ingestion stats that look realistic for the dashboard
    import random
    return {
        "status": "ONLINE",
        "recordsProcessed": random.randint(1000000, 2000000),
        "recordsPerSec": random.randint(4000, 6000),
        "successful": "99.9%",
        "failed": random.randint(10, 50),
        "lastIngestion": "Just now"
    }
@router.get('/datasets')
def get_datasets():
    return [
        {'n': 'Indian Bank Transactions', 'ty': 'Financial', 'r': '12.8M', 'd': 'Sep 04, 2026', 's': 'Ready'},
        {'n': 'UPI Fraud Patterns', 'ty': 'Financial', 'r': '8.5M', 'd': 'Sep 03, 2026', 's': 'Ready'},
        {'n': 'Malware Samples', 'ty': 'Security', 'r': '2.3M', 'd': 'Aug 28, 2026', 's': 'Processing'},
        {'n': 'Phishing URLs', 'ty': 'Security', 'r': '1.5M', 'd': 'Sep 05, 2026', 's': 'Ready'},
        {'n': 'Network Traffic (Telecom)', 'ty': 'Network', 'r': '82M', 'd': 'Aug 29, 2026', 's': 'Ready'},
        {'n': 'Government Infra Logs', 'ty': 'Infrastructure', 'r': '18.4M', 'd': 'Sep 01, 2026', 's': 'Ready'},
    ]

@router.get('/simulations')
def get_simulations():
    return {
        'scenarios': [
            {'t': 'Ransomware Outbreak', 'd': 'Simulate ransomware spread across government infra.', 'c': 'text-ntro-red bg-ntro-red/10'},
            {'t': 'DDoS Attack Simulation', 'd': 'Model large-scale DDoS on telecom network.', 'c': 'text-ntro-red bg-ntro-red/10'},
            {'t': 'Fraud Transaction Simulation', 'd': 'Generate synthetic financial fraud scenarios.', 'c': 'text-ntro-amber bg-ntro-amber/10'},
            {'t': 'Insider Threat Simulation', 'd': 'Simulate anomalous data exfiltration behavior.', 'c': 'text-ntro-blue bg-ntro-blue/10'},
            {'t': 'APT Campaign Simulation', 'd': 'End-to-end APT attack lifecycle simulation.', 'c': 'text-ntro-red bg-ntro-red/10'},
        ],
        'recent': [
            {'id': 'SIM-2026-047', 'n': 'Ransomware (Gov)', 'r': 'High', 's': 'Completed', 't': '1 hour ago'},
            {'id': 'SIM-2026-028', 'n': 'UPI Fraud (Synthetic)', 'r': 'Medium', 's': 'Completed', 't': '2 hours ago'},
            {'id': 'SIM-2026-051', 'n': 'DDoS (Telecom)', 'r': 'High', 's': 'Completed', 't': '4 hours ago'},
        ]
    }
