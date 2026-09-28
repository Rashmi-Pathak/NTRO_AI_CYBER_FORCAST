"""
NTRO AI Cyber Forecast - Attack Forecasting
Baseline Markov-chain next-stage forecasting.
Can be upgraded to LSTM/GRU when needed.
"""
import pandas as pd
import numpy as np
import json
import logging
from pathlib import Path
from app.config import settings

logger = logging.getLogger(__name__)

TRANSITION_PATH = Path(settings.models_dir) / "transition_matrix.json"

ATTACK_STAGES = [
    "NORMAL", "RECONNAISSANCE", "INITIAL_ACCESS", "CREDENTIAL_ACCESS",
    "EXECUTION", "PERSISTENCE", "LATERAL_MOVEMENT", "EXFILTRATION", "IMPACT"
]

# Typical estimated time windows per transition (minutes)
TIME_WINDOWS = {
    ("NORMAL", "RECONNAISSANCE"): "5–15 min",
    ("RECONNAISSANCE", "INITIAL_ACCESS"): "10–25 min",
    ("INITIAL_ACCESS", "CREDENTIAL_ACCESS"): "5–20 min",
    ("CREDENTIAL_ACCESS", "EXECUTION"): "8–18 min",
    ("EXECUTION", "PERSISTENCE"): "15–30 min",
    ("PERSISTENCE", "LATERAL_MOVEMENT"): "20–45 min",
    ("LATERAL_MOVEMENT", "EXFILTRATION"): "15–35 min",
    ("EXFILTRATION", "IMPACT"): "10–30 min",
}


class AttackForecaster:
    """
    Markov-chain based next-stage forecaster.
    Learns transition probabilities from historical event sequences.
    Clearly labelled as MODEL PREDICTION.
    """

    def __init__(self):
        self.transition_matrix: dict[str, dict[str, float]] = {}
        self._trained = False

    def fit(self, df: pd.DataFrame):
        """
        Build transition matrix from historical event data.
        df must have columns: [timestamp, source_asset_id, attack_label]
        """
        logger.info("Training attack forecaster (Markov chain) …")

        df = df.copy()
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        df = df.sort_values(["source_asset_id", "timestamp"])
        df = df.dropna(subset=["attack_label"])
        df = df[df["attack_label"].isin(ATTACK_STAGES)]

        # Count transitions per asset
        counts: dict[str, dict[str, int]] = {s: {t: 0 for t in ATTACK_STAGES} for s in ATTACK_STAGES}

        for _, group in df.groupby("source_asset_id"):
            labels = group["attack_label"].tolist()
            for i in range(len(labels) - 1):
                current = labels[i]
                next_ = labels[i + 1]
                if current in counts and next_ in counts:
                    counts[current][next_] += 1

        # Normalise to probabilities
        self.transition_matrix = {}
        for stage, nexts in counts.items():
            total = sum(nexts.values())
            if total > 0:
                self.transition_matrix[stage] = {
                    k: round(v / total, 4) for k, v in nexts.items()
                }
            else:
                # Uniform prior
                self.transition_matrix[stage] = {
                    k: round(1 / len(ATTACK_STAGES), 4) for k in ATTACK_STAGES
                }

        self._trained = True
        logger.info("Attack forecaster trained.")

    def save(self):
        TRANSITION_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(TRANSITION_PATH, "w") as f:
            json.dump(self.transition_matrix, f, indent=2)
        logger.info(f"Transition matrix saved to {TRANSITION_PATH}")

    def load(self):
        if TRANSITION_PATH.exists():
            with open(TRANSITION_PATH) as f:
                self.transition_matrix = json.load(f)
            self._trained = True
            logger.info("Attack forecaster loaded from disk.")
        else:
            logger.warning("No saved forecaster found.")

    def is_ready(self) -> bool:
        return self._trained and bool(self.transition_matrix)

    def forecast(self, current_stage: str, top_n: int = 3) -> dict:
        """
        Given the current attack stage, return MODEL PREDICTION of next stages.
        Clearly labelled as prediction, not observation.
        """
        if not self.is_ready():
            return {"error": "Forecaster not ready"}

        stage = current_stage.upper()
        if stage not in self.transition_matrix:
            stage = "NORMAL"

        probs = self.transition_matrix[stage]
        sorted_stages = sorted(probs.items(), key=lambda x: x[1], reverse=True)[:top_n]

        top_stage = sorted_stages[0][0] if sorted_stages else "UNKNOWN"
        top_prob = sorted_stages[0][1] if sorted_stages else 0.0

        time_window = TIME_WINDOWS.get((stage, top_stage), "15–45 min")

        return {
            "prediction_type": "MODEL_PREDICTION",
            "current_stage": stage,
            "predicted_next_stage": top_stage,
            "confidence": top_prob,
            "time_window": time_window,
            "top_predictions": [
                {
                    "stage": s,
                    "probability": p,
                    "time_window": TIME_WINDOWS.get((stage, s), "15–45 min"),
                }
                for s, p in sorted_stages
            ],
            "disclaimer": (
                "This is a MODEL PREDICTION based on historical patterns. "
                "It is not a confirmed observation."
            ),
        }


# Singleton
_forecaster: AttackForecaster | None = None


def get_forecaster() -> AttackForecaster:
    global _forecaster
    if _forecaster is None:
        _forecaster = AttackForecaster()
        _forecaster.load()
    return _forecaster
