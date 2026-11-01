"""
RoadSentry AI - Page 7: Session-Based AI Assistant
Groq-powered conversational auditor assistant grounded strictly in current session inspections and standards.
"""
import streamlit as st

def render_ai_assistant(session_mgr, yolo_detector, groq_svc):
    st.title("🤖 AI Road & Audit Assistant")
    st.markdown("##### Evidence-Grounded Conversational Intelligence (Powered by Groq Llama-3.3)")

    st.caption("🔒 The AI Assistant answers queries strictly using verified current session inspections and uploaded standards documents.")

    chat_history = session_mgr.get_chat_history()

    # Display chat log
    for msg in chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])
            if msg.get("citations"):
                st.caption(f"Citations: {', '.join(msg['citations'])}")

    # Prompt suggestions
    st.markdown("###### Suggested Questions:")
    s_col1, s_col2 = st.columns(2)
    sug_q = None
    with s_col1:
        if st.button("Which inspection currently presents the highest road safety risk?"):
            sug_q = "Which inspection currently presents the highest road safety risk?"
    with s_col2:
        if st.button("Summarize all detected road distress classes across the active session."):
            sug_q = "Summarize all detected road distress classes across the active session."

    user_input = st.chat_input("Ask about session road damage, risk factors, or audit standards...")
    query = user_input or sug_q

    if query:
        session_mgr.append_chat("user", query)
        with st.chat_message("user"):
            st.markdown(query)

        session_ctx = {
            "inspections": session_mgr.get_inspections(),
            "documents": session_mgr.get_documents(),
            "audit_findings": session_mgr.get_audit_findings()
        }

        with st.chat_message("assistant"):
            with st.spinner("Synthesizing grounded response..."):
                resp = groq_svc.answer_auditor_question(query, session_ctx, chat_history)
                ans_text = resp.get("answer", "No response.")
                st.markdown(ans_text)
                session_mgr.append_chat("assistant", ans_text)
                st.rerun()
