"""
NTRO AI Cyber Forecast - Anomaly Detection
Uses Isolation Forest to flag unusual network behavior.
"""
import numpy as np
import pandas as pd
import joblib
import logging
from pathlib import Path
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

from app.config import settings
from app.ml.feature_engineering import engineer_features, get_feature_matrix, FEATURE_COLUMNS

logger = logging.getLogger(__name__)

MODEL_PATH = Path(settings.models_dir) / "isolation_forest.joblib"
SCALER_PATH = Path(settings.models_dir) / "anomaly_scaler.joblib"


class AnomalyDetector:
    """
    Wraps Isolation Forest for network anomaly detection.
    Threshold is configurable.
    """

    def __init__(self, contamination: float = 0.1, n_estimators: int = 100):
        self.contamination = contamination
        self.n_estimators = n_estimators
        self.model: IsolationForest | None = None
        self.scaler: StandardScaler | None = None
        self._loaded = False

    def fit(self, df: pd.DataFrame):
        """Train on a DataFrame of network events."""
        df = engineer_features(df)
        X = get_feature_matrix(df)

        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        self.model = IsolationForest(
            n_estimators=self.n_estimators,
            contamination=self.contamination,
            random_state=42,
            n_jobs=-1,
        )
        self.model.fit(X_scaled)
        self._loaded = True
        logger.info(f"Anomaly detector trained on {len(X)} samples.")

    def save(self):
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
        logger.info(f"Anomaly detector saved to {MODEL_PATH}")

    def load(self):
        if MODEL_PATH.exists() and SCALER_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            self._loaded = True
            logger.info("Anomaly detector loaded from disk.")
        else:
            logger.warning("No saved anomaly detector found.")

    def is_ready(self) -> bool:
        return self._loaded and self.model is not None

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Returns df with anomaly_score and anomaly_label columns.
        anomaly_score: higher = more anomalous (0..1 range, normalised)
        anomaly_label: NORMAL | ANOMALOUS
        """
        if not self.is_ready():
            raise RuntimeError("Anomaly detector not trained/loaded.")

        df = df.copy()
        df_feat = engineer_features(df)
        X = get_feature_matrix(df_feat)
        X_scaled = self.scaler.transform(X)

        # Raw decision function: lower = more anomalous
        raw_scores = self.model.decision_function(X_scaled)
        # Normalise to 0..1 where 1 = most anomalous
        min_s, max_s = raw_scores.min(), raw_scores.max()
        if max_s > min_s:
            anomaly_score = 1.0 - (raw_scores - min_s) / (max_s - min_s)
        else:
            anomaly_score = np.zeros(len(raw_scores))

        predictions = self.model.predict(X_scaled)  # -1 = anomaly, 1 = normal

        df["anomaly_score"] = np.round(anomaly_score, 4)
        df["anomaly_label"] = ["ANOMALOUS" if p == -1 else "NORMAL" for p in predictions]
        return df

    def predict_single(self, event_dict: dict) -> dict:
        """Predict for a single event (as dict)."""
        df = pd.DataFrame([event_dict])
        result = self.predict(df)
        return {
            "anomaly_score": float(result["anomaly_score"].iloc[0]),
            "anomaly_label": result["anomaly_label"].iloc[0],
        }


# Singleton
_detector: AnomalyDetector | None = None


def get_detector() -> AnomalyDetector:
    global _detector
    if _detector is None:
        _detector = AnomalyDetector(contamination=settings.anomaly_threshold)
        _detector.load()
    return _detector
