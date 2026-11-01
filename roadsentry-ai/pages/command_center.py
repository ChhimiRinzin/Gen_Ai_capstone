"""
RoadSentry AI - Page 1: Command Center
High-level situational awareness dashboard for session road inspections and audit activities.
"""
import streamlit as st
from components.metrics import render_kpi_cards
from components.charts import create_damage_distribution_chart, create_risk_distribution_chart
from config.settings import RDD2022_CLASSES

def render_command_center(session_mgr, yolo_detector, groq_svc):
    st.title("🏛️ Command Center")
    st.markdown("##### Real-Time Situational Dashboard — Kingdom of Bhutan Road Infrastructure")
    
    # Disclaimer
    st.markdown("""
    <div class="audit-disclaimer-box">
        <b>DRAFT & DECISION-SUPPORT NOTICE:</b> RoadSentry AI produces preliminary triage indicators. 
        All AI findings must be verified on-site by certified public auditors and road engineers.
    </div>
    """, unsafe_allow_html=True)

    summary = session_mgr.get_summary_stats()
    render_kpi_cards(summary)

    st.markdown("<br/>", unsafe_allow_html=True)

    # Empty State Guidance or Live Charts
    if summary["total_inspections"] == 0:
        st.info("ℹ️ **Active session is currently empty.** Head to **AI Road Inspector** to upload road inspection photos, run real YOLO inference, and assess road distress risks.")
    else:
        col_c1, col_c2 = st.columns(2)
        with col_c1:
            fig1 = create_damage_distribution_chart(summary["damage_counts"])
            st.plotly_chart(fig1, use_container_width=True)
        with col_c2:
            fig2 = create_risk_distribution_chart(summary["risk_counts"])
            st.plotly_chart(fig2, use_container_width=True)

    # System Status & Activity Trail
    col_s1, col_s2 = st.columns([1, 1])
    with col_s1:
        st.markdown("### ⚙️ Engine Readiness")
        yolo_status = yolo_detector.get_status()
        st.write(f"**YOLO Engine:** {yolo_status['model_type']}")
        st.write(f"**Weights Exists on Disk:** {'✅ Yes' if yolo_status['weights_exist'] else '⚠️ No weights file'}")
        st.write(f"**Groq Multimodal:** {'✅ Ready' if groq_svc.is_configured() else '⚠️ Unconfigured (Set API Key)'}")
        st.write(f"**Database:** 🚫 Zero Persistent Database (Strict Session Isolation)")

    with col_s2:
        st.markdown("### 📋 Recent Session Actions")
        actions = summary.get("recent_actions", [])
        if not actions:
            st.write("No actions logged yet in this session.")
        else:
            for act in actions[:5]:
                st.markdown(f"- **{act['action']}** — `{act['timestamp']}`")
