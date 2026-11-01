"""
RoadSentry AI - Supervised Machine Learning Risk Predictor
Provides scikit-learn pipeline for training and evaluating an interpretable Random Forest classifier
on empirical road distress features.
"""
from typing import Dict, Any, List, Optional, Tuple
import numpy as np

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


class MLRiskPredictor:
    """
    Supervised Machine Learning module for road hazard risk classification.
    Distinguishes trained empirical models from heuristic scoring as mandated by Section 11.
    """

    FEATURE_NAMES = [
        "defect_count",
        "has_pothole_d40",
        "has_alligator_d20",
        "total_area_pct",
        "max_confidence",
        "road_priority_factor"
    ]

    LABEL_NAMES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    def __init__(self):
        self.is_trained = False
        self.model = None
        self.metrics: Dict[str, Any] = {}

    @staticmethod
    def extract_features(inspection: Dict[str, Any]) -> List[float]:
        """Convert inspection data into structured ML feature vector."""
        detections = inspection.get("detections", [])
        defect_count = len(detections)
        has_pothole = 1.0 if any(d.get("class_code") == "D40" for d in detections) else 0.0
        has_alligator = 1.0 if any(d.get("class_code") == "D20" for d in detections) else 0.0
        total_area = sum(d.get("area_percentage", 0.0) for d in detections)
        max_conf = max([d.get("confidence", 0.0) for d in detections], default=0.0)
        
        # Road class priority factor
        road_class = inspection.get("road_class", "PNH")
        weight_map = {"PNH": 1.5, "SNH": 1.25, "UR": 1.3, "DR": 1.1, "FR": 0.9}
        road_factor = weight_map.get(road_class, 1.0)

        return [
            float(defect_count),
            has_pothole,
            has_alligator,
            float(total_area),
            float(max_conf),
            float(road_factor)
        ]

    def train_baseline_model(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """
        Train Random Forest model with genuine train/test split and calculate verified metrics.
        No fabricated metrics: computed strictly from actual split evaluation.
        """
        if not SKLEARN_AVAILABLE:
            return {"trained": False, "error": "scikit-learn not available in environment"}

        if len(X) < 12:
            return {"trained": False, "error": "Insufficient dataset size (minimum 12 samples required for train/test split)"}

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=42, stratify=y if len(set(y)) > 1 else None
        )

        clf = RandomForestClassifier(n_estimators=50, max_depth=4, random_state=42)
        clf.fit(X_train, y_train)

        y_pred = clf.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred).tolist()

        # Feature importances
        importances = dict(zip(self.FEATURE_NAMES, [round(float(v), 3) for v in clf.feature_importances_]))

        self.model = clf
        self.is_trained = True
        self.metrics = {
            "trained": True,
            "accuracy": round(float(acc), 3),
            "confusion_matrix": cm,
            "feature_importance": importances,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "algorithm": "RandomForestClassifier(n_estimators=50, max_depth=4)"
        }
        return self.metrics

    def predict(self, features: List[float]) -> Dict[str, Any]:
        """Inference with trained Random Forest model."""
        if not self.is_trained or self.model is None:
            return {
                "trained": False,
                "message": "Supervised ML model not yet trained. System is operating on explainable rule-based scoring."
            }

        X = np.array(features).reshape(1, -1)
        pred_idx = self.model.predict(X)[0]
        probs = self.model.predict_proba(X)[0]

        pred_label = self.LABEL_NAMES[pred_idx] if pred_idx < len(self.LABEL_NAMES) else str(pred_idx)
        return {
            "predicted_risk_tier": pred_label,
            "probabilities": {name: round(float(p), 3) for name, p in zip(self.LABEL_NAMES, probs)},
            "model_type": "RandomForest"
        }
