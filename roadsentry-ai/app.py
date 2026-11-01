"""
RoadSentry AI — Intelligent Road Safety & Infrastructure Audit Intelligence
Main Streamlit Application Entry Point for GitHub Codespaces & Local Execution.
"""
import streamlit as st

# 1. Page Configuration (must be very first Streamlit call)
st.set_page_config(
    page_title="RoadSentry AI — Road Safety & Audit Intelligence",
    page_icon="🇧🇹",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 2. Imports after set_page_config
from components.ui_styles import CUSTOM_CSS
from components.sidebar import render_sidebar
from core.session_manager import SessionManager
from services.yolo_detector import YOLODetector
from services.groq_service import GroqService

from pages.command_center import render_command_center
from pages.road_inspector import render_road_inspector
from pages.infrastructure_audit import render_infrastructure_audit
from pages.hazard_map import render_hazard_map
from pages.analytics import render_analytics
from pages.reports import render_reports
from pages.ai_assistant import render_ai_assistant
from pages.model_lab import render_model_lab
from pages.settings import render_settings

# Apply Custom Styling
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# 3. Initialize Session State
if "session_manager" not in st.session_state:
    st.session_state.session_manager = SessionManager(st.session_state)

if "yolo_detector" not in st.session_state:
    st.session_state.yolo_detector = YOLODetector()

if "groq_service" not in st.session_state:
    st.session_state.groq_service = GroqService()

session_mgr = st.session_state.session_manager
yolo_det = st.session_state.yolo_detector
groq_svc = st.session_state.groq_service

# 4. Render Sidebar and Navigation
current_page = render_sidebar()

# 5. Route to Page
if current_page == "Command Center":
    render_command_center(session_mgr, yolo_det, groq_svc)
elif current_page == "AI Road Inspector":
    render_road_inspector(session_mgr, yolo_det, groq_svc)
elif current_page == "Infrastructure Audit":
    render_infrastructure_audit(session_mgr, yolo_det, groq_svc)
elif current_page == "Bhutan Hazard Map":
    render_hazard_map(session_mgr, yolo_det, groq_svc)
elif current_page == "AI Analytics":
    render_analytics(session_mgr, yolo_det, groq_svc)
elif current_page == "AI Reports":
    render_reports(session_mgr, yolo_det, groq_svc)
elif current_page == "AI Assistant":
    render_ai_assistant(session_mgr, yolo_det, groq_svc)
elif current_page == "Model Lab":
    render_model_lab(session_mgr, yolo_det, groq_svc)
elif current_page == "Settings & About":
    render_settings(session_mgr, yolo_det, groq_svc)
