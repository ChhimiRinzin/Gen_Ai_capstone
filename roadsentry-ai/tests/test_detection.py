"""
Tests for YOLO and Computer Vision processing
"""
import sys
from pathlib import Path
import numpy as np
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.image_processor import ImageProcessor
from services.yolo_detector import YOLODetector


def test_image_quality_analysis():
    # Synthetic clean image
    synthetic_img = np.ones((480, 640, 3), dtype=np.uint8) * 120
    # Add high contrast pattern
    synthetic_img[100:200, 100:200] = 240
    synthetic_img[200:300, 200:300] = 20

    res = ImageProcessor.analyze_image_quality(synthetic_img)
    assert res["dimensions"]["width"] == 640
    assert res["dimensions"]["height"] == 480
    assert res["brightness"] > 0
    assert res["contrast"] > 0


def test_yolo_status_reporting_without_fabrication():
    # Tests that when weights are absent, detector reports genuine status rather than inventing detections
    detector = YOLODetector("models/nonexistent_model.pt")
    status = detector.get_status()
    assert "D00" in status["supported_rdd_classes"]
    assert "D40" in status["supported_rdd_classes"]
    assert status["weights_exist"] is False
    
    # Inference with unloaded model returns zero detections and truthful notice
    dummy_img = np.zeros((100, 100, 3), dtype=np.uint8)
    det_res = detector.detect(dummy_img)
    assert det_res["count"] == 0
    assert det_res["error"] is not None
