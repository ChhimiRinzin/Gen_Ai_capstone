# RoadSentry AI — Model Card: Road Damage Detection (RDD2022)

## Model Overview
- **Model Name:** Road Damage YOLOv8
- **Architecture:** Ultralytics YOLOv8 (Single-stage anchor-free convolutional object detector)
- **Primary Task:** Pavement surface distress bounding-box detection
- **Input Modality:** 3-channel RGB image (640x640 default resolution)
- **Output:** Bounding boxes $[x_1, y_1, x_2, y_2]$, confidence scores $\in [0, 1]$, and predicted class codes.

## Class Ontology (RDD2022 Standards)
- `D00`: Longitudinal Crack (fatigue along wheel tracks)
- `D10`: Transverse Crack (thermal contraction or subbase reflection)
- `D20`: Alligator Crack (severe interconnected subgrade failure)
- `D40`: Pothole (localized loss of surface wearing course and base material)

## Performance Metrics (RDD2022 Validation)
- mAP@50: ~0.58–0.64 (nano variant baseline on RDD2022 road test sets)
- Average CPU Inference Latency: 72 ms on modern x86_64 CPU.

## Intended Use & Boundaries
- **Intended:** Decision-support triage for highway maintenance engineers and public infrastructure performance auditors.
- **Out of Scope:** Structural engineering load rating, autonomous vehicle navigation, legal liability adjudication.
- **Physical Limitations:** Uncalibrated 2D monocular cameras cannot measure 3D pothole depth in centimeters; values represent surface area extent.
