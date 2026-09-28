# NTRO AI Cyber Forecast - Backend Data Directory README
# ==========================================================

# Purpose of each CSV in backend/data/raw/

## network_events.csv
# Main dataset (~30,000 rows).
# Each row is a network/security event captured from simulated infrastructure.
# ML TARGET COLUMN: attack_label
# Classes: NORMAL, RECONNAISSANCE, INITIAL_ACCESS, CREDENTIAL_ACCESS,
#          EXECUTION, PERSISTENCE, LATERAL_MOVEMENT, EXFILTRATION, IMPACT
# Key features: packet_count, byte_count, duration_seconds, failed_auth_count,
#               unique_destinations, port_diversity, outbound_ratio, traffic_burst

## assets.csv
# Inventory of all monitored network assets (hosts, servers, devices).
# Links asset_id to hostname, IP, type, sector, department, location, lat/lon,
# criticality level (CRITICAL/HIGH/MEDIUM/LOW), OS, and status.

## sectors.csv
# List of government/critical infrastructure sectors monitored.
# Contains sector_id, sector name, and baseline_risk level (HIGH/MEDIUM/LOW).

## threats.csv
# Derived threat records linked to network events.
# Contains severity, confidence, risk_score, and status per event.

## attack_predictions.csv
# ML-generated attack stage predictions for asset pairs.
# Contains current_stage, predicted_stage, confidence, risk_score, estimated_time.
# STATUS: ACTIVE / MONITORING / INVESTIGATING / RESOLVED

## attack_timeline.csv
# Chronological sequence of attack stages per attack chain (attack_id).
# Each row is a single timeline entry with stage, event description, severity,
# and classification (OBSERVED / INFERRED / PREDICTED).

## vulnerabilities.csv
# Known vulnerabilities per asset (CVE-linked).
# Severity: CRITICAL / HIGH / MEDIUM / LOW
# Status: OPEN / PATCHED / MITIGATING

## threat_intelligence.csv
# Indicators of Compromise (IoCs): hashes, IPs, domains, URLs.
# Linked to synthetic threat actors and malware families.
# ALL INDICATORS ARE SYNTHETIC - not real threat data.

## incidents.csv
# Incident management records: open cases, investigation status.
# Linked to source and target assets and sector.
# Lifecycle: OPEN → INVESTIGATING → CONTAINMENT → ERADICATION → RECOVERY → RESOLVED

## model_registry.csv
# Seed data for ML model registry.
# Actual metrics (accuracy, F1, etc.) are populated after training.

# ==========================================================
# DATA CLASSIFICATION: SYNTHETIC / DEMONSTRATION ONLY
# This dataset does NOT represent real Indian government infrastructure.
# Purpose: SIH demonstration, backend development, ML experimentation.
# ==========================================================
