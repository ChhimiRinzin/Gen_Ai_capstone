"""
Tests for SessionManager state operations
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.session_manager import SessionManager


def test_session_lifecycle():
    mgr = SessionManager()
    stats = mgr.get_summary_stats()
    assert stats["total_inspections"] == 0
    assert stats["total_detections"] == 0

    insp_id = mgr.add_inspection({
        "filename": "sample_paro_road.jpg",
        "dzongkhag": "Paro",
        "road_class": "PNH",
        "detections": [
            {"class_code": "D00", "class_name": "Longitudinal Crack", "confidence": 0.82}
        ],
        "risk_assessment": {"level": "MEDIUM", "score": 38.0}
    })
    assert insp_id.startswith("INSP-")
    assert len(mgr.get_inspections()) == 1

    # Finding lifecycle
    f_id = mgr.add_audit_finding({
        "title": "Unsealed Crack in Paro Valley",
        "evidence_id": insp_id,
        "criteria": "IRC:SP:72",
        "condition": "1 Longitudinal crack detected",
        "verification_status": "Unverified"
    })
    assert f_id.startswith("FND-")
    assert len(mgr.get_audit_findings()) == 1

    # Update finding
    updated = mgr.update_audit_finding(f_id, {"verification_status": "Confirmed by Field Auditor"})
    assert updated is True
    assert mgr.get_audit_findings()[0]["verification_status"] == "Confirmed by Field Auditor"

    # Clear session
    mgr.clear_session()
    assert len(mgr.get_inspections()) == 0
    assert len(mgr.get_audit_findings()) == 0
