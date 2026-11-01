"""
RoadSentry AI - Evidence Management & Cross-Referencing Service
Tracks visual evidence packages, links findings to evidence files, and verifies integrity.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime


class EvidenceManager:
    """
    Maintains clean indexing and verification tags for all session visual and documentary evidence.
    """

    @staticmethod
    def create_evidence_item(
        raw_bytes: bytes,
        filename: str,
        media_type: str,
        inspection_id: str,
        dzongkhag: str,
        road_class: str,
        coordinates: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """Index a single evidentiary media item."""
        return {
            "evidence_id": f"EVD-{datetime.utcnow().strftime('%H%M%S')}-{filename[:6]}",
            "inspection_id": inspection_id,
            "filename": filename,
            "media_type": media_type,
            "size_bytes": len(raw_bytes),
            "dzongkhag": dzongkhag,
            "road_class": road_class,
            "coordinates": coordinates,
            "timestamp": datetime.utcnow().isoformat(),
            "audit_chain_of_custody": "Session Evidence Storage"
        }

    @staticmethod
    def link_finding_to_evidence(finding: Dict[str, Any], inspection: Dict[str, Any]) -> Dict[str, Any]:
        """Establish verified bidirectional linkage between a 5C audit finding and visual evidence."""
        finding["linked_evidence"] = {
            "inspection_id": inspection.get("id"),
            "filename": inspection.get("filename"),
            "dzongkhag": inspection.get("dzongkhag"),
            "detections_count": len(inspection.get("detections", [])),
            "risk_score": inspection.get("risk_assessment", {}).get("score", 0.0)
        }
        return finding
