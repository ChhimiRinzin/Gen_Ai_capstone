"""
RoadSentry AI - Page 9: Settings & Responsible AI
Configuration, Groq API credentials, session privacy guarantees, and academic capstone attribution.
"""
import streamlit as st
import os
from config.settings import (
    APP_NAME, APP_SUBTITLE, COUNTRY_FOCUS, VERSION, ACADEMIC_CREDIT,
    GROQ_TEXT_MODEL, GROQ_VISION_MODEL
)

def render_settings(session_mgr, yolo_detector, groq_svc):
    st.title("⚙️ Settings & About")
    st.markdown("##### Configuration, Privacy Guarantees, and Capstone Project Attribution")

    # Groq API Configuration
    st.markdown("### 1. Groq Generative & Multimodal AI Credentials")
    curr_key = os.getenv("GROQ_API_KEY", "")
    masked_key = curr_key[:6] + "..." + curr_key[-4:] if len(curr_key) > 10 else "Not configured"
    st.write(f"**Current Status:** {'✅ Configured' if groq_svc.is_configured() else '⚠️ Unconfigured'}")
    st.write(f"**Text Model:** `{GROQ_TEXT_MODEL}`")
    st.write(f"**Vision Model:** `{GROQ_VISION_MODEL}`")

    new_key = st.text_input("Enter Groq API Key (starts with gsk_)", type="password", placeholder="gsk_...")
    if st.button("Save API Key in Active Session"):
        if new_key.strip():
            os.environ["GROQ_API_KEY"] = new_key.strip()
            groq_svc.api_key = new_key.strip()
            # reinit client
            if hasattr(groq_svc, "_reinit"):
                groq_svc._reinit()
            st.success("API key registered for this session!")
            st.rerun()

    st.markdown("---")
    st.markdown("### 2. Session Privacy & Responsible AI Statement")
    st.markdown("""
    - **Zero Database Persistence:** This application deliberately uses no SQLite, PostgreSQL, MongoDB, or Firebase backend. All inspection photos, video frames, GPS coordinates, and generated audit dossiers reside in transient memory during your session.
    - **No Fabricated Outputs:** Detections are generated solely from genuine model inference. When weights or external API credentials are not provided, the platform transparently reports its operational status rather than hallucinating outputs.
    - **Decision-Support Boundary:** RoadSentry AI produces preliminary triage indicators. It does not replace the statutory authority of certified road engineers or public performance auditors.
    """)

    st.markdown("---")
    st.markdown("### 3. Academic Capstone Project Attribution")
    st.write(f"**Application:** {APP_NAME} — {APP_SUBTITLE}")
    st.write(f"**Beneficiary Jurisdiction:** {COUNTRY_FOCUS}")
    st.write(f"**Programme & Institution:** {ACADEMIC_CREDIT}")
    st.write(f"**Version:** `{VERSION}`")
