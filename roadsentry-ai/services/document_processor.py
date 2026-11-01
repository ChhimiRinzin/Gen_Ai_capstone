"""
RoadSentry AI - Audit Document Extraction Service
Extracts text and structured criteria from PDF, DOCX, TXT, CSV, and Excel documents.
"""
from pathlib import Path
from typing import Dict, Any, List, Optional
import io

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    fitz = None
    PYMUPDF_AVAILABLE = False

try:
    import docx
    DOCX_AVAILABLE = True
except ImportError:
    docx = None
    DOCX_AVAILABLE = False

try:
    import pandas as pd
    PANDAS_AVAILABLE = True
except ImportError:
    pd = None
    PANDAS_AVAILABLE = False


class DocumentProcessor:
    """
    Parses audit standards, technical specifications, and maintenance contracts.
    Handles scanned PDFs honestly: warns if pages contain raster images without OCR text.
    """

    @staticmethod
    def extract_document(filename: str, file_bytes: bytes) -> Dict[str, Any]:
        """Route to appropriate parser based on extension."""
        ext = Path(filename).suffix.lower()

        if ext == ".pdf":
            return DocumentProcessor._extract_pdf(filename, file_bytes)
        elif ext in [".docx", ".doc"]:
            return DocumentProcessor._extract_docx(filename, file_bytes)
        elif ext in [".txt", ".md"]:
            return DocumentProcessor._extract_text(filename, file_bytes)
        elif ext in [".csv", ".xlsx", ".xls"]:
            return DocumentProcessor._extract_tabular(filename, file_bytes, ext)
        else:
            return {
                "filename": filename,
                "text": "",
                "page_count": 0,
                "error": f"Unsupported format '{ext}'."
            }

    @staticmethod
    def _extract_pdf(filename: str, file_bytes: bytes) -> Dict[str, Any]:
        """Extract text from PDF using PyMuPDF (fitz) with scanned page detection."""
        if not PYMUPDF_AVAILABLE:
            # Fallback text extraction if fitz is not installed
            return {
                "filename": filename,
                "text": "PyMuPDF not available in current environment. Please install pymupdf.",
                "page_count": 0,
                "is_scanned_warning": False,
                "criteria_candidates": []
            }

        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            total_pages = len(doc)
            full_text = []
            empty_text_pages = 0

            for page_num in range(total_pages):
                page = doc[page_num]
                text = page.get_text()
                if not text.strip():
                    empty_text_pages += 1
                else:
                    full_text.append(f"--- [Page {page_num + 1}] ---\n" + text)

            joined_text = "\n\n".join(full_text)
            is_scanned = (empty_text_pages == total_pages and total_pages > 0)

            # Heuristic criteria extraction for common road audit clauses
            criteria_candidates = DocumentProcessor._extract_criteria_heuristics(joined_text)

            return {
                "filename": filename,
                "text": joined_text,
                "page_count": total_pages,
                "empty_pages_count": empty_text_pages,
                "is_scanned_warning": is_scanned,
                "scanned_notice": (
                    "Warning: Document appears to be a scanned bitmap PDF with no embedded digital text layer. "
                    "Optical Character Recognition (OCR) is required to parse textual clauses."
                    if is_scanned else None
                ),
                "criteria_candidates": criteria_candidates
            }
        except Exception as e:
            return {
                "filename": filename,
                "text": "",
                "page_count": 0,
                "error": f"PDF parse error: {str(e)}"
            }

    @staticmethod
    def _extract_docx(filename: str, file_bytes: bytes) -> Dict[str, Any]:
        """Extract paragraphs and tables from Word DOCX."""
        if not DOCX_AVAILABLE:
            return {
                "filename": filename,
                "text": "python-docx not installed.",
                "page_count": 1,
                "criteria_candidates": []
            }
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            
            # Also extract tables
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        paragraphs.append(row_text)

            joined_text = "\n\n".join(paragraphs)
            return {
                "filename": filename,
                "text": joined_text,
                "page_count": max(1, len(paragraphs) // 15),
                "criteria_candidates": DocumentProcessor._extract_criteria_heuristics(joined_text)
            }
        except Exception as e:
            return {"filename": filename, "text": "", "error": f"DOCX parse error: {str(e)}"}

    @staticmethod
    def _extract_text(filename: str, file_bytes: bytes) -> Dict[str, Any]:
        """Extract plain UTF-8 text."""
        try:
            text = file_bytes.decode("utf-8", errors="replace")
            return {
                "filename": filename,
                "text": text,
                "page_count": 1,
                "criteria_candidates": DocumentProcessor._extract_criteria_heuristics(text)
            }
        except Exception as e:
            return {"filename": filename, "text": "", "error": str(e)}

    @staticmethod
    def _extract_tabular(filename: str, file_bytes: bytes, ext: str) -> Dict[str, Any]:
        """Extract CSV or Excel tabular records."""
        if not PANDAS_AVAILABLE:
            text = file_bytes.decode("utf-8", errors="ignore")
            return {"filename": filename, "text": text, "page_count": 1, "criteria_candidates": []}

        try:
            if ext == ".csv":
                df = pd.read_csv(io.BytesIO(file_bytes))
            else:
                df = pd.read_excel(io.BytesIO(file_bytes))
            
            text_repr = df.to_string(max_rows=100)
            return {
                "filename": filename,
                "text": text_repr,
                "page_count": max(1, len(df) // 25),
                "row_count": len(df),
                "columns": list(df.columns),
                "criteria_candidates": DocumentProcessor._extract_criteria_heuristics(text_repr)
            }
        except Exception as e:
            return {"filename": filename, "text": "", "error": f"Tabular parse error: {str(e)}"}

    @staticmethod
    def _extract_criteria_heuristics(text: str) -> List[Dict[str, str]]:
        """
        Identify road standard clauses, maintenance tolerances, and contractual criteria
        using pattern matching for standards like DoST, MoIT, IRC, or FIDIC.
        """
        candidates = []
        lines = text.split("\n")
        
        keywords = ["shall", "must", "tolerance", "pothole", "crack", "depth", "repair", "specification", "clause", "maintenance"]
        
        for i, line in enumerate(lines):
            clean = line.strip()
            if len(clean) > 25 and any(k in clean.lower() for k in keywords):
                candidates.append({
                    "ref": f"Clause/Snippet #{len(candidates)+1}",
                    "criterion": clean[:250],
                    "context": "\n".join(lines[max(0, i-1):min(len(lines), i+2)])
                })
                if len(candidates) >= 10:
                    break

        return candidates
