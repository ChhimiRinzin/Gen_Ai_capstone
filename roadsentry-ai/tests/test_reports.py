"""
Tests for Report Generation and CSV/JSON Exports
"""
import sys
import json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.report_generator import ReportGenerator


def test_json_and_csv_generation():
    inspections = [
        {
            "id": "INSP-001",
            "filename": "phuntsholing_highway.jpg",
            "dzongkhag": "Chukha",
            "road_class": "PNH",
            "detections": [
                {"class_code": "D20", "class_name": "Alligator Crack", "confidence": 0.85, "area_percentage": 5.2}
            ],
            "risk_assessment": {"level": "HIGH", "score": 64.0, "factor_breakdown": {"total_area_pct": 5.2}},
            "created_at": "2026-11-01T10:00:00"
        }
    ]

    csv_out = ReportGenerator.generate_csv_inspections(inspections)
    assert "Inspection_ID" in csv_out
    assert "phuntsholing_highway.jpg" in csv_out
    assert "Alligator Crack" not in csv_out or "D20" in csv_out

    session_data = {
        "session_id": "TEST-123",
        "inspections": inspections
    }
    json_out = ReportGenerator.generate_json_export(session_data)
    parsed = json.loads(json_out)
    assert parsed["session_id"] == "TEST-123"
    assert len(parsed["inspections"]) == 1
