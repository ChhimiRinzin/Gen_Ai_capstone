"""
RoadSentry AI - Page 5: AI Analytics
Empirical distributions of road damage, confidence scores, and risk severity correlations.
"""
import streamlit as st
import plotly.express as px
from components.charts import create_damage_distribution_chart, create_risk_distribution_chart

def render_analytics(session_mgr, yolo_detector, groq_svc):
    st.title("📊 AI Analytics & Engineering Metrics")
    st.markdown("##### Session Road Distress Aggregations and Defect Density")

    summary = session_mgr.get_summary_stats()
    inspections = session_mgr.get_inspections()

    if not inspections:
        st.info("No inspection data available for analytics. Perform inspections in **AI Road Inspector** first.")
        return

    c1, c2 = st.columns(2)
    with c1:
        st.plotly_chart(create_damage_distribution_chart(summary["damage_counts"]), use_container_width=True)
    with c2:
        st.plotly_chart(create_risk_distribution_chart(summary["risk_counts"]), use_container_width=True)

    # Dzongkhag defect distribution
    dz_counts = {}
    for i in inspections:
        dz = i.get("dzongkhag", "Unknown")
        cnt = len(i.get("detections", []))
        dz_counts[dz] = dz_counts.get(dz, 0) + cnt

    st.markdown("### Defect Density by Dzongkhag")
    if dz_counts:
        fig_dz = px.bar(
            x=list(dz_counts.keys()),
            y=list(dz_counts.values()),
            labels={"x": "Dzongkhag", "y": "Total Detected Defects"},
            color=list(dz_counts.values()),
            color_continuous_scale="Tealgrn"
        )
        fig_dz.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font=dict(color="#94a3b8"))
        st.plotly_chart(fig_dz, use_container_width=True)
