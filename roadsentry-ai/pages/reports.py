"""
RoadSentry AI - Page 6: AI Reports & Evidence Export
Downloadable audit dossiers in PDF, DOCX, JSON, and CSV.
"""
import streamlit as st
from services.report_generator import ReportGenerator

def render_reports(session_mgr, yolo_detector, groq_svc):
    st.title("📑 AI Reports & Evidence Dossiers")
    st.markdown("##### Audit Working Paper Generation & Multi-Format Evidence Packages")

    st.markdown("""
    <div class="audit-disclaimer-box">
        <b>STATUTORY DISCLAIMER:</b> Every exported document is labeled:
        <i>'AI-Assisted Draft Audit Report — Subject to Professional Auditor Review.'</i>
        Outputs are derived strictly from active session evidence without any persistent database storage.
    </div>
    """, unsafe_allow_html=True)

    summary = session_mgr.get_summary_stats()
    inspections = session_mgr.get_inspections()
    findings = session_mgr.get_audit_findings()

    st.markdown(f"**Session Summary:** {len(inspections)} inspections, {len(findings)} 5C findings, {len(session_mgr.get_documents())} standards documents.")

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("### 📄 Formal Audit Dossier (PDF & DOCX)")
        st.write("Comprehensive structured report with executive metrics, visual inspection catalog, and 5C audit findings.")
        
        # PDF Export
        try:
            pdf_bytes = ReportGenerator.generate_pdf_report(summary, inspections, findings)
            st.download_button(
                label="📥 Download Audit Report (PDF)",
                data=pdf_bytes,
                file_name=f"RoadSentry_Audit_Dossier_{session_mgr._state['session_id']}.pdf",
                mime="application/pdf",
                use_container_width=True
            )
        except Exception as e:
            st.error(f"PDF generation requires reportlab: {e}")

        # DOCX Export
        try:
            docx_bytes = ReportGenerator.generate_docx_report(summary, inspections, findings)
            st.download_button(
                label="📥 Download Editable Report (DOCX)",
                data=docx_bytes,
                file_name=f"RoadSentry_Audit_Report_{session_mgr._state['session_id']}.docx",
                mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                use_container_width=True
            )
        except Exception as e:
            st.error(f"DOCX generation requires python-docx: {e}")

    with col2:
        st.markdown("### 📊 Tabular & Machine-Readable Data (CSV & JSON)")
        st.write("Structured exports for analytical pipelines, GIS geodatabases, and audit record archives.")

        # CSV Export
        csv_data = ReportGenerator.generate_csv_inspections(inspections)
        st.download_button(
            label="📥 Download Inspection Records (CSV)",
            data=csv_data,
            file_name=f"RoadSentry_Inspections_{session_mgr._state['session_id']}.csv",
            mime="text/csv",
            use_container_width=True
        )

        # JSON Export
        json_data = session_mgr.export_full_session()
        json_str = ReportGenerator.generate_json_export(json_data)
        st.download_button(
            label="📥 Download Complete Session Package (JSON)",
            data=json_str,
            file_name=f"RoadSentry_Session_Package_{session_mgr._state['session_id']}.json",
            mime="application/json",
            use_container_width=True
        )
