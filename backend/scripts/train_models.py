"""
NTRO AI Cyber Forecast - Train Models Script
Trains Isolation Forest + Random Forest + Markov Forecaster.

Usage:
    python scripts/train_models.py
"""
import sys
import logging
import json
import sqlite3
import pandas as pd
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings
from app.database.db import get_connection
from app.ml.anomaly_detection import AnomalyDetector
from app.ml.attack_classifier import AttackClassifier
from app.ml.forecasting import AttackForecaster

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

MODELS_DIR = Path(settings.models_dir)
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def load_events(conn: sqlite3.Connection) -> pd.DataFrame:
    logger.info("Loading network events from database …")
    df = pd.read_sql("SELECT * FROM network_events", conn)
    logger.info(f"Loaded {len(df)} events.")
    return df


def train_anomaly_detector(df: pd.DataFrame):
    logger.info("=== Training Anomaly Detector (Isolation Forest) ===")
    detector = AnomalyDetector(contamination=settings.anomaly_threshold)
    detector.fit(df)
    detector.save()
    logger.info("Anomaly detector trained and saved.")


def train_attack_classifier(df: pd.DataFrame) -> dict:
    logger.info("=== Training Attack Classifier (Random Forest) ===")
    clf = AttackClassifier()
    metrics = clf.fit(df)
    clf.save()
    logger.info(f"Classifier trained. Metrics: acc={metrics['accuracy']}, f1={metrics['f1_score']}")
    return metrics


def train_forecaster(df: pd.DataFrame):
    logger.info("=== Training Attack Forecaster (Markov Chain) ===")
    forecaster = AttackForecaster()
    forecaster.fit(df)
    forecaster.save()
    logger.info("Forecaster trained and saved.")


def update_model_registry(conn: sqlite3.Connection, clf_metrics: dict):
    """Write actual training results back to the ml_models table."""
    import json as json_mod
    from datetime import datetime

    now = datetime.utcnow().isoformat()

    # Anomaly detector row
    conn.execute("""
        INSERT OR REPLACE INTO ml_models (
            model_id, model_name, model_type, purpose, status,
            accuracy, precision_score, recall_score, f1_score,
            features_used, last_trained, training_samples, confusion_matrix
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "MODEL-001", "Isolation Forest", "Anomaly Detection",
        "Detect unusual network behavior without labelled data",
        "TRAINED", None, None, None, None,
        json_mod.dumps(clf_metrics.get("features", [])),
        now, clf_metrics.get("training_samples"), None,
    ))

    # Classifier row
    conn.execute("""
        INSERT OR REPLACE INTO ml_models (
            model_id, model_name, model_type, purpose, status,
            accuracy, precision_score, recall_score, f1_score,
            features_used, last_trained, training_samples, confusion_matrix
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "MODEL-002", "Random Forest Classifier", "Supervised Classification",
        "Classify network events into attack stages",
        "TRAINED",
        clf_metrics.get("accuracy"),
        clf_metrics.get("precision"),
        clf_metrics.get("recall"),
        clf_metrics.get("f1_score"),
        json_mod.dumps(clf_metrics.get("features", [])),
        now,
        clf_metrics.get("training_samples"),
        json_mod.dumps(clf_metrics.get("confusion_matrix", [])),
    ))

    # Forecaster row
    conn.execute("""
        INSERT OR REPLACE INTO ml_models (
            model_id, model_name, model_type, purpose, status,
            features_used, last_trained
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        "MODEL-003", "Markov Chain Forecaster", "Sequence Forecasting",
        "Predict next attack stage from current observed stage",
        "TRAINED",
        json_mod.dumps(["attack_label", "timestamp", "source_asset_id"]),
        now,
    ))

    conn.commit()
    logger.info("Model registry updated in database.")


def main():
    logger.info("Starting model training pipeline …")
    conn = get_connection()

    try:
        df = load_events(conn)

        if len(df) == 0:
            logger.error("No events found. Run ingest_data.py first.")
            sys.exit(1)

        train_anomaly_detector(df)
        clf_metrics = train_attack_classifier(df)
        train_forecaster(df)
        update_model_registry(conn, clf_metrics)

        logger.info("=== All models trained successfully ===")
        logger.info(f"Classifier accuracy: {clf_metrics['accuracy']:.4f}")
        logger.info(f"Classifier F1:       {clf_metrics['f1_score']:.4f}")

    except Exception as e:
        logger.error(f"Training failed: {e}", exc_info=True)
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
