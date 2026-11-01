"""
RoadSentry AI - Groq Generative & Multimodal AI Service
Provides grounded text synthesis and vision analysis with strict adherence to evidence boundaries.
"""
import os
import base64
from typing import Dict, Any, List, Optional
import json

from config.settings import GROQ_API_KEY, GROQ_TEXT_MODEL, GROQ_VISION_MODEL
from core.exceptions import GroqAPIError

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    Groq = None
    GROQ_AVAILABLE = False


class GroqService:
    """
    Manages Groq Generative and Multimodal AI operations.
    Follows Section 12 grounding rules: Distinguishes YOLO detections from LLM interpretation.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or GROQ_API_KEY
        self.text_model = GROQ_TEXT_MODEL
        self.vision_model = GROQ_VISION_MODEL
        self.client = None

        if GROQ_AVAILABLE and self.api_key and not self.api_key.startswith("gsk_your"):
            try:
                self.client = Groq(api_key=self.api_key)
            except Exception:
                self.client = None

    def is_configured(self) -> bool:
        """Check if a valid Groq client is ready."""
        return self.client is not None

    def analyze_road_image_multimodal(
        self,
        image_bytes: bytes,
        yolo_detections: List[Dict[str, Any]],
        road_class: str,
        dzongkhag: str
    ) -> Dict[str, Any]:
        """
        Multimodal visual analysis of road photo using Groq vision model.
        Informs the LLM of the ground-truth YOLO detections to prevent hallucination.
        """
        if not self.is_configured():
            return {
                "available": False,
                "analysis": (
                    "Groq API key not configured. Multimodal LLM analysis requires a valid GROQ_API_KEY. "
                    "YOLO computer vision inference and rule-based risk scoring remain fully active."
                ),
                "model_used": None
            }

        # Encode image to base64
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        yolo_summary = ", ".join(
            [f"{d.get('class_code')} ({d.get('class_name')}, conf {d.get('confidence'):.0%})" for d in yolo_detections]
        ) if yolo_detections else "No road distress detected by YOLO model."

        prompt = f"""
You are a senior highway engineering and infrastructure audit expert inspecting a road in the Kingdom of Bhutan.
Context provided:
- Dzongkhag: {dzongkhag}
- Road Classification: {road_class}
- Computer Vision YOLO Ground-Truth Detections: {yolo_summary}

STRICT GROUNDING RULES:
1. Do NOT invent or contradict the YOLO detections above.
2. Clearly distinguish between model-detected defects and visual contextual observations (e.g. wet surface, shoulder erosion, terrain slope).
3. Do NOT invent legal codes, contractor names, exact centimeter depth measurements, or historical repair records.
4. If causes cannot be proven from this single still image, write 'Not established — requires auditor verification'.

Provide your multimodal engineering assessment covering:
1. Pavement Surface Condition (texture, moisture, deterioration severity)
2. Roadside and Drainage Context (shoulders, ditches, terrain slope vulnerability)
3. Immediate Road Safety Risks for Mountain Traffic
4. Recommended Specific Field Verification Steps for Public Auditors
"""
        try:
            chat_completion = self.client.chat.completions.create(
                model=self.vision_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{b64_image}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.2,
                max_tokens=800,
            )
            content = chat_completion.choices[0].message.content
            return {
                "available": True,
                "analysis": content,
                "model_used": self.vision_model
            }
        except Exception as e:
            return {
                "available": False,
                "error": f"Groq vision inference error: {str(e)}",
                "analysis": "Multimodal analysis failed or timed out. Please check your Groq API quota or network connection."
            }

    def answer_auditor_question(
        self,
        question: str,
        session_context: Dict[str, Any],
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Answer questions strictly grounded in current session inspections and uploaded audit criteria.
        """
        if not self.is_configured():
            return {
                "answer": (
                    "Groq API is not configured. Please supply a valid GROQ_API_KEY in Settings or your .env file "
                    "to activate natural language Q&A. You can still inspect all tabular detections and audit findings directly."
                ),
                "citations": []
            }

        inspections = session_context.get("inspections", [])
        documents = session_context.get("documents", [])
        findings = session_context.get("audit_findings", [])

        # Build grounded context
        context_parts = []
        context_parts.append(f"Active Session Summary: {len(inspections)} inspections, {len(documents)} documents, {len(findings)} findings.")
        
        if inspections:
            context_parts.append("INSPECTION RECORDS IN SESSION:")
            for i in inspections:
                dets = [f"{d['class_code']} ({d['class_name']})" for d in i.get("detections", [])]
                context_parts.append(
                    f"- Record [{i.get('id')}]: File '{i.get('filename')}', Dzongkhag: {i.get('dzongkhag')}, "
                    f"Road: {i.get('road_class')}, Risk: {i.get('risk_assessment', {}).get('level')}, "
                    f"Detections: {', '.join(dets) if dets else 'None'}"
                )

        if documents:
            context_parts.append("UPLOADED AUDIT CRITERIA & DOCUMENTS:")
            for doc in documents:
                snippet = doc.get("text", "")[:350].replace("\n", " ")
                context_parts.append(f"- Doc [{doc.get('id')} - {doc.get('filename')}]: {snippet}...")

        system_prompt = f"""
You are the RoadSentry AI Senior Audit Assistant for the Kingdom of Bhutan road infrastructure evaluation.
Session Data Grounding:
{chr(10).join(context_parts)}

STRICT RULES:
- Only answer using verified data from the session context above or well-established civil engineering principles.
- If information is not in the session, explicitly state: 'This detail is not present in the active session records.'
- When referring to an inspection or document, cite its ID (e.g. INSP-001, DOC-001).
- Never fabricate fake accidents, specific budget numbers, or contractor names.
"""

        messages = [{"role": "system", "content": system_prompt}]
        if chat_history:
            for msg in chat_history[-6:]:
                messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        messages.append({"role": "user", "content": question})

        try:
            response = self.client.chat.completions.create(
                model=self.text_model,
                messages=messages,
                temperature=0.3,
                max_tokens=600
            )
            ans = response.choices[0].message.content
            return {
                "answer": ans,
                "model_used": self.text_model
            }
        except Exception as e:
            return {
                "answer": f"Groq API call encountered an error: {str(e)}",
                "error": str(e)
            }
