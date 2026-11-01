"""
RoadSentry AI - Geospatial Mapping Service for Bhutan
Generates Folium map objects for current session inspection markers with verified coordinates.
"""
from typing import Dict, Any, List, Optional
from config.bhutan import BHUTAN_MAP_CENTER, BHUTAN_DEFAULT_ZOOM, BHUTAN_DZONGKHAGS

try:
    import folium
    from folium.plugins import MarkerCluster
    FOLIUM_AVAILABLE = True
except ImportError:
    folium = None
    MarkerCluster = None
    FOLIUM_AVAILABLE = False


class MappingService:
    """
    Builds Bhutan-centered GIS maps with interactive markers for current session records.
    Strictly forbids inventing fake GPS points.
    """

    @staticmethod
    def create_bhutan_map(
        inspections: List[Dict[str, Any]],
        filter_dzongkhag: Optional[str] = None,
        filter_risk: Optional[str] = None,
        filter_hazard: Optional[str] = None
    ):
        """
        Create a Folium map centered on Bhutan, populating only inspections with valid GPS coordinates.
        """
        if not FOLIUM_AVAILABLE:
            return None

        # Center on selected Dzongkhag if filtered, otherwise Bhutan center
        if filter_dzongkhag and filter_dzongkhag in BHUTAN_DZONGKHAGS:
            meta = BHUTAN_DZONGKHAGS[filter_dzongkhag]
            center = [meta["center_lat"], meta["center_lon"]]
            zoom = 11
        else:
            center = BHUTAN_MAP_CENTER
            zoom = BHUTAN_DEFAULT_ZOOM

        m = folium.Map(
            location=center,
            zoom_start=zoom,
            tiles="OpenStreetMap",
            control_scale=True
        )

        marker_cluster = MarkerCluster().add_to(m)

        color_map = {
            "CRITICAL": "red",
            "HIGH": "orange",
            "MEDIUM": "beige",
            "LOW": "green"
        }

        markers_placed = 0

        for insp in inspections:
            coords = insp.get("coordinates")
            if not coords or "lat" not in coords or "lon" not in coords:
                continue

            lat = float(coords["lat"])
            lon = float(coords["lon"])

            # Dzongkhag filter
            if filter_dzongkhag and filter_dzongkhag != "All" and insp.get("dzongkhag") != filter_dzongkhag:
                continue

            # Risk filter
            risk_level = insp.get("risk_assessment", {}).get("level", "LOW")
            if filter_risk and filter_risk != "All" and risk_level != filter_risk:
                continue

            # Hazard filter
            detections = insp.get("detections", [])
            class_codes = [d.get("class_code") for d in detections]
            if filter_hazard and filter_hazard != "All" and filter_hazard not in class_codes:
                continue

            # Popup content
            det_summary = ", ".join([f"{d.get('class_code')} ({d.get('class_name')})" for d in detections])
            popup_html = f"""
            <div style="font-family: sans-serif; font-size: 12px; width: 220px;">
                <b style="color: #0284c7;">{insp.get('id', 'Inspection')}</b><br/>
                <b>Dzongkhag:</b> {insp.get('dzongkhag', 'N/A')}<br/>
                <b>Road:</b> {insp.get('road_class', 'N/A')}<br/>
                <b>Risk:</b> <span style="font-weight:bold; color:{insp.get('risk_assessment', {}).get('color', '#333')};">{risk_level}</span><br/>
                <b>Defects:</b> {det_summary or 'None'}<br/>
                <b>GPS:</b> {lat:.4f}°N, {lon:.4f}°E
            </div>
            """

            marker_color = color_map.get(risk_level, "blue")
            folium.Marker(
                location=[lat, lon],
                popup=folium.Popup(popup_html, max_width=250),
                tooltip=f"{insp.get('id')} — {risk_level} Risk",
                icon=folium.Icon(color=marker_color, icon="info-sign")
            ).add_to(marker_cluster)
            markers_placed += 1

        return m
