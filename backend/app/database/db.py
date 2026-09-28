"""
NTRO AI Cyber Forecast - Database Setup
SQLite with SQLAlchemy
"""
import sqlite3
import logging
from pathlib import Path
from app.config import settings

logger = logging.getLogger(__name__)


def get_db_path() -> str:
    """Resolve the absolute database path."""
    p = Path(settings.db_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    return str(p)


def get_connection() -> sqlite3.Connection:
    """Return a SQLite connection with row_factory."""
    conn = sqlite3.connect(get_db_path(), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    """Create all tables and indexes."""
    logger.info("Initialising database …")
    conn = get_connection()
    cur = conn.cursor()

    cur.executescript("""
    -- Sectors
    CREATE TABLE IF NOT EXISTS sectors (
        sector_id   TEXT PRIMARY KEY,
        sector      TEXT NOT NULL,
        baseline_risk TEXT
    );

    -- Assets
    CREATE TABLE IF NOT EXISTS assets (
        asset_id    TEXT PRIMARY KEY,
        hostname    TEXT,
        ip_address  TEXT,
        asset_type  TEXT,
        sector_id   TEXT REFERENCES sectors(sector_id),
        sector      TEXT,
        department  TEXT,
        location    TEXT,
        latitude    REAL,
        longitude   REAL,
        criticality TEXT,
        status      TEXT,
        os          TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_assets_sector ON assets(sector_id);
    CREATE INDEX IF NOT EXISTS idx_assets_criticality ON assets(criticality);

    -- Network Events
    CREATE TABLE IF NOT EXISTS network_events (
        event_id            TEXT PRIMARY KEY,
        timestamp           TEXT,
        source_asset_id     TEXT REFERENCES assets(asset_id),
        target_asset_id     TEXT REFERENCES assets(asset_id),
        source_ip           TEXT,
        destination_ip      TEXT,
        protocol            TEXT,
        source_port         INTEGER,
        destination_port    INTEGER,
        packet_count        INTEGER,
        byte_count          INTEGER,
        duration_seconds    REAL,
        failed_auth_count   INTEGER,
        unique_destinations INTEGER,
        port_diversity      INTEGER,
        outbound_ratio      REAL,
        traffic_burst       REAL,
        event_type          TEXT,
        attack_label        TEXT,
        sector_id           TEXT REFERENCES sectors(sector_id),
        sector              TEXT,
        asset_criticality   TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_events_timestamp     ON network_events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_src_asset     ON network_events(source_asset_id);
    CREATE INDEX IF NOT EXISTS idx_events_tgt_asset     ON network_events(target_asset_id);
    CREATE INDEX IF NOT EXISTS idx_events_attack_label  ON network_events(attack_label);
    CREATE INDEX IF NOT EXISTS idx_events_sector        ON network_events(sector_id);

    -- Threats
    CREATE TABLE IF NOT EXISTS threats (
        threat_id   TEXT PRIMARY KEY,
        event_id    TEXT REFERENCES network_events(event_id),
        timestamp   TEXT,
        threat_type TEXT,
        severity    TEXT,
        confidence  REAL,
        risk_score  REAL,
        status      TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_threats_timestamp ON threats(timestamp);
    CREATE INDEX IF NOT EXISTS idx_threats_severity  ON threats(severity);
    CREATE INDEX IF NOT EXISTS idx_threats_status    ON threats(status);

    -- Attack Predictions
    CREATE TABLE IF NOT EXISTS attack_predictions (
        prediction_id   TEXT PRIMARY KEY,
        timestamp       TEXT,
        source_asset_id TEXT REFERENCES assets(asset_id),
        target_asset_id TEXT REFERENCES assets(asset_id),
        sector          TEXT,
        current_stage   TEXT,
        predicted_stage TEXT,
        confidence      REAL,
        risk_score      REAL,
        estimated_time  TEXT,
        status          TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_pred_timestamp ON attack_predictions(timestamp);
    CREATE INDEX IF NOT EXISTS idx_pred_status    ON attack_predictions(status);

    -- Attack Timeline
    CREATE TABLE IF NOT EXISTS attack_timeline (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        attack_id       TEXT,
        timestamp       TEXT,
        stage           TEXT,
        event           TEXT,
        source_asset_id TEXT REFERENCES assets(asset_id),
        target_asset_id TEXT REFERENCES assets(asset_id),
        severity        TEXT,
        classification  TEXT,
        confidence      REAL
    );
    CREATE INDEX IF NOT EXISTS idx_timeline_attack_id ON attack_timeline(attack_id);
    CREATE INDEX IF NOT EXISTS idx_timeline_timestamp ON attack_timeline(timestamp);

    -- Vulnerabilities
    CREATE TABLE IF NOT EXISTS vulnerabilities (
        vulnerability_id TEXT PRIMARY KEY,
        asset_id         TEXT REFERENCES assets(asset_id),
        cve_id           TEXT,
        severity         TEXT,
        description      TEXT,
        status           TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_vuln_asset    ON vulnerabilities(asset_id);
    CREATE INDEX IF NOT EXISTS idx_vuln_severity ON vulnerabilities(severity);

    -- Threat Intelligence
    CREATE TABLE IF NOT EXISTS threat_intelligence (
        intel_id        TEXT PRIMARY KEY,
        indicator       TEXT,
        indicator_type  TEXT,
        source          TEXT,
        threat_actor    TEXT,
        malware         TEXT,
        risk            TEXT,
        confidence      REAL
    );
    CREATE INDEX IF NOT EXISTS idx_intel_indicator ON threat_intelligence(indicator);
    CREATE INDEX IF NOT EXISTS idx_intel_type      ON threat_intelligence(indicator_type);

    -- Incidents
    CREATE TABLE IF NOT EXISTS incidents (
        incident_id     TEXT PRIMARY KEY,
        title           TEXT,
        risk_score      REAL,
        status          TEXT,
        source_asset_id TEXT REFERENCES assets(asset_id),
        target_asset_id TEXT REFERENCES assets(asset_id),
        sector          TEXT,
        created_at      TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_incidents_status     ON incidents(status);
    CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
    CREATE INDEX IF NOT EXISTS idx_incidents_sector     ON incidents(sector);

    -- ML Models registry
    CREATE TABLE IF NOT EXISTS ml_models (
        model_id        TEXT PRIMARY KEY,
        model_name      TEXT,
        model_type      TEXT,
        purpose         TEXT,
        status          TEXT,
        accuracy        REAL,
        precision_score REAL,
        recall_score    REAL,
        f1_score        REAL,
        features_used   TEXT,
        last_trained    TEXT,
        training_samples INTEGER,
        confusion_matrix TEXT
    );
    """)

    conn.commit()
    conn.close()
    logger.info("Database initialised.")
