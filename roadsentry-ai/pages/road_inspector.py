"""
RoadSentry AI - Page 2: AI Road Inspector
Real computer vision quality analysis, genuine YOLO inference, explainable risk assessment, and Groq multimodal analysis.
"""
import streamlit as st
import numpy as np
from PIL import Image
import io
import json

from services.image_processor import ImageProcessor
from services.risk_assessor import RiskAssessor
from config.bhutan import BHUTAN_DZONGKHAGS, BHUTAN_ROAD_CLASSES
from core.file_validator import FileValidator

def render_road_inspector(session_mgr, yolo_detector, groq_svc):
    st.title("🔍 AI Road Inspector")
    st.markdown("##### Real Multimodal Road Distress Detection & Risk Scoring")

    # Inputs configuration
    col_meta1, col_meta2, col_meta3 = st.columns(3)
    with col_meta1:
        dzongkhags_list = list(BHUTAN_DZONGKHAGS.keys())
        selected_dzongkhag = st.selectbox("Dzongkhag (District)", dzongkhags_list, index=0)
    with col_meta2:
        road_classes_list = list(BHUTAN_ROAD_CLASSES.keys())
        selected_road_class = st.selectbox(
            "Road Classification",
            road_classes_list,
            format_func=lambda x: f"{x} - {BHUTAN_ROAD_CLASSES[x]['name']}",
            index=0
        )
    with col_meta3:
        conf_slider = st.slider("YOLO Confidence Threshold", min_value=0.10, max_value=0.90, value=0.35, step=0.05)

    # GPS coordinates
    col_gps1, col_gps2, col_gps3 = st.columns(3)
    default_lat = BHUTAN_DZONGKHAGS[selected_dzongkhag]["center_lat"]
    default_lon = BHUTAN_DZONGKHAGS[selected_dzongkhag]["center_lon"]
    with col_gps1:
        user_lat = st.number_input("GPS Latitude (°N)", value=float(default_lat), format="%.4f")
    with col_gps2:
        user_lon = st.number_input("GPS Longitude (°E)", value=float(default_lon), format="%.4f")
    with col_gps3:
        is_monsoon = st.checkbox("Monsoon / Heavy Rain Season", value=False)
        drainage_blocked = st.checkbox("Side Drainage Blocked / Overflow", value=False)

    st.markdown("---")

    uploaded_file = st.file_uploader(
        "Upload Road Inspection Photograph (JPG, PNG, WEBP)",
        type=["jpg", "jpeg", "png", "webp"]
    )

    if uploaded_file is not None:
        file_bytes = uploaded_file.read()
        valid, err = FileValidator.validate_image_file(uploaded_file.name, file_bytes)
        if not valid:
            st.error(f"Validation failed: {err}")
            return

        # Decode image using ImageProcessor
        raw_rgb = ImageProcessor.load_image_from_bytes(file_bytes)
        
        # 1. Traditional Computer Vision Image Quality Triage
        st.markdown("### 1. Computer Vision Image Quality Triage")
        cv_quality = ImageProcessor.analyze_image_quality(raw_rgb)
        
        q_col1, q_col2, q_col3, q_col4 = st.columns(4)
        q_col1.metric("Blur Metric (Laplacian)", f"{cv_quality['blur_metric']:.1f}", delta="Sharp" if not cv_quality['is_blurry'] else "Blurry")
        q_col2.metric("Brightness (Luminance)", f"{cv_quality['brightness']:.1f} / 255")
        q_col3.metric("Contrast (Std Dev)", f"{cv_quality['contrast']:.1f}")
        q_col4.metric("Resolution", f"{cv_quality['dimensions']['width']}x{cv_quality['dimensions']['height']}")
        st.info(f"**Image Quality Assessment:** {cv_quality['quality_status']}")

        # 2. YOLO Object Detection
        st.markdown("### 2. Deep Learning YOLO Road Damage Inference")
        det_res = yolo_detector.detect(raw_rgb, conf_threshold=conf_slider)
        detections = det_res.get("detections", [])
        
        if det_res.get("error"):
            st.warning(f"Notice: {det_res['error']}")
        else:
            st.success(f"Inference complete in **{det_res['inference_time_ms']} ms**. Detected **{len(detections)}** surface distress region(s).")

        # Visual Comparison
        annotated_rgb = ImageProcessor.draw_detections(raw_rgb, detections)
        edges_img = ImageProcessor.generate_canny_edges(raw_rgb)

        tab_orig, tab_ann, tab_edges = st.tabs(["🎯 YOLO Annotated Output", "📷 Original Image", "⚡ Canny Fractures"])
        with tab_ann:
            st.image(annotated_rgb, caption=f"YOLO Annotations ({len(detections)} defects)", use_container_width=True)
        with tab_orig:
            st.image(raw_rgb, caption="Raw Inspection Photograph", use_container_width=True)
        with tab_edges:
            st.image(edges_img, caption="Canny Structural Edge Discontinuities", use_container_width=True)

        # 3. Explainable Risk Assessment
        st.markdown("### 3. Multi-Factor Hazard Risk Prioritization")
        risk = RiskAssessor.calculate_risk(
            detections=detections,
            road_class_code=selected_road_class,
            dzongkhag=selected_dzongkhag,
            is_monsoon_season=is_monsoon,
            has_drainage_blockage=drainage_blocked
        )

        r_col1, r_col2 = st.columns([1, 2])
        with r_col1:
            st.markdown(f"#### Priority: <span style='color:{risk['color']};'>{risk['badge']}</span>", unsafe_allow_html=True)
            st.metric("Risk Score", f"{risk['score']} / 100")
        with r_col2:
            st.markdown(f"**Engineering Justification:** {risk['explanation']}")
            fb = risk['factor_breakdown']
            st.caption(f"Factors: Damage Severity = {fb['damage_severity_points']} pts | Area Extent = {fb['surface_extent_points']} pts | Road Importance = {fb['road_class_points']} pts | Environmental = {fb['environmental_points']} pts")

        # 4. Optional Groq Multimodal Analysis
        st.markdown("### 4. Groq Multimodal Visual Reasoning")
        enable_groq = st.checkbox("Request Groq Multimodal Road Engineering Analysis", value=False)
        groq_analysis_text = None

        if enable_groq:
            if not groq_svc.is_configured():
                st.warning("⚠️ Groq API key is not configured. Set GROQ_API_KEY in Settings or .env to enable vision analysis.")
            else:
                with st.spinner("Analyzing image via Groq vision model..."):
                    groq_res = groq_svc.analyze_road_image_multimodal(
                        file_bytes, detections, selected_road_class, selected_dzongkhag
                    )
                    if groq_res.get("available"):
                        groq_analysis_text = groq_res["analysis"]
                        st.markdown(groq_analysis_text)
                    else:
                        st.error(groq_res.get("error", "Failed to retrieve multimodal analysis."))

        # 5. Session Save Button
        st.markdown("---")
        if st.button("💾 Save Inspection Record to Current Session", type="primary", use_container_width=True):
            insp_record = {
                "filename": uploaded_file.name,
                "dzongkhag": selected_dzongkhag,
                "road_class": selected_road_class,
                "coordinates": {"lat": user_lat, "lon": user_lon},
                "detections": detections,
                "cv_metrics": cv_quality,
                "risk_assessment": risk,
                "groq_analysis": groq_analysis_text,
                "is_monsoon": is_monsoon,
                "drainage_blocked": drainage_blocked
            }
            rec_id = session_mgr.add_inspection(insp_record)
            st.success(f"Inspection **{rec_id}** saved to current active session! View on Bhutan Hazard Map or generate 5C Findings.")
            st.rerun()
