"""
Tests for 5C Audit Finding Generator and Criteria Comparison
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.audit_analyzer import AuditAnalyzer


def test_5c_finding_structure():
    sample_inspection = {
        "id": "INSP-001",
        "filename": "dochula_pnh2.jpg",
        "dzongkhag": "Punakha",
        "road_class": "PNH",
        "detections": [
            {"class_code": "D40", "class_name": "Pothole", "confidence": 0.91, "area_percentage": 2.5}
        ],
        "risk_assessment": {"level": "CRITICAL", "score": 82.0}
    }
    
    criterion = {
        "ref": "MoIT Road Maintenance Manual Section 4.2",
        "criterion": "Potholes exceeding 25mm depth shall be temporarily flagged and permanently repaired within 48 hours."
    }

    finding = AuditAnalyzer.generate_5c_finding(sample_inspection, criterion)
    
    # Verify the 5 components exist
    assert "criteria" in finding
    assert "condition" in finding
    assert "cause" in finding
    assert "consequence" in finding
    assert "recommendation" in finding
    
    # Cause must contain the mandatory unverified warning
    assert "Not established — requires auditor verification" in finding["cause"]
    assert "Pothole" in finding["condition"]
    assert finding["evidence_id"] == "INSP-001"
