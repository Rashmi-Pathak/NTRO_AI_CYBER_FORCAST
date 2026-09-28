"""
NTRO AI Cyber Forecast - Attack Classifier
Random Forest classifier for attack_label prediction.
"""
import numpy as np
import pandas as pd
import joblib
import json
import logging
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix, classification_report
)

from app.config import settings
from app.ml.feature_engineering import engineer_features, get_feature_matrix, FEATURE_COLUMNS

logger = logging.getLogger(__name__)

MODEL_PATH = Path(settings.models_dir) / "attack_classifier.joblib"
ENCODER_PATH = Path(settings.models_dir) / "attack_label_encoder.joblib"
SCALER_PATH = Path(settings.models_dir) / "classifier_scaler.joblib"
METRICS_PATH = Path(settings.models_dir) / "classifier_metrics.json"

ATTACK_CLASSES = [
    "NORMAL", "RECONNAISSANCE", "INITIAL_ACCESS", "CREDENTIAL_ACCESS",
    "EXECUTION", "PERSISTENCE", "LATERAL_MOVEMENT", "EXFILTRATION", "IMPACT"
]


class AttackClassifier:
    """
    Random Forest classifier for attack stage prediction.
    Trained once, loaded for inference.
    """

    def __init__(self):
        self.model: RandomForestClassifier | None = None
        self.encoder: LabelEncoder | None = None
        self.scaler: StandardScaler | None = None
        self.metrics: dict = {}
        self._loaded = False

    def fit(self, df: pd.DataFrame) -> dict:
        """
        Train on network_events DataFrame.
        Returns actual evaluation metrics from held-out test set.
        """
        logger.info("Training attack classifier …")

        df = engineer_features(df)
        df = df.dropna(subset=["attack_label"])
        df = df[df["attack_label"].isin(ATTACK_CLASSES)]

        X = get_feature_matrix(df)
        y = df["attack_label"]

        # Encode labels
        self.encoder = LabelEncoder()
        y_enc = self.encoder.fit_transform(y)

        # Scale
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)

        # Split – NO data leakage
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y_enc, test_size=0.2, random_state=42, stratify=y_enc
        )

        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=20,
            min_samples_leaf=5,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )
        self.model.fit(X_train, y_train)

        # Evaluate on test set
        y_pred = self.model.predict(X_test)
        classes = self.encoder.classes_.tolist()

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
        rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
        f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
        cm = confusion_matrix(y_test, y_pred).tolist()

        self.metrics = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": cm,
            "classes": classes,
            "training_samples": len(X_train),
            "test_samples": len(X_test),
            "features": list(X.columns),
            "classification_report": classification_report(
                y_test, y_pred, target_names=classes, output_dict=True, zero_division=0
            ),
        }

        self._loaded = True
        logger.info(
            f"Classifier trained. Accuracy={acc:.4f} F1={f1:.4f} "
            f"on {len(X_test)} test samples."
        )
        return self.metrics

    def save(self):
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
        joblib.dump(self.encoder, ENCODER_PATH)
        joblib.dump(self.scaler, SCALER_PATH)
        with open(METRICS_PATH, "w") as f:
            json.dump(self.metrics, f, indent=2)
        logger.info(f"Classifier saved to {MODEL_PATH}")

    def load(self):
        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
            self.encoder = joblib.load(ENCODER_PATH)
            self.scaler = joblib.load(SCALER_PATH)
            if METRICS_PATH.exists():
                with open(METRICS_PATH) as f:
                    self.metrics = json.load(f)
            self._loaded = True
            logger.info("Attack classifier loaded from disk.")
        else:
            logger.warning("No saved attack classifier found.")

    def is_ready(self) -> bool:
        return self._loaded and self.model is not None

    def predict(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Returns df with predicted_attack, confidence, class_probabilities columns.
        """
        if not self.is_ready():
            raise RuntimeError("Classifier not trained/loaded.")

        df = df.copy()
        df_feat = engineer_features(df)
        X = get_feature_matrix(df_feat)
        X_scaled = self.scaler.transform(X)

        probs = self.model.predict_proba(X_scaled)
        pred_idx = np.argmax(probs, axis=1)
        classes = self.encoder.classes_

        df["predicted_attack"] = classes[pred_idx]
        df["confidence"] = np.max(probs, axis=1).round(4)
        df["class_probabilities"] = [
            {c: round(float(p), 4) for c, p in zip(classes, row)}
            for row in probs
        ]
        return df

    def predict_single(self, event_dict: dict) -> dict:
        """Predict a single event."""
        df = pd.DataFrame([event_dict])
        result = self.predict(df)
        return {
            "predicted_attack": result["predicted_attack"].iloc[0],
            "confidence": float(result["confidence"].iloc[0]),
            "class_probabilities": result["class_probabilities"].iloc[0],
        }


# Singleton
_classifier: AttackClassifier | None = None


def get_classifier() -> AttackClassifier:
    global _classifier
    if _classifier is None:
        _classifier = AttackClassifier()
        _classifier.load()
    return _classifier
