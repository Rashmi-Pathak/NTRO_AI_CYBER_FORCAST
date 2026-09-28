import pandas as pd
import numpy as np
import joblib
import json
from pathlib import Path
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_PATH = Path("data/raw/network_events.csv")
MODEL_DIR = Path("app/ml/model")
MODEL_PATH = MODEL_DIR / "attack_forecast_model.pkl"
META_PATH = MODEL_DIR / "forecast_metadata.json"

def prepare_data(df: pd.DataFrame, window_hours=6):
    """
    Groups data into time windows and creates temporal and lag features.
    Target is the attack count in the NEXT time window.
    """
    df = df.copy()
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values("timestamp")
    
    # Create an attack indicator
    df["is_attack"] = (df["attack_label"] != "NORMAL").astype(int)
    
    # Resample into time windows
    df.set_index("timestamp", inplace=True)
    
    # We want to predict not just total attacks, but maybe also by top attack types
    # For baseline, let's predict total attacks
    resampled = df.resample(f"{window_hours}h").agg({
        "event_id": "count",
        "is_attack": "sum",
        "failed_auth_count": "sum",
        "byte_count": "mean",
    }).rename(columns={"event_id": "total_events", "is_attack": "attack_count"})
    
    resampled = resampled.fillna(0)
    
    # Feature Engineering
    resampled["hour"] = resampled.index.hour
    resampled["day_of_week"] = resampled.index.dayofweek
    resampled["is_weekend"] = resampled["day_of_week"].isin([5, 6]).astype(int)
    
    # Rolling features (no lookahead!)
    resampled["rolling_mean_4"] = resampled["attack_count"].rolling(4, min_periods=1).mean()
    resampled["rolling_std_4"] = resampled["attack_count"].rolling(4, min_periods=1).std().fillna(0)
    
    # Lag features
    resampled["lag_1"] = resampled["attack_count"].shift(1)
    resampled["lag_2"] = resampled["attack_count"].shift(2)
    resampled["lag_4"] = resampled["attack_count"].shift(4)
    
    # Target: the attack_count of the NEXT window
    resampled["target_next_window"] = resampled["attack_count"].shift(-1)
    
    # Drop NaNs from shifts
    resampled = resampled.dropna()
    
    return resampled

def main():
    logger.info(f"Loading data from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    
    logger.info("Cleaning and sorting chronologically...")
    processed_df = prepare_data(df, window_hours=6)
    
    features = [
        "total_events", "attack_count", "failed_auth_count", "byte_count",
        "hour", "day_of_week", "is_weekend",
        "rolling_mean_4", "rolling_std_4", "lag_1", "lag_2", "lag_4"
    ]
    target = "target_next_window"
    
    X = processed_df[features]
    y = processed_df[target]
    
    # Chronological Split (70% train, 15% val, 15% test)
    train_idx = int(len(X) * 0.7)
    val_idx = int(len(X) * 0.85)
    
    X_train, y_train = X.iloc[:train_idx], y.iloc[:train_idx]
    X_val, y_val = X.iloc[train_idx:val_idx], y.iloc[train_idx:val_idx]
    X_test, y_test = X.iloc[val_idx:], y.iloc[val_idx:]
    
    logger.info(f"Train samples: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
    
    logger.info("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    logger.info("Evaluating model...")
    y_pred_val = model.predict(X_val)
    val_mae = mean_absolute_error(y_val, y_pred_val)
    val_rmse = mean_squared_error(y_val, y_pred_val) ** 0.5
    
    y_pred_test = model.predict(X_test)
    test_mae = mean_absolute_error(y_test, y_pred_test)
    test_rmse = mean_squared_error(y_test, y_pred_test) ** 0.5
    test_r2 = r2_score(y_test, y_pred_test)
    
    logger.info(f"Validation MAE: {val_mae:.2f}, RMSE: {val_rmse:.2f}")
    logger.info(f"Test MAE: {test_mae:.2f}, RMSE: {test_rmse:.2f}, R2: {test_r2:.3f}")
    
    # Save Model
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    logger.info(f"Model saved to {MODEL_PATH}")
    
    # Save Metadata
    metadata = {
        "modelName": "AttackForecastModel",
        "version": "1.0",
        "features": features,
        "target": target,
        "window_hours": 6,
        "trainingRows": len(X_train),
        "metrics": {
            "validation_mae": round(val_mae, 2),
            "test_mae": round(test_mae, 2),
            "test_r2": round(test_r2, 3)
        }
    }
    with open(META_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    logger.info("Metadata saved.")

if __name__ == "__main__":
    main()
