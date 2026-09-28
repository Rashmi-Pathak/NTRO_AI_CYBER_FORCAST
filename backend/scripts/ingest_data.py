"""
NTRO AI Cyber Forecast - Data Ingestion Script
Loads all CSVs into SQLite database.

Usage:
    python scripts/ingest_data.py
"""
import sys
import os
import logging
import sqlite3
import pandas as pd
from pathlib import Path

# Allow imports from parent
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings
from app.database.db import init_db, get_connection

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

RAW = Path(settings.raw_data_dir)


def load_sectors(conn: sqlite3.Connection):
    path = RAW / "sectors.csv"
    df = pd.read_csv(path)
    logger.info(f"sectors.csv: {len(df)} rows, columns: {list(df.columns)}")
    df.to_sql("sectors", conn, if_exists="replace", index=False)
    logger.info("Loaded sectors.")


def load_assets(conn: sqlite3.Connection):
    path = RAW / "assets.csv"
    df = pd.read_csv(path)
    logger.info(f"assets.csv: {len(df)} rows, columns: {list(df.columns)}")
    df.to_sql("assets", conn, if_exists="replace", index=False)
    logger.info("Loaded assets.")


def load_network_events(conn: sqlite3.Connection):
    path = RAW / "network_events.csv"
    logger.info(f"Loading network_events.csv …")
    # Load in chunks for large file
    chunk_size = 5000
    total = 0
    first = True
    for chunk in pd.read_csv(path, chunksize=chunk_size):
        chunk.to_sql("network_events", conn, if_exists="replace" if first else "append", index=False)
        total += len(chunk)
        first = False
        if total % 10000 == 0:
            logger.info(f"  … {total} events loaded")
    logger.info(f"Loaded {total} network events.")


def load_threats(conn: sqlite3.Connection):
    path = RAW / "threats.csv"
    df = pd.read_csv(path)
    logger.info(f"threats.csv: {len(df)} rows")
    df.to_sql("threats", conn, if_exists="replace", index=False)
    logger.info("Loaded threats.")


def load_attack_predictions(conn: sqlite3.Connection):
    path = RAW / "attack_predictions.csv"
    df = pd.read_csv(path)
    logger.info(f"attack_predictions.csv: {len(df)} rows")
    df.to_sql("attack_predictions", conn, if_exists="replace", index=False)
    logger.info("Loaded attack predictions.")


def load_attack_timeline(conn: sqlite3.Connection):
    path = RAW / "attack_timeline.csv"
    df = pd.read_csv(path)
    logger.info(f"attack_timeline.csv: {len(df)} rows")
    # Remove autoincrement id if it exists
    if "id" in df.columns:
        df = df.drop(columns=["id"])
    df.to_sql("attack_timeline", conn, if_exists="replace", index=False)
    logger.info("Loaded attack timeline.")


def load_vulnerabilities(conn: sqlite3.Connection):
    path = RAW / "vulnerabilities.csv"
    df = pd.read_csv(path)
    logger.info(f"vulnerabilities.csv: {len(df)} rows")
    df.to_sql("vulnerabilities", conn, if_exists="replace", index=False)
    logger.info("Loaded vulnerabilities.")


def load_threat_intelligence(conn: sqlite3.Connection):
    path = RAW / "threat_intelligence.csv"
    df = pd.read_csv(path)
    logger.info(f"threat_intelligence.csv: {len(df)} rows")
    df.to_sql("threat_intelligence", conn, if_exists="replace", index=False)
    logger.info("Loaded threat intelligence.")


def load_incidents(conn: sqlite3.Connection):
    path = RAW / "incidents.csv"
    df = pd.read_csv(path)
    logger.info(f"incidents.csv: {len(df)} rows")
    df.to_sql("incidents", conn, if_exists="replace", index=False)
    logger.info("Loaded incidents.")


def load_model_registry(conn: sqlite3.Connection):
    path = RAW / "model_registry.csv"
    df = pd.read_csv(path)
    logger.info(f"model_registry.csv: {len(df)} rows")
    # Map to our schema
    records = []
    for _, row in df.iterrows():
        records.append({
            "model_id": row.get("model_id", ""),
            "model_name": row.get("model_name", ""),
            "model_type": row.get("model_name", ""),
            "purpose": row.get("purpose", ""),
            "status": row.get("status", "BASELINE"),
            "accuracy": None,
            "precision_score": None,
            "recall_score": None,
            "f1_score": None,
            "features_used": None,
            "last_trained": None,
            "training_samples": None,
            "confusion_matrix": None,
        })
    pd.DataFrame(records).to_sql("ml_models", conn, if_exists="replace", index=False)
    logger.info("Loaded model registry.")


def verify_counts(conn: sqlite3.Connection):
    tables = [
        "sectors", "assets", "network_events", "threats",
        "attack_predictions", "attack_timeline", "vulnerabilities",
        "threat_intelligence", "incidents", "ml_models"
    ]
    logger.info("=== Database Row Counts ===")
    for t in tables:
        try:
            cnt = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            logger.info(f"  {t:<25}: {cnt:>8}")
        except Exception as e:
            logger.warning(f"  {t}: ERROR - {e}")


def main():
    logger.info("Starting data ingestion …")
    init_db()
    conn = get_connection()

    try:
        load_sectors(conn)
        load_assets(conn)
        load_network_events(conn)
        load_threats(conn)
        load_attack_predictions(conn)
        load_attack_timeline(conn)
        load_vulnerabilities(conn)
        load_threat_intelligence(conn)
        load_incidents(conn)
        load_model_registry(conn)
        conn.commit()
        verify_counts(conn)
        logger.info("Data ingestion complete!")
    except Exception as e:
        logger.error(f"Ingestion failed: {e}", exc_info=True)
        conn.rollback()
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
