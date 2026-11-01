# RoadSentry AI — 5-Minute International Presentation Guide

**Capstone Presentation: Generative AI Systems: From Research to Real-World Deployment**
**Institution: C-DAC Mohali, India**
**Target Beneficiary: Kingdom of Bhutan (Department of Surface Transport & Royal Audit Authority)**

---

## 1. The Challenge Facing Bhutan (Minute 0:00 – 1:00)

- **Geographic Vulnerability:** The Kingdom of Bhutan features 18,000+ km of mountain highways traversing steep Himalayan terrain, high-altitude alpine passes (Dochula 3,100m, Pelela 3,420m, Thrumshingla 3,780m), and sub-tropical southern foothills (Chukha, Phuntsholing).
- **Compounding Hazards:** Extreme monsoon rains trigger rapid subbase washouts, asphalt cracking (D00, D10), fatigue alligator cracking (D20), and severe potholes (D40) that endanger motorist lives and sever economic lifeline corridors.
- **Auditing Gap:** Public-sector performance auditors and road maintenance engineers currently lack automated multimodal tools to objectively audit maintenance compliance, link photographic evidence to contractual standards, and prioritize scarce road maintenance budgets.

---

## 2. The Solution: RoadSentry AI (Minute 1:00 – 2:00)

- **Unified Intelligence Platform:** Integrates 10 technological pillars:
  1. Deep Learning (Ultralytics YOLOv8 for RDD2022 road damage detection)
  2. Computer Vision (OpenCV Laplacian blur detection, Canny edge analysis, CLAHE enhancement)
  3. Machine Learning (Explainable multi-factor risk prioritization matrix)
  4. Generative & Multimodal AI (Groq official SDK with `llama-3.2-11b-vision` and `llama-3.3-70b-versatile`)
  5. Document Processing (PyMuPDF, python-docx, openpyxl for contractual specifications)
  6. Infrastructure Audit Intelligence (5C Audit Finding Generator: Criteria, Condition, Cause, Consequence, Corrective Action)
  7. GIS Geospatial Intelligence (Bhutan Leaflet map across all 20 Dzongkhags)
  8. Human-in-the-Loop Review (Auditor verification, comments, editing)
  9. Automated Reporting (Dossier export in PDF, DOCX, CSV, JSON)
  10. Strict Session-Only Security (Zero persistent database, full session isolation)

---

## 3. Live Demonstration Workflow (Minute 2:00 – 4:00)

1. **Step 1 — Command Center:** Show the live dashboard with session metrics (inspections, detections, risk breakdown).
2. **Step 2 — AI Road Inspector:**
   - Upload an authentic road inspection image.
   - Run OpenCV image quality analysis (shows blur metric, brightness, and contrast).
   - Run real YOLO detection: highlight detected cracks/potholes with confidence scores and bounding boxes.
   - Show explainable risk prioritization (Low/Medium/High/Critical) with point-by-point engineering factor breakdown.
   - Run optional Groq multimodal analysis for environmental context.
3. **Step 3 — Infrastructure Audit:**
   - Upload a road maintenance technical specification or contract clause.
   - Run Evidence-vs-Criteria comparative analysis.
   - Generate automated 5C Audit Finding with mandatory 'Not established — requires auditor verification' cause labeling.
   - Demonstrate human auditor review: confirm observation, add notes, and adjust severity.
4. **Step 4 — Bhutan Hazard Map:**
   - View inspected coordinates dynamically plotted across Bhutan's Dzongkhags (e.g. Chukha on PNH-1, Thimphu, Punakha).
5. **Step 5 — Professional Report Export:**
   - Generate and download an AI-Assisted Audit Dossier in PDF/DOCX featuring official disclaimers.

---

## 4. Current Limitations & Responsible AI (Minute 4:00 – 4:30)

- **Decision-Support Tool:** RoadSentry AI assists human engineers and auditors; it does not issue autonomous statutory opinions.
- **Uncalibrated Monocular 2D Imagery:** Bounding boxes detect surface damage regions and relative frame area; exact 3D pothole depth requires calibrated LiDAR or ground-penetrating radar.
- **Video Sampling:** Frame sampling counts damage per sampled frame; vehicle trajectory tracking is noted as an auditor boundary.

---

## 5. Future Real-World Adoption Road Map (Minute 4:30 – 5:00)

- Fine-tuning YOLO weights with locally collected Bhutanese road pavement imagery across all seasons.
- Integration with Bhutan GeoPortal and Department of Surface Transport (DoST) RAMS (Road Asset Management System).
- Extending the user interface with native Dzongkha language support.
