"""
RoadSentry AI - Interactive Plotly Chart Components
"""
import plotly.graph_objects as go
import plotly.express as px

def create_damage_distribution_chart(damage_counts: dict) -> go.Figure:
    """Bar chart of verified damage categories (D00, D10, D20, D40)."""
    labels = ["D00 Longitudinal", "D10 Transverse", "D20 Alligator", "D40 Pothole"]
    keys = ["D00", "D10", "D20", "D40"]
    values = [damage_counts.get(k, 0) for k in keys]
    colors_list = ["#38bdf8", "#a855f7", "#f97316", "#ef4444"]

    fig = go.Figure(data=[
        go.Bar(
            x=labels,
            y=values,
            marker_color=colors_list,
            text=values,
            textposition="auto"
        )
    ])
    fig.update_layout(
        title="Road Damage Detections by Class (RDD2022)",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#94a3b8"),
        margin=dict(l=20, r=20, t=40, b=20),
        yaxis=dict(gridcolor="#334155")
    )
    return fig

def create_risk_distribution_chart(risk_counts: dict) -> go.Figure:
    """Donut chart of risk categories."""
    labels = ["Low", "Medium", "High", "Critical"]
    values = [
        risk_counts.get("LOW", 0),
        risk_counts.get("MEDIUM", 0),
        risk_counts.get("HIGH", 0),
        risk_counts.get("CRITICAL", 0),
    ]
    colors_list = ["#10b981", "#eab308", "#f97316", "#ef4444"]

    fig = go.Figure(data=[
        go.Pie(
            labels=labels,
            values=values,
            hole=0.55,
            marker_colors=colors_list,
            textinfo="label+value"
        )
    ])
    fig.update_layout(
        title="Session Hazard Risk Prioritization",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#94a3b8"),
        margin=dict(l=20, r=20, t=40, b=20),
        showlegend=False
    )
    return fig
