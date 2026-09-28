"""
NTRO AI Cyber Forecast - Evaluate Models Script
Loads saved models and prints evaluation summary.

Usage:
    python scripts/evaluate_models.py
"""
import sys
import json
import logging
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config import settings
from app.ml.attack_classifier import get_classifier
from app.ml.anomaly_detection import get_detector
from app.ml.forecasting import get_forecaster

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

METRICS_PATH = Path(settings.models_dir) / "classifier_metrics.json"


def main():
    print("\n" + "=" * 60)
    print("NTRO AI Cyber Forecast - Model Evaluation Report")
    print("=" * 60)

    # Attack Classifier
    clf = get_classifier()
    if clf.is_ready() and clf.metrics:
        m = clf.metrics
        print("\n[1] Attack Classifier (Random Forest)")
        print(f"    Accuracy  : {m.get('accuracy', 'N/A'):.4f}")
        print(f"    Precision : {m.get('precision', 'N/A'):.4f}")
        print(f"    Recall    : {m.get('recall', 'N/A'):.4f}")
        print(f"    F1 Score  : {m.get('f1_score', 'N/A'):.4f}")
        print(f"    Train N   : {m.get('training_samples', 'N/A')}")
        print(f"    Test N    : {m.get('test_samples', 'N/A')}")
        print(f"    Classes   : {m.get('classes', [])}")
    else:
        print("\n[1] Attack Classifier: NOT TRAINED - run train_models.py first")

    # Anomaly Detector
    det = get_detector()
    if det.is_ready():
        print("\n[2] Anomaly Detector (Isolation Forest)")
        print("    Status: TRAINED and ready")
        print(f"    Contamination: {det.contamination}")
        print(f"    Estimators: {det.n_estimators}")
    else:
        print("\n[2] Anomaly Detector: NOT TRAINED - run train_models.py first")

    # Forecaster
    forecaster = get_forecaster()
    if forecaster.is_ready():
        print("\n[3] Attack Forecaster (Markov Chain)")
        print("    Status: TRAINED and ready")
        sample = forecaster.forecast("RECONNAISSANCE")
        print(f"    Sample forecast from RECONNAISSANCE:")
        print(f"      Next stage: {sample.get('predicted_next_stage')}")
        print(f"      Confidence: {sample.get('confidence')}")
        print(f"      Time window: {sample.get('time_window')}")
    else:
        print("\n[3] Attack Forecaster: NOT TRAINED - run train_models.py first")

    print("\n" + "=" * 60 + "\n")


if __name__ == "__main__":
    main()
