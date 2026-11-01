"""
RoadSentry AI - Explainable Multi-Factor Risk Assessment Engine
Calculates transparent risk scores (0-100) and priority tiers without black-box guessing.
"""
from typing import Dict, Any, List
from config.settings import RDD2022_CLASSES, RISK_LEVELS
from config.bhutan import BHUTAN_ROAD_CLASSES


class RiskAssessor:
    """
    Transparent risk assessment engine based on engineering principles:
    Score = (Damage Severity * 0.40) + (Area Extent * 0.25) + (Road Classification * 0.20) + (Environmental Vulnerability * 0.15)
    """

    @staticmethod
    def calculate_risk(
        detections: List[Dict[str, Any]],
        road_class_code: str = "PNH",
        dzongkhag: str = "Thimphu",
        is_monsoon_season: bool = False,
        has_drainage_blockage: bool = False,
        is_high_altitude_pass: bool = False
    ) -> Dict[str, Any]:
        """
        Calculate explainable risk score and priority classification.
        All mathematical components are logged and returned for full auditability.
        """
        if not detections:
            return {
                "score": 0.0,
                "level": "LOW",
                "badge": "No Damage Detected",
                "color": "#10b981",
                "explanation": "No confirmed road damage defects were detected in this image.",
                "factor_breakdown": {
                    "damage_severity_points": 0.0,
                    "surface_extent_points": 0.0,
                    "road_class_multiplier": 1.0,
                    "environmental_points": 0.0
                }
            }

        # 1. Damage Severity Component (Max 40 points)
        # Potholes (D40) and Alligator Cracks (D20) carry higher risk than linear cracks
        severity_points = 0.0
        class_weights = {"D00": 1.2, "D10": 1.4, "D20": 2.2, "D40": 2.8}
        
        highest_defect_severity = 0.0
        defect_details = []

        for d in detections:
            code = d.get("class_code", "D00")
            conf = d.get("confidence", 0.5)
            weight = class_weights.get(code, 1.0)
            highest_defect_severity = max(highest_defect_severity, weight)
            
            # Each defect contributes weighted confidence
            severity_points += (weight * 7.5 * conf)
            defect_details.append(f"{code} (weight {weight})")

        # Cap defect severity points at 40
        damage_severity_points = min(40.0, severity_points)

        # 2. Surface Extent Component (Max 25 points)
        # Sum of detection area percentage relative to image
        total_area_pct = sum(d.get("area_percentage", 0.0) for d in detections)
        # 10% or more surface area damage = full 25 points
        extent_points = min(25.0, (total_area_pct / 10.0) * 25.0)

        # 3. Road Classification Multiplier / Component (Max 20 points)
        # Strategic Bhutan corridors (PNH) carry higher traffic and safety impact
        road_meta = BHUTAN_ROAD_CLASSES.get(road_class_code, BHUTAN_ROAD_CLASSES["PNH"])
        road_factor = road_meta.get("weight_factor", 1.2)
        # Base 12 points scaled by road priority factor
        road_points = min(20.0, 12.0 * road_factor)

        # 4. Environmental & Bhutan Terrain Vulnerability (Max 15 points)
        env_points = 0.0
        env_reasons = []

        if is_monsoon_season:
            env_points += 6.0
            env_reasons.append("Monsoon precipitation amplifies subbase saturation and hydroplaning risk")
        if has_drainage_blockage:
            env_points += 5.0
            env_reasons.append("Clogged side drains accelerate rapid pavement washouts on slopes")
        if is_high_altitude_pass:
            env_points += 4.0
            env_reasons.append("High altitude pass subject to freeze-thaw cracking cycles and black ice")

        environmental_points = min(15.0, env_points)

        # Total Aggregated Risk Score (0-100)
        total_score = round(damage_severity_points + extent_points + road_points + environmental_points, 1)
        total_score = max(0.0, min(100.0, total_score))

        # Assign Risk Level
        if total_score >= 75.0:
            level = "CRITICAL"
        elif total_score >= 50.0:
            level = "HIGH"
        elif total_score >= 25.0:
            level = "MEDIUM"
        else:
            level = "LOW"

        level_info = RISK_LEVELS[level]

        # Construct clear audit justification
        unique_codes = sorted(list({d.get("class_code", "D00") for d in detections}))
        reasons = [
            f"Detected {len(detections)} defect(s) [{', '.join(unique_codes)}] including high-severity classes ({highest_defect_severity} max weight)",
            f"Damaged surface occupies ~{total_area_pct:.1f}% of frame area",
            f"Located on {road_meta['name']} (classification factor: {road_factor}x)",
        ]
        if env_reasons:
            reasons.extend(env_reasons)

        explanation = "; ".join(reasons) + f" — overall priority categorized as {level}."

        return {
            "score": total_score,
            "level": level,
            "badge": level_info["badge"],
            "color": level_info["color"],
            "explanation": explanation,
            "factor_breakdown": {
                "damage_severity_points": round(damage_severity_points, 1),
                "surface_extent_points": round(extent_points, 1),
                "road_class_points": round(road_points, 1),
                "environmental_points": round(environmental_points, 1),
                "total_area_pct": round(total_area_pct, 2),
                "defects_count": len(detections),
                "road_class_name": road_meta["name"],
                "dzongkhag": dzongkhag
            }
        }
