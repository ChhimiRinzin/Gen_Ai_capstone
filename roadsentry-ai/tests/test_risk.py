"""
Tests for RiskAssessor logic
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.risk_assessor import RiskAssessor


def test_zero_detections_returns_low_risk():
    result = RiskAssessor.calculate_risk(detections=[])
    assert result["score"] == 0.0
    assert result["level"] == "LOW"
    assert "No confirmed road damage" in result["explanation"]


def test_pothole_on_highway_scores_high_or_critical():
    pothole_detection = [
        {
            "class_code": "D40",
            "class_name": "Pothole",
            "confidence": 0.88,
            "area_percentage": 4.5
        }
    ]
    result = RiskAssessor.calculate_risk(
        detections=pothole_detection,
        road_class_code="PNH",
        dzongkhag="Chukha",
        is_monsoon_season=True
    )
    assert result["score"] >= 50.0
    assert result["level"] in ["HIGH", "CRITICAL"]
    assert "D40" in result["explanation"]


def test_risk_factors_breakdown():
    detections = [
        {"class_code": "D00", "class_name": "Longitudinal Crack", "confidence": 0.70, "area_percentage": 1.2},
        {"class_code": "D20", "class_name": "Alligator Crack", "confidence": 0.75, "area_percentage": 3.0}
    ]
    result = RiskAssessor.calculate_risk(
        detections=detections,
        road_class_code="SNH",
        dzongkhag="Thimphu"
    )
    factors = result["factor_breakdown"]
    assert factors["defects_count"] == 2
    assert factors["damage_severity_points"] > 0
    assert factors["surface_extent_points"] > 0
    assert result["score"] <= 100.0
