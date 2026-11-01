"""
RoadSentry AI - Infrastructure Audit Analyzer & 5C Finding Generator
Synthesizes verified visual evidence against technical standards using the INTOSAI/RAA 5C Audit Framework.
"""
from typing import Dict, Any, List, Optional
import uuid


class AuditAnalyzer:
    """
    Implements evidence-vs-criteria comparison and 5C audit finding generation:
    1. Criteria (What should be)
    2. Condition (What is observed)
    3. Cause (Why it occurred — requires auditor verification if unproven)
    4. Consequence / Effect (Risk to safety, economic life, asset degradation)
    5. Corrective Action / Recommendation (Remedial response)
    """

    @staticmethod
    def compare_evidence_vs_criteria(
        inspection: Dict[str, Any],
        criterion: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Compare observed condition in inspection against a standard/contract criterion.
        """
        detections = inspection.get("detections", [])
        damage_types = list({d.get("class_name") for d in detections if d.get("class_name")})
        
        criterion_text = criterion.get("criterion", "")
        criterion_ref = criterion.get("ref", "Contract Clause")

        has_potholes = any(d.get("class_code") == "D40" for d in detections)
        has_cracks = any(d.get("class_code") in ["D00", "D10", "D20"] for d in detections)

        discrepancy_detected = len(detections) > 0

        # Construct Condition description based purely on real detections
        if not detections:
            condition_desc = "Visual inspection indicates sound pavement surface with no visible distress detected."
        else:
            defect_summary = ", ".join(damage_types)
            condition_desc = (
                f"Inspection record {inspection.get('id')} ({inspection.get('filename')}) on "
                f"{inspection.get('road_class', 'Highway')} ({inspection.get('dzongkhag', 'Bhutan')}) "
                f"shows {len(detections)} surface distress regions: {defect_summary}."
            )

        return {
            "inspection_id": inspection.get("id"),
            "criterion_ref": criterion_ref,
            "criterion_text": criterion_text,
            "condition_observed": condition_desc,
            "discrepancy_detected": discrepancy_detected,
            "verified_damage_classes": damage_types,
            "verification_needed": [
                "Field core measurement of asphalt layer thickness",
                "Subbase moisture density testing",
                "Contractor routine maintenance logbook verification"
            ]
        }

    @staticmethod
    def generate_5c_finding(
        inspection: Dict[str, Any],
        criterion: Optional[Dict[str, Any]] = None,
        auditor_context: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a structured 5C audit finding.
        Explicitly flags 'Not established — requires auditor verification' where data is absent.
        """
        finding_id = f"FND-{str(uuid.uuid4())[:6].upper()}"
        detections = inspection.get("detections", [])
        risk = inspection.get("risk_assessment", {})
        
        # 1. Criteria
        if criterion:
            c_criteria = (
                f"According to {criterion.get('ref', 'Standard Specification')}: "
                f"'{criterion.get('criterion', 'Pavement surfaces shall be maintained free from hazardous potholes, severe alligator cracking, and edge subsidence to ensure vehicular safety and protect structural asset value.')}'"
            )
        else:
            c_criteria = (
                "Standard Road Maintenance Specification (DoST / MoIT Bhutan): "
                "Pavement wearing course shall be preserved in a serviceable condition without unsealed cracks or potholes exceeding 25mm depth."
            )

        # 2. Condition
        if not detections:
            c_condition = "No road surface defects detected by computer vision model in the uploaded evidence."
            title = f"Compliance: Satisfactory Road Condition ({inspection.get('dzongkhag', 'Bhutan')})"
            severity = "Low"
        else:
            defect_counts = {}
            for d in detections:
                c = d.get("class_name", "Defect")
                defect_counts[c] = defect_counts.get(c, 0) + 1
            
            defect_str = ", ".join(f"{count} {name}(s)" for name, count in defect_counts.items())
            total_area = sum(d.get("area_percentage", 0.0) for d in detections)
            
            c_condition = (
                f"Visual evidence ({inspection.get('filename')}, Evidence ID {inspection.get('id')}) verifies "
                f"{len(detections)} active surface defect(s) [{defect_str}], occupying approximately {total_area:.1f}% "
                f"of the analyzed roadway frame in {inspection.get('dzongkhag', 'Bhutan')}."
            )
            title = f"Pavement Distress: Unrepaired {list(defect_counts.keys())[0]} on {inspection.get('road_class', 'Highway')}"
            severity = risk.get("level", "Medium")

        # 3. Cause
        c_cause = (
            "Not established — requires auditor verification. "
            "Potential contributing factors include water infiltration due to clogged side drains, subbase fatigue under heavy vehicular loads, delayed periodic routine maintenance, or defective asphalt mix compaction."
        )
        if auditor_context:
            c_cause += f" Auditor noted context: '{auditor_context}'."

        # 4. Consequence / Effect
        if "D40" in [d.get("class_code") for d in detections]:
            c_consequence = (
                "Severe road safety hazard to motorists including tire blowout risk, vehicular steering loss on steep mountain gradients, "
                "accelerated water penetration weakening road subbase, and compounding future capital reconstruction costs."
            )
        else:
            c_consequence = (
                "Progressive water ingress along crack fractures will accelerate pavement alligator cracking, "
                "leading to subgrade pumping and eventual pothole formation during monsoon rains."
            )

        # 5. Corrective Action / Recommendation
        c_recommendation = (
            "1. Department of Surface Transport (DoST) regional executive engineer should inspect the designated road section.\n"
            "2. Execute immediate localized crack sealing (bituminous slurry / emulsion) or pothole patch repair to prevent subbase degradation.\n"
            "3. Audit contractor maintenance logbooks to ascertain whether defect reporting timelines complied with contract specifications."
        )

        return {
            "id": finding_id,
            "title": title,
            "evidence_id": inspection.get("id"),
            "evidence_filename": inspection.get("filename"),
            "dzongkhag": inspection.get("dzongkhag", "Thimphu"),
            "road_class": inspection.get("road_class", "PNH"),
            "criteria": c_criteria,
            "condition": c_condition,
            "cause": c_cause,
            "consequence": c_consequence,
            "recommendation": c_recommendation,
            "severity": severity,
            "verification_status": "Unverified — Pending Field Audit",
            "auditor_comments": "",
            "is_human_confirmed": False
        }
