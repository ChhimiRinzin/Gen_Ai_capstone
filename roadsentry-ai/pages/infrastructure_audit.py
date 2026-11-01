"""
RoadSentry AI - Page 3: Infrastructure Audit
Audit document processing, criteria-versus-condition comparative analysis, 5C finding generation, and human auditor review.
"""
import streamlit as st
from services.document_processor import DocumentProcessor
from services.audit_analyzer import AuditAnalyzer
from core.file_validator import FileValidator

def render_infrastructure_audit(session_mgr, yolo_detector, groq_svc):
    st.title("📋 Infrastructure Audit Intelligence")
    st.markdown("##### Technical Standards Comparison & 5C Audit Finding Synthesizer")

    st.markdown("""
    <div class="audit-disclaimer-box">
        <b>HUMAN-IN-THE-LOOP AUDIT PRINCIPLE:</b> AI-generated observations are draft working papers.
        Lead auditors must exercise professional skepticism and substantiate causes and liability.
    </div>
    """, unsafe_allow_html=True)

    tab_upload_doc, tab_compare, tab_findings = st.tabs([
        "📄 1. Upload Standards & Criteria",
        "⚖️ 2. Criteria vs Condition Analysis",
        "📑 3. Draft 5C Audit Findings"
    ])

    # TAB 1: Document Upload
    with tab_upload_doc:
        st.markdown("### Upload Contractual Specifications & Maintenance Tolerances")
        doc_file = st.file_uploader(
            "Upload Standard / Contract (PDF, DOCX, TXT, CSV, XLSX)",
            type=["pdf", "docx", "txt", "csv", "xlsx"]
        )

        if doc_file is not None:
            file_bytes = doc_file.read()
            valid, err = FileValidator.validate_document_file(doc_file.name, file_bytes)
            if not valid:
                st.error(err)
            else:
                extracted = DocumentProcessor.extract_document(doc_file.name, file_bytes)
                if extracted.get("error"):
                    st.error(extracted["error"])
                else:
                    st.success(f"Parsed **{doc_file.name}** ({extracted.get('page_count', 1)} pages).")
                    if extracted.get("is_scanned_warning"):
                        st.warning(extracted["scanned_notice"])
                    
                    st.markdown("#### Extracted Criteria Candidates")
                    criteria = extracted.get("criteria_candidates", [])
                    if not criteria:
                        st.info("No explicit road tolerance keywords matched. Full text available for manual reference.")
                    else:
                        for c in criteria:
                            st.markdown(f"- **{c['ref']}:** *{c['criterion']}*")

                    if st.button("📥 Save Document to Active Session", key="save_doc_btn"):
                        session_mgr.add_document({
                            "filename": doc_file.name,
                            "text": extracted.get("text", ""),
                            "page_count": extracted.get("page_count", 1),
                            "extracted_criteria": criteria
                        })
                        st.success("Document saved to session!")
                        st.rerun()

        # Display already uploaded documents
        docs = session_mgr.get_documents()
        if docs:
            st.markdown("---")
            st.markdown("#### Active Session Documents")
            for d in docs:
                st.markdown(f"- **{d['id']}**: `{d['filename']}` ({len(d.get('extracted_criteria', []))} criteria clauses)")

    # TAB 2: Criteria vs Condition
    with tab_compare:
        inspections = session_mgr.get_inspections()
        docs = session_mgr.get_documents()

        if not inspections:
            st.info("No road inspections available in this session. Process an inspection in **AI Road Inspector** first.")
        else:
            col_sel1, col_sel2 = st.columns(2)
            with col_sel1:
                insp_map = {f"{i['id']} ({i['filename']} - {i.get('dzongkhag')})": i for i in inspections}
                sel_insp_key = st.selectbox("Select Inspection Evidence", list(insp_map.keys()))
                sel_insp = insp_map[sel_insp_key]
            with col_sel2:
                criteria_list = []
                for d in docs:
                    for c in d.get("extracted_criteria", []):
                        criteria_list.append({"ref": f"{d['filename']} - {c['ref']}", "criterion": c["criterion"]})
                
                # Default baseline standard if no doc uploaded
                if not criteria_list:
                    criteria_list.append({
                        "ref": "DoST Standard Maintenance Manual (Bhutan)",
                        "criterion": "Potholes exceeding 25mm depth and active alligator cracking shall be repaired within 48 hours."
                    })
                
                sel_crit = st.selectbox("Select Applicable Audit Criterion", criteria_list, format_func=lambda x: f"{x['ref']}")

            st.markdown("---")
            st.markdown("#### Comparative Analysis")
            comparison = AuditAnalyzer.compare_evidence_vs_criteria(sel_insp, sel_crit)

            c_c1, c_c2 = st.columns(2)
            with c_c1:
                st.markdown("##### 📌 Standard Criterion (What Should Be)")
                st.info(f"**{comparison['criterion_ref']}**\n\n\"{comparison['criterion_text']}\"")
            with c_c2:
                st.markdown("##### 📷 Observed Condition (What Was Verified)")
                st.warning(f"**Evidence {comparison['inspection_id']}**\n\n{comparison['condition_observed']}")

            # Generate 5C Finding Button
            auditor_notes = st.text_input("Optional Auditor Context Notes", placeholder="e.g. Contractor defect notification period expired on 2026-09-15")
            if st.button("⚡ Synthesize Structured 5C Audit Finding", type="primary"):
                finding = AuditAnalyzer.generate_5c_finding(sel_insp, sel_crit, auditor_notes)
                session_mgr.add_audit_finding(finding)
                st.success(f"Generated Audit Finding **{finding['id']}**! Switch to Tab 3 to review and edit.")
                st.rerun()

    # TAB 3: 5C Findings Review
    with tab_findings:
        findings = session_mgr.get_audit_findings()
        if not findings:
            st.info("No 5C audit findings created yet. Use Tab 2 to synthesize findings from verified evidence.")
        else:
            st.markdown(f"### Current Draft Audit Findings ({len(findings)})")
            for idx, f in enumerate(findings):
                with st.expander(f"Finding #{idx+1}: {f['title']} [{f['verification_status']}]", expanded=True):
                    st.markdown(f"**Evidence Link:** `{f.get('evidence_id')}` | **Severity:** `{f.get('severity')}`")
                    
                    st.markdown(f"**1. Criteria:** {f['criteria']}")
                    st.markdown(f"**2. Condition:** {f['condition']}")
                    st.markdown(f"**3. Cause:** {f['cause']}")
                    st.markdown(f"**4. Consequence:** {f['consequence']}")
                    st.markdown(f"**5. Corrective Action:** {f['recommendation']}")

                    st.markdown("---")
                    st.markdown("##### ✍️ Human Auditor Review & Sign-Off")
                    new_status = st.selectbox(
                        "Verification Status",
                        [
                            "Unverified — Pending Field Audit",
                            "Confirmed by Field Auditor",
                            "Modified upon Technical Verification",
                            "Excluded — False Positive / Non-Material"
                        ],
                        index=0 if "Unverified" in f.get("verification_status") else 1,
                        key=f"status_{f['id']}"
                    )
                    new_comment = st.text_area("Auditor Formal Comments", value=f.get("auditor_comments", ""), key=f"comm_{f['id']}")

                    b_c1, b_c2 = st.columns(2)
                    with b_c1:
                        if st.button("💾 Save Auditor Review", key=f"save_rev_{f['id']}"):
                            session_mgr.update_audit_finding(f["id"], {
                                "verification_status": new_status,
                                "auditor_comments": new_comment,
                                "is_human_confirmed": "Confirmed" in new_status
                            })
                            st.success("Finding updated.")
                            st.rerun()
                    with b_c2:
                        if st.button("🗑️ Exclude Finding", key=f"del_fnd_{f['id']}"):
                            session_mgr.remove_audit_finding(f["id"])
                            st.info("Finding excluded.")
                            st.rerun()
