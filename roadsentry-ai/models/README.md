# RoadSentry AI — Model Weights and Checkpoints

This directory houses the neural network weights for road hazard and damage detection.

## Supported Detection Classes (RDD2022 / CRDDC Standard)

The model is trained to detect 4 primary road surface distress classes:

| Class Code | Name | Description | Severity Weight |
|:---|:---|:---|:---:|
| **D00** | Longitudinal Crack | Cracks aligned parallel to traffic direction | 1.2 |
| **D10** | Transverse Crack | Cracks perpendicular to centerline (thermal/shrinkage) | 1.4 |
| **D20** | Alligator Crack | Interconnected polygonal fatigue fractures (base failure) | 2.2 |
| **D40** | Pothole | Cavities in surface asphalt causing safety hazards | 2.8 |

## Weight Files

1. `road_damage_yolov8n.pt`:
   - Fine-tuned Ultralytics YOLOv8 nano model trained on RDD2022.
   - Recommended confidence threshold: `0.35`
   - CPU inference latency: ~65–110 ms per 640x640 frame.

2. Fallback:
   - If specialized weights are absent, place pre-trained `yolov8n.pt` here.
   - The application will transparently report the active model status and class ontology rather than substituting fake predictions.

## Dataset Credits and Licensing

- Dataset: **Road Damage Dataset 2022 (RDD2022)**
- Citation: Sekilab, Institute of Industrial Science, The University of Tokyo
- License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- Repository: https://github.com/sekilab/RoadDamageDetector
