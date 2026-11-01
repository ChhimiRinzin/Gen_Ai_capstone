# RoadSentry AI 🇧🇹
### Intelligent Road Safety & Infrastructure Audit Intelligence Platform for the Kingdom of Bhutan

[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Tests Passing](https://img.shields.io/badge/pytest-9%20passed%2C%20100%25-brightgreen.svg)]()
[![Ultralytics YOLOv8](https://img.shields.io/badge/YOLO-v8_RDD2022-orange.svg)](https://github.com/ultralytics/ultralytics)
[![Groq Llama-3.3](https://img.shields.io/badge/Groq-Llama--3.3--70B_&_Vision-purple.svg)](https://groq.com)

> **Academic Capstone Project**  
> **Programme:** International Training Programme on *"Generative AI Systems: From Research to Real-World Deployment"*  
> **Institution:** Centre for Development of Advanced Computing (C-DAC), Mohali, India  
> **Beneficiary Jurisdiction:** Department of Surface Transport (DoST) & Royal Audit Authority (RAA), Kingdom of Bhutan  

---

## 🏔️ Executive Summary

The **Kingdom of Bhutan** features more than 18,000 kilometers of challenging Himalayan mountain roads subject to extreme monsoonal precipitation, high-altitude freeze-thaw cycles, and seismic vulnerabilities. Rapid asphalt distress—such as potholes (`D40`), alligator fatigue cracking (`D20`), and longitudinal/transverse fractures (`D00`/`D10`)—poses immediate safety hazards to mountain transport and escalates public capital reconstruction expenditure.

**RoadSentry AI** is a production-quality multimodal artificial intelligence platform that unifies:
1. **Deep Learning Computer Vision:** Ultralytics YOLOv8 trained on the Road Damage Dataset 2022 (RDD2022).
2. **Traditional Computer Vision:** Deterministic image quality triage (Laplacian variance blur scoring, Canny edge detection, CLAHE enhancement).
3. **Multi-Factor Risk Prioritization:** Explainable risk classification (Critical, High, Medium, Low) incorporating road classification factors (PNH, SNH, DR, FR).
4. **Multimodal Generative AI:** Official Groq Python SDK leveraging `llama-3.2-11b-vision-preview` and `llama-3.3-70b-versatile` with strict grounding boundaries.
5. **Infrastructure Audit Intelligence:** Automatic generation of structured **5C Audit Findings** (*Criteria, Condition, Cause, Consequence, Corrective Action*) aligned with INTOSAI and Royal Audit Authority standards.
6. **Bhutan Interactive GIS Map:** Geospatial mapping across all 20 Bhutanese Dzongkhags with verified GPS markers.
7. **Strict Session-Based Operation:** Zero persistent database; complete session privacy and exportable audit dossiers (PDF, DOCX, CSV, JSON).

---

## 🛠️ Technology Stack

- **Core Runtime:** Python 3.11
- **UI Framework:** Streamlit, Custom CSS, Plotly, Folium
- **Object Detection:** Ultralytics YOLOv8, PyTorch
- **Computer Vision:** OpenCV (`cv2`), Pillow, NumPy
- **Machine Learning:** scikit-learn (Random Forest classifier pipeline)
- **Generative & Multimodal AI:** Official `groq` Python SDK
- **Document Processing:** PyMuPDF (`fitz`), `python-docx`, `openpyxl`, `pandas`
- **Report Generation:** ReportLab (PDF), `python-docx` (DOCX), JSON, CSV
- **Testing:** `pytest` (100% passing automated test suite)

---

## 🚀 Quick Start on GitHub Codespaces

1. Clone or open in **GitHub Codespaces**.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Configure Groq API key in `.env`:
   ```bash
   cp .env.example .env
   ```
4. Run automated test suite:
   ```bash
   pytest tests -v
   ```
5. Launch the Streamlit application:
   ```bash
   streamlit run app.py --server.address 0.0.0.0 --server.port 8501
   ```

---

## 📁 Repository Structure

```
roadsentry-ai/
├── app.py                      # Main Streamlit application entry point
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
├── .devcontainer/              # GitHub Codespaces container setup
├── config/
│   ├── settings.py             # Global constants, classes, and limits
│   └── bhutan.py               # Bhutan 20 Dzongkhags and road classification data
├── core/
│   ├── session_manager.py      # Session state manager (zero database)
│   ├── file_validator.py       # Security, MIME, and size validation
│   └── exceptions.py           # Domain exception classes
├── services/
│   ├── yolo_detector.py        # Ultralytics YOLO inference engine
│   ├── image_processor.py      # OpenCV CV operations and image quality
│   ├── video_processor.py      # MP4 frame sampling and defect aggregation
│   ├── risk_assessor.py        # Explainable multi-factor risk engine
│   ├── ml_predictor.py         # scikit-learn Random Forest ML pipeline
│   ├── groq_service.py         # Official Groq multimodal & text integration
│   ├── document_processor.py   # PDF/DOCX/CSV standards & criteria extractor
│   ├── audit_analyzer.py       # 5C Audit Finding generator & comparison
│   ├── evidence_manager.py     # Evidentiary indexing and custody trail
│   ├── mapping_service.py      # Folium Bhutan GIS mapping service
│   └── report_generator.py     # PDF, DOCX, JSON, CSV export engine
├── pages/                      # 9 Modular Streamlit pages
│   ├── command_center.py       # Session dashboard & KPI metrics
│   ├── road_inspector.py       # Real image/video inspection & detection
│   ├── infrastructure_audit.py # Criteria vs Condition & 5C findings
│   ├── hazard_map.py           # Bhutan GIS interactive map
│   ├── analytics.py            # Damage distributions & trend charts
│   ├── reports.py              # Exportable audit dossiers
│   ├── ai_assistant.py         # Session-grounded Groq Q&A
│   ├── model_lab.py            # YOLO model card & RDD2022 benchmarks
│   └── settings.py             # Configuration & responsible AI disclosures
├── training/                   # RDD2022 training and evaluation scripts
├── tests/                      # Automated test suite (pytest)
└── docs/                       # Architecture, Model Card, 5-Min Presentation Guide
```

---

## ⚖️ Responsible AI & Audit Disclaimers

> **MANDATORY NOTICE:** RoadSentry AI is an **AI-assisted decision-support system**, not an autonomous safety certifier or statutory audit opinion generator. Bounding box detections, risk classifications, and 5C audit findings must be physically verified by qualified public auditors and certified structural engineers. Monocular 2D images cannot measure 3D pothole depth in absolute units.
