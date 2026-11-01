"""
RoadSentry AI - UI Theme & Custom Styling
Professional dark theme: Deep navy background (#0b1329), graphite surfaces (#162038), teal & cyan accents.
"""

CUSTOM_CSS = """
<style>
/* Main app background */
.stApp {
    background-color: #0b1329;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
}

/* Sidebar styling */
[data-testid="stSidebar"] {
    background-color: #0f1a36;
    border-right: 1px solid #1e293b;
}

/* Metric card */
.sentry-metric-card {
    background: linear-gradient(135deg, #162038 0%, #1e293b 100%);
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}
.sentry-metric-val {
    font-size: 26px;
    font-weight: 700;
    color: #38bdf8;
    margin-top: 4px;
}
.sentry-metric-lbl {
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Header badge */
.sentry-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}
.badge-critical { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
.badge-high { background-color: rgba(249, 115, 22, 0.2); color: #fb923c; border: 1px solid #f97316; }
.badge-medium { background-color: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid #eab308; }
.badge-low { background-color: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }

/* Disclaimer banner */
.audit-disclaimer-box {
    background-color: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #ef4444;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 12px;
    color: #fca5a5;
    margin: 12px 0 20px 0;
}
</style>
"""
