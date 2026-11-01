"""
RoadSentry AI - KPI Metric Display Components
"""
import streamlit as st

def render_kpi_cards(summary: dict):
    """Render top 4 executive KPI cards."""
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(f"""
        <div class="sentry-metric-card">
            <div class="sentry-metric-lbl">Total Inspections</div>
            <div class="sentry-metric-val">{summary.get('total_inspections', 0)}</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown(f"""
        <div class="sentry-metric-card">
            <div class="sentry-metric-lbl">YOLO Detections</div>
            <div class="sentry-metric-val" style="color:#2dd4bf;">{summary.get('total_detections', 0)}</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        crit_count = summary.get('risk_counts', {}).get('CRITICAL', 0)
        st.markdown(f"""
        <div class="sentry-metric-card">
            <div class="sentry-metric-lbl">Critical Risks</div>
            <div class="sentry-metric-val" style="color:#f87171;">{crit_count}</div>
        </div>
        """, unsafe_allow_html=True)
    with c4:
        st.markdown(f"""
        <div class="sentry-metric-card">
            <div class="sentry-metric-lbl">5C Audit Findings</div>
            <div class="sentry-metric-val" style="color:#c084fc;">{summary.get('total_findings', 0)}</div>
        </div>
        """, unsafe_allow_html=True)
