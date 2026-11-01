"""
RoadSentry AI - YOLO Object Detection Engine
Supports Ultralytics YOLOv8 inference for Road Damage Dataset 2022 (RDD2022) classes.
"""
import time
from pathlib import Path
from typing import Dict, Any, List, Optional
import numpy as np

from config.settings import (
    RDD2022_CLASSES,
    MODEL_PATH,
    DEFAULT_CONF_THRESHOLD,
    DEFAULT_IOU_THRESHOLD,
)
from core.exceptions import ModelNotFoundError, InferenceError

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    YOLO = None
    ULTRALYTICS_AVAILABLE = False


class YOLODetector:
    """
    Manages loading and running real YOLO models for road hazard inspection.
    Adheres strictly to Section 7 & 8: Genuine inference, zero fabricated detections.
    """

    def __init__(self, weights_path: Optional[str] = None):
        self.weights_path = Path(weights_path or MODEL_PATH)
        self.model = None
        self.is_loaded = False
        self.model_type = "Unloaded"
        self.class_names = {}
        self._load_model()

    def _load_model(self):
        """Attempt to load YOLO weights if Ultralytics is installed and weights exist."""
        if not ULTRALYTICS_AVAILABLE:
            self.model_type = "Ultralytics Not Installed"
            return

        if self.weights_path.exists():
            try:
                self.model = YOLO(str(self.weights_path))
                self.is_loaded = True
                self.class_names = self.model.names if hasattr(self.model, "names") else {}
                
                # Check if trained on RDD2022 or COCO
                if any(k in ["D00", "D10", "D20", "D40"] for k in self.class_names.values()):
                    self.model_type = "Specialized RDD2022 Road Damage Model"
                else:
                    self.model_type = f"Generic Object Detection Model ({len(self.class_names)} classes)"
            except Exception as e:
                self.model_type = f"Load Failed: {str(e)}"
        else:
            self.model_type = f"Weights not found at {self.weights_path.name}"

    def get_status(self) -> Dict[str, Any]:
        """Return genuine model status and class configuration."""
        return {
            "ultralytics_available": ULTRALYTICS_AVAILABLE,
            "weights_path": str(self.weights_path),
            "weights_exist": self.weights_path.exists(),
            "is_loaded": self.is_loaded,
            "model_type": self.model_type,
            "supported_rdd_classes": {
                info["code"]: info["name"] for info in RDD2022_CLASSES.values()
            },
            "loaded_classes": self.class_names,
            "cpu_compatible": True
        }

    def detect(
        self,
        img_rgb: np.ndarray,
        conf_threshold: float = DEFAULT_CONF_THRESHOLD,
        iou_threshold: float = DEFAULT_IOU_THRESHOLD
    ) -> Dict[str, Any]:
        """
        Execute real YOLO inference on input image.
        Returns detection list with coordinates, class codes, area percentages, and timings.
        """
        if not self.is_loaded or self.model is None:
            # Cannot run inference if model is not loaded
            return {
                "detections": [],
                "count": 0,
                "inference_time_ms": 0.0,
                "error": f"Model is not loaded ({self.model_type}). Download or train weights before inference.",
                "model_type": self.model_type
            }

        start_time = time.time()
        img_h, img_w = img_rgb.shape[:2]
        total_image_pixels = img_h * img_w

        try:
            results = self.model.predict(
                source=img_rgb,
                conf=conf_threshold,
                iou=iou_threshold,
                verbose=False
            )
            elapsed_ms = (time.time() - start_time) * 1000.0

            detections: List[Dict[str, Any]] = []

            for result in results:
                boxes = result.boxes
                if boxes is None or len(boxes) == 0:
                    continue

                for box in boxes:
                    xyxy = box.xyxy[0].tolist()
                    conf = float(box.conf[0])
                    cls_id = int(box.cls[0])
                    raw_name = self.class_names.get(cls_id, str(cls_id))

                    # Map to RDD2022 if applicable
                    if raw_name in ["D00", "0"]:
                        code = "D00"
                        name = "Longitudinal Crack"
                    elif raw_name in ["D10", "1"]:
                        code = "D10"
                        name = "Transverse Crack"
                    elif raw_name in ["D20", "2"]:
                        code = "D20"
                        name = "Alligator Crack"
                    elif raw_name in ["D40", "3"]:
                        code = "D40"
                        name = "Pothole"
                    else:
                        code = raw_name
                        name = raw_name

                    x1, y1, x2, y2 = xyxy
                    box_w = max(0, x2 - x1)
                    box_h = max(0, y2 - y1)
                    box_area = box_w * box_h
                    area_pct = (box_area / total_image_pixels) * 100.0

                    detections.append({
                        "id": f"DET-{len(detections)+1:02d}",
                        "bbox": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                        "confidence": round(conf, 3),
                        "class_id": cls_id,
                        "class_code": code,
                        "class_name": name,
                        "area_pixels": int(box_area),
                        "area_percentage": round(area_pct, 2)
                    })

            return {
                "detections": detections,
                "count": len(detections),
                "inference_time_ms": round(elapsed_ms, 1),
                "conf_threshold": conf_threshold,
                "model_type": self.model_type,
                "error": None
            }
        except Exception as e:
            raise InferenceError(f"YOLO inference error: {str(e)}")
