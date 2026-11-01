"""
Tests for GroqService initialization and fallback behavior
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.groq_service import GroqService


def test_groq_fallback_when_unconfigured():
    # Tests that when no key is provided, GroqService gracefully falls back without crashing
    service = GroqService(api_key="")
    assert service.is_configured() is False

    res = service.answer_auditor_question("What damage was detected?", session_context={"inspections": []})
    assert "Groq API is not configured" in res["answer"]

    multimodal = service.analyze_road_image_multimodal(b"fake_bytes", [], "PNH", "Thimphu")
    assert multimodal["available"] is False
    assert "Groq API key not configured" in multimodal["analysis"]
