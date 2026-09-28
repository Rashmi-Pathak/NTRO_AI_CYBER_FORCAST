"""
NTRO AI Cyber Forecast - Feature Engineering
Creates ML features from network_events data.
"""
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Attack label mapping for ordering
ATTACK_STAGE_ORDER = {
    "NORMAL": 0,
    "RECONNAISSANCE": 1,
    "INITIAL_ACCESS": 2,
    "CREDENTIAL_ACCESS": 3,
    "EXECUTION": 4,
    "PERSISTENCE": 5,
    "LATERAL_MOVEMENT": 6,
    "EXFILTRATION": 7,
    "IMPACT": 8,
}

FEATURE_COLUMNS = [
    "packet_count",
    "byte_count",
    "duration_seconds",
    "failed_auth_count",
    "unique_destinations",
    "port_diversity",
    "outbound_ratio",
    "traffic_burst",
    "bytes_per_packet",
    "packets_per_second",
    "bytes_per_second",
    "auth_failure_rate",
    "port_scan_score",
    "connection_intensity",
    "hour",
    "day_of_week",
    "is_weekend",
    "is_after_hours",
]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Apply feature engineering to a network_events DataFrame.
    Returns a copy with new features added.
    No future information is used (no lookahead).
    """
    df = df.copy()

    # --- Parse timestamps ---
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    # --- Derived numerical features ---
    # Avoid division by zero
    df["bytes_per_packet"] = df["byte_count"] / (df["packet_count"].clip(lower=1))
    df["packets_per_second"] = df["packet_count"] / (df["duration_seconds"].clip(lower=0.001))
    df["bytes_per_second"] = df["byte_count"] / (df["duration_seconds"].clip(lower=0.001))

    # Authentication failure rate per destination
    df["auth_failure_rate"] = df["failed_auth_count"] / (df["unique_destinations"].clip(lower=1))

    # Port scan score: high port_diversity + high unique_destinations = likely scan
    df["port_scan_score"] = (
        df["port_diversity"].fillna(0) * df["unique_destinations"].fillna(0)
    )

    # Connection intensity: packets per second weighted by byte size
    df["connection_intensity"] = df["packets_per_second"] * np.log1p(df["byte_count"])

    # --- Temporal features ---
    df["hour"] = df["timestamp"].dt.hour.fillna(0).astype(int)
    df["day_of_week"] = df["timestamp"].dt.dayofweek.fillna(0).astype(int)
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    df["is_after_hours"] = ((df["hour"] < 8) | (df["hour"] > 20)).astype(int)

    # --- Fill remaining NaNs ---
    for col in FEATURE_COLUMNS:
        if col in df.columns:
            df[col] = df[col].fillna(0)

    logger.debug(f"Feature engineering complete. Shape: {df.shape}")
    return df


def get_feature_matrix(df: pd.DataFrame) -> pd.DataFrame:
    """Return only the feature columns that exist in df."""
    available = [c for c in FEATURE_COLUMNS if c in df.columns]
    return df[available]


def encode_attack_label(label: str) -> int:
    """Map attack label to integer stage order."""
    return ATTACK_STAGE_ORDER.get(str(label).upper(), 0)
