"""
RoadSentry AI - Sidebar Navigation Component
"""
import streamlit as st
from config.settings import APP_NAME, APP_SUBTITLE, COUNTRY_FOCUS

def render_sidebar():
    """Render top application brand and page selector in Streamlit sidebar."""
    with st.sidebar:
        st.markdown(f"### 🇧🇹 {APP_NAME}")
        st.caption(f"{APP_SUBTITLE} • {COUNTRY_FOCUS}")
        st.divider()

        pages = [
            "Command Center",
            "AI Road Inspector",
            "Infrastructure Audit",
            "Bhutan Hazard Map",
            "AI Analytics",
            "AI Reports",
            "AI Assistant",
            "Model Lab",
            "Settings & About"
        ]

        selected_page = st.radio("Navigation", pages, index=0)
        st.divider()

        # Session Controls
        st.markdown("#### ⚡ Session Controls")
        if st.button("🗑️ Clear Active Session", use_container_width=True):
            if "session_manager" in st.session_state:
                st.session_state.session_manager.clear_session()
                st.success("Session reset.")
                st.rerun()

        st.caption("🔒 Zero persistent database. All data strictly resides in memory for this session.")
        return selected_page
