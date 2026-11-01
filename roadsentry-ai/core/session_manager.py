"""
RoadSentry AI - In-Memory Session State Manager
Enforces strict session-only data handling without any persistent database.
"""
from datetime import datetime
from typing import Dict, List, Any, Optional
import uuid

class SessionManager:
    """
    Manages in-memory session data for RoadSentry AI.
    Follows Section 4 requirements: Strictly zero persistent database.
    """

    def __init__(self, state_dict: Optional[Dict[str, Any]] = None):
        if state_dict is None:
            self._state: Dict[str, Any] = {}
        else:
            self._state = state_dict
        self._ensure_defaults()

    def _ensure_defaults(self):
        """Initialize session containers if absent."""
        defaults = {
            "inspections": [],
            "documents": [],
            "audit_findings": [],
            "chat_history": [],
            "actions_log": [],
            "session_id": str(uuid.uuid4())[:8],
            "started_at": datetime.utcnow().isoformat(),
        }
        for key, val in defaults.items():
            if key not in self._state:
                self._state[key] = val

    def log_action(self, action_name: str, details: Optional[Dict[str, Any]] = None):
        """Append an action to session activity trail."""
        entry = {
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "action": action_name,
            "details": details or {}
        }
        self._state["actions_log"].insert(0, entry)
        if len(self._state["actions_log"]) > 50:
            self._state["actions_log"] = self._state["actions_log"][:50]

    def add_inspection(self, inspection_data: Dict[str, Any]) -> str:
        """Add a verified inspection record to the current session."""
        rec_id = inspection_data.get("id") or f"INSP-{len(self._state['inspections']) + 1:03d}"
        inspection_data["id"] = rec_id
        inspection_data["created_at"] = inspection_data.get("created_at") or datetime.utcnow().isoformat()
        
        self._state["inspections"].append(inspection_data)
        self.log_action("Add Inspection", {
            "id": rec_id,
            "filename": inspection_data.get("filename"),
            "detections_count": len(inspection_data.get("detections", []))
        })
        return rec_id

    def get_inspections(self) -> List[Dict[str, Any]]:
        """Return all inspections in the active session."""
        return self._state.get("inspections", [])

    def get_inspection_by_id(self, insp_id: str) -> Optional[Dict[str, Any]]:
        """Find an inspection by ID."""
        for insp in self._state.get("inspections", []):
            if insp.get("id") == insp_id:
                return insp
        return None

    def remove_inspection(self, insp_id: str) -> bool:
        """Remove an inspection record from the session."""
        initial_len = len(self._state["inspections"])
        self._state["inspections"] = [i for i in self._state["inspections"] if i.get("id") != insp_id]
        if len(self._state["inspections"]) < initial_len:
            self.log_action("Remove Inspection", {"id": insp_id})
            return True
        return False

    def add_document(self, doc_data: Dict[str, Any]) -> str:
        """Store an uploaded audit standard/contract document."""
        doc_id = doc_data.get("id") or f"DOC-{len(self._state['documents']) + 1:03d}"
        doc_data["id"] = doc_id
        doc_data["uploaded_at"] = datetime.utcnow().isoformat()
        self._state["documents"].append(doc_data)
        self.log_action("Upload Audit Document", {"id": doc_id, "filename": doc_data.get("filename")})
        return doc_id

    def get_documents(self) -> List[Dict[str, Any]]:
        """Return list of uploaded audit documents."""
        return self._state.get("documents", [])

    def add_audit_finding(self, finding_data: Dict[str, Any]) -> str:
        """Add a 5C audit finding."""
        f_id = finding_data.get("id") or f"FND-{len(self._state['audit_findings']) + 1:03d}"
        finding_data["id"] = f_id
        finding_data["created_at"] = datetime.utcnow().isoformat()
        finding_data["verification_status"] = finding_data.get("verification_status", "Unverified")
        self._state["audit_findings"].append(finding_data)
        self.log_action("Generate 5C Audit Finding", {"id": f_id, "title": finding_data.get("title")})
        return f_id

    def update_audit_finding(self, f_id: str, updated_data: Dict[str, Any]) -> bool:
        """Update an existing 5C audit finding during human-in-the-loop review."""
        for idx, finding in enumerate(self._state["audit_findings"]):
            if finding.get("id") == f_id:
                finding.update(updated_data)
                finding["updated_at"] = datetime.utcnow().isoformat()
                self._state["audit_findings"][idx] = finding
                self.log_action("Auditor Review Finding", {"id": f_id, "status": finding.get("verification_status")})
                return True
        return False

    def remove_audit_finding(self, f_id: str) -> bool:
        """Exclude an audit finding from draft findings."""
        initial_len = len(self._state["audit_findings"])
        self._state["audit_findings"] = [f for f in self._state["audit_findings"] if f.get("id") != f_id]
        if len(self._state["audit_findings"]) < initial_len:
            self.log_action("Exclude Finding", {"id": f_id})
            return True
        return False

    def get_audit_findings(self) -> List[Dict[str, Any]]:
        """Return all 5C audit findings."""
        return self._state.get("audit_findings", [])

    def append_chat(self, role: str, content: str, citations: Optional[List[str]] = None):
        """Append a message to the AI assistant conversation history."""
        self._state["chat_history"].append({
            "role": role,
            "content": content,
            "citations": citations or [],
            "timestamp": datetime.utcnow().strftime("%H:%M:%S")
        })

    def get_chat_history(self) -> List[Dict[str, Any]]:
        """Return assistant chat history."""
        return self._state.get("chat_history", [])

    def get_summary_stats(self) -> Dict[str, Any]:
        """Compute aggregated statistics for the active session without inventing values."""
        inspections = self._state.get("inspections", [])
        total_detections = sum(len(i.get("detections", [])) for i in inspections)
        
        damage_counts = {"D00": 0, "D10": 0, "D20": 0, "D40": 0}
        risk_counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0}
        
        for insp in inspections:
            for det in insp.get("detections", []):
                code = det.get("class_code", "D00")
                if code in damage_counts:
                    damage_counts[code] += 1
            
            risk = insp.get("risk_assessment", {}).get("level", "LOW")
            if risk in risk_counts:
                risk_counts[risk] += 1

        return {
            "total_inspections": len(inspections),
            "total_detections": total_detections,
            "damage_counts": damage_counts,
            "risk_counts": risk_counts,
            "total_documents": len(self._state.get("documents", [])),
            "total_findings": len(self._state.get("audit_findings", [])),
            "recent_actions": self._state.get("actions_log", [])[:8]
        }

    def clear_session(self):
        """Reset current session back to blank slate."""
        self._state["inspections"] = []
        self._state["documents"] = []
        self._state["audit_findings"] = []
        self._state["chat_history"] = []
        self._state["actions_log"] = []
        self._state["session_id"] = str(uuid.uuid4())[:8]
        self._state["started_at"] = datetime.utcnow().isoformat()
        self.log_action("Clear Session", {"reason": "User cleared session data"})

    def export_full_session(self) -> Dict[str, Any]:
        """Export session representation for backup or audit package packaging."""
        return {
            "session_id": self._state.get("session_id"),
            "exported_at": datetime.utcnow().isoformat(),
            "summary_stats": self.get_summary_stats(),
            "inspections": self.get_inspections(),
            "audit_documents": [
                {
                    "id": d["id"],
                    "filename": d["filename"],
                    "extracted_criteria": d.get("extracted_criteria", []),
                    "page_count": d.get("page_count", 1)
                }
                for d in self.get_documents()
            ],
            "audit_findings": self.get_audit_findings(),
            "audit_actions_trail": self._state.get("actions_log", [])
        }
