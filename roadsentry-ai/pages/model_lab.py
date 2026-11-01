"""
RoadSentry AI - Page 8: Model Lab
Neural network specifications, RDD2022 dataset documentation, class ontology, and benchmark metrics.
"""
import streamlit as st
from config.settings import RDD2022_CLASSES

def render_model_lab(session_mgr, yolo_detector, groq_svc):
    st.title("🔬 Model Lab & Architecture")
    st.markdown("##### YOLO Neural Network Architecture, RDD2022 Benchmark, and Training Workflows")

    status = yolo_detector.get_status()

    st.markdown("### 1. Active YOLO Model Specification")
    c1, c2, c3 = st.columns(3)
    c1.metric("Engine Status", "Loaded" if status["is_loaded"] else "Unloaded")
    c2.metric("Architecture", "Ultralytics YOLOv8" if status["ultralytics_available"] else "Pending Install")
    c3.metric("Hardware Target", "CPU-Optimized (Single-core compatible)")

    st.write(f"**Model Type:** {status['model_type']}")
    st.write(f"**Weights Path:** `{status['weights_path']}`")

    st.markdown("---")
    st.markdown("### 2. RDD2022 Road Damage Class Definitions")
    st.markdown("Based on the Road Damage Dataset 2022 (Institute of Industrial Science, The University of Tokyo).")

    for code, info in RDD2022_CLASSES.items():
        with st.expander(f"{info['code']} — {info['name']} (Severity Weight: {info['severity_weight']}x)", expanded=True):
            st.write(f"**Description:** {info['description']}")
            st.markdown(f"**Visualization Color:** <span style='color:{info['color']}; font-weight:bold;'>■ {info['color']}</span>", unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("### 3. Training & Evaluation Pipeline")
    st.write("""
    To train or fine-tune YOLOv8 on your own or RDD2022 road imagery, run the provided modular scripts in `training/`:
    ```bash
    # 1. Download dataset subset
    python training/download_dataset.py --country India

    # 2. Convert annotations and create YAML
    python training/prepare_dataset.py

    # 3. Train on CPU or CUDA GPU
    python training/train_yolo.py --epochs 30 --batch 8 --device cpu

    # 4. Evaluate mAP and confusion matrix
    python training/evaluate_yolo.py
    ```
    """)
