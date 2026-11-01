"""
RoadSentry AI - Page 4: Bhutan Hazard Map
Interactive GIS visualization of verified session inspection coordinates across Bhutan's 20 Dzongkhags.
"""
import streamlit as st
from config.bhutan import BHUTAN_DZONGKHAGS
from services.mapping_service import MappingService

try:
    from streamlit_folium import st_folium
    STREAMLIT_FOLIUM_AVAILABLE = True
except ImportError:
    STREAMLIT_FOLIUM_AVAILABLE = False

def render_hazard_map(session_mgr, yolo_detector, groq_svc):
    st.title("🗺️ Bhutan Interactive Hazard Map")
    st.markdown("##### Geospatial Intelligence across the 20 Dzongkhags of the Kingdom of Bhutan")

    inspections = session_mgr.get_inspections()
    inspections_with_coords = [i for i in inspections if i.get("coordinates") and "lat" in i.get("coordinates")]

    # Filters
    col_f1, col_f2, col_f3 = st.columns(3)
    with col_f1:
        dz_options = ["All"] + list(BHUTAN_DZONGKHAGS.keys())
        filter_dz = st.selectbox("Filter Dzongkhag", dz_options)
    with col_f2:
        filter_risk = st.selectbox("Filter Risk Priority", ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"])
    with col_f3:
        filter_hazard = st.selectbox("Filter Hazard Category", ["All", "D00", "D10", "D20", "D40"])

    st.markdown(f"**Verified Incident Markers in Session:** {len(inspections_with_coords)}")

    if not inspections_with_coords:
        st.info("No inspections with GPS coordinates recorded in this session. Save inspections with GPS in **AI Road Inspector** to visualize them here.")
    else:
        bhutan_map = MappingService.create_bhutan_map(
            inspections=inspections,
            filter_dzongkhag=filter_dz if filter_dz != "All" else None,
            filter_risk=filter_risk if filter_risk != "All" else None,
            filter_hazard=filter_hazard if filter_hazard != "All" else None
        )
        if bhutan_map and STREAMLIT_FOLIUM_AVAILABLE:
            st_folium(bhutan_map, width=800, height=500)
        else:
            st.warning("Folium or streamlit-folium not installed. Coordinate table shown below:")
            st.table([
                {
                    "ID": i["id"],
                    "Dzongkhag": i["dzongkhag"],
                    "Road": i["road_class"],
                    "Risk": i.get("risk_assessment", {}).get("level"),
                    "Latitude": i["coordinates"]["lat"],
                    "Longitude": i["coordinates"]["lon"],
                }
                for i in inspections_with_coords
            ])
