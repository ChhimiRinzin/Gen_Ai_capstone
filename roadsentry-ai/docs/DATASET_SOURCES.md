# RoadSentry AI — Dataset Sources & Licensing

## Primary Training Dataset: RDD2022 (Road Damage Dataset 2022)

- **Official Webpage:** https://crddc2022.sekilab.global/
- **GitHub Repository:** https://github.com/sekilab/RoadDamageDetector
- **Authors:** Sekilab, Institute of Industrial Science, The University of Tokyo
- **Data Coverage:** Over 47,000 road images collected across 6 countries (Japan, India, Czech Republic, Norway, United States, China).
- **Label Schema:**
  - `D00`: Linear Longitudinal Crack
  - `D10`: Linear Transverse Crack
  - `D20`: Complex Alligator Fatigue Cracking
  - `D40`: Pothole
- **License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).

## Supplementary References

- **BDD100K:** https://github.com/bdd100k/bdd100k
  - Utilized exclusively for autonomous driving scene context and drivable lane segmentation. BDD100K does NOT provide the fine-grained road crack ontology of RDD2022.
- **Kingdom of Bhutan Road Infrastructure Manuals:**
  - Department of Surface Transport (DoST), Ministry of Infrastructure and Transport (MoIT), Royal Government of Bhutan.
  - Indian Roads Congress (IRC) Mountain Road Specifications (IRC:SP:72, IRC:SP:20) referenced as engineering baseline.
