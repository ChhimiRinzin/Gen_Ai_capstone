"""
RoadSentry AI - Application Configuration & Settings
"""
import os
from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent

# Application Info
APP_NAME = "RoadSentry AI"
APP_SUBTITLE = "Intelligent Road Safety & Infrastructure Audit Intelligence"
COUNTRY_FOCUS = "Kingdom of Bhutan"
VERSION = "1.0.0-capstone"
ACADEMIC_CREDIT = "C-DAC Mohali, India — Generative AI Systems: From Research to Real-World Deployment"

# Groq API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_TEXT_MODEL = os.getenv("GROQ_TEXT_MODEL", "llama-3.3-70b-versatile")
GROQ_VISION_MODEL = os.getenv("GROQ_VISION_MODEL", "llama-3.2-11b-vision-preview")

# Road Damage Classes (RDD2022 / CRDDC Standard)
RDD2022_CLASSES = {
    0: {
        "code": "D00",
        "name": "Longitudinal Crack",
        "description": "Cracks parallel to the road centerline, caused by pavement fatigue or poor joint construction.",
        "severity_weight": 1.2,
        "color": "#38bdf8"  # Sky Blue
    },
    1: {
        "code": "D10",
        "name": "Transverse Crack",
        "description": "Cracks perpendicular to the centerline, often due to thermal shrinkage or reflection from subbase.",
        "severity_weight": 1.4,
        "color": "#a855f7"  # Purple
    },
    2: {
        "code": "D20",
        "name": "Alligator Crack",
        "description": "Interconnected fatigue cracks forming a pattern resembling reptile skin; indicates subbase failure.",
        "severity_weight": 2.2,
        "color": "#f97316"  # Orange
    },
    3: {
        "code": "D40",
        "name": "Pothole",
        "description": "Bowl-shaped hole in the road surface caused by water penetration and traffic wear; severe safety hazard.",
        "severity_weight": 2.8,
        "color": "#ef4444"  # Red
    }
}

CLASS_NAME_TO_CODE = {
    "D00": "D00",
    "D10": "D10",
    "D20": "D20",
    "D40": "D40",
    "Longitudinal Crack": "D00",
    "Transverse Crack": "D10",
    "Alligator Crack": "D20",
    "Pothole": "D40"
}

# Detection Defaults
DEFAULT_CONF_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.35"))
DEFAULT_IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", "0.45"))
MODEL_PATH = os.getenv("YOLO_MODEL_PATH", str(BASE_DIR / "models" / "road_damage_yolov8n.pt"))

# File Limits
MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "15"))
MAX_VIDEO_SIZE_MB = int(os.getenv("MAX_VIDEO_SIZE_MB", "50"))
MAX_DOC_SIZE_MB = int(os.getenv("MAX_DOC_SIZE_MB", "25"))
ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_VIDEO_EXTS = {".mp4", ".mov", ".avi"}
ALLOWED_DOC_EXTS = {".pdf", ".docx", ".txt", ".csv", ".xlsx"}

# Risk Thresholds
RISK_LEVELS = {
    "CRITICAL": {"min_score": 75, "color": "#ef4444", "badge": "Critical Priority"},
    "HIGH": {"min_score": 50, "color": "#f97316", "badge": "High Priority"},
    "MEDIUM": {"min_score": 25, "color": "#eab308", "badge": "Medium Priority"},
    "LOW": {"min_score": 0, "color": "#10b981", "badge": "Low Priority"}
}
