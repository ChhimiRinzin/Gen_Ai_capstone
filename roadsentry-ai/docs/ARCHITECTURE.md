# RoadSentry AI — System Architecture & Data Flow

```
                                      +-----------------------------+
                                      |    RoadSentry AI Platform   |
                                      +--------------+--------------+
                                                     |
         +-------------------------------------------+-------------------------------------------+
         |                                           |                                           |
+--------v--------+                         +--------v--------+                         +--------v--------+
|  Input Ingestion|                         | AI & CV Engine  |                         | Audit & Reports |
+--------+--------+                         +--------+--------+                         +--------+--------+
         |                                           |                                           |
         +-- Road Photos (JPG/PNG/WEBP)              +-- OpenCV Quality & Edges                  +-- 5C Audit Finding
         +-- Road Videos (MP4)                       +-- Ultralytics YOLO (RDD2022)              +-- Human Review Gate
         +-- Standards & Specs (PDF/DOCX)            +-- Multi-Factor Risk Matrix                +-- PDF/DOCX Export
         +-- GPS & Dzongkhag Metadata                +-- Groq Vision & Text LLM                  +-- Bhutan GIS Map
```

## Architectural Design Principles

1. **Strictly Session-Based State:** Zero database persistence. State exists strictly in memory during the active session.
2. **True Multimodal Triangulation:**
   - Computer Vision detects deterministic image quality (blur, luminance).
   - Deep Learning (YOLO) detects objective surface defects (D00, D10, D20, D40).
   - Multimodal LLM provides qualitative contextual insights.
   - 5C Audit Framework structures findings for public accountability.
3. **Grounding Boundaries:** The LLM cannot invent detections, contract clauses, or measurements not present in session evidence.
