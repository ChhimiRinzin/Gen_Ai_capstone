"""
RoadSentry AI - File Validation and Security Checker
"""
from pathlib import Path
from typing import Tuple, Optional
from config.settings import (
    MAX_IMAGE_SIZE_MB,
    MAX_VIDEO_SIZE_MB,
    MAX_DOC_SIZE_MB,
    ALLOWED_IMAGE_EXTS,
    ALLOWED_VIDEO_EXTS,
    ALLOWED_DOC_EXTS,
)
from core.exceptions import ValidationError

class FileValidator:
    """Validates uploaded files for size, extension, and integrity."""

    @staticmethod
    def validate_image_file(filename: str, file_bytes: bytes) -> Tuple[bool, Optional[str]]:
        """Validate uploaded image file."""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_IMAGE_EXTS:
            return False, f"Unsupported image format '{ext}'. Allowed: {', '.join(sorted(ALLOWED_IMAGE_EXTS))}"
        
        size_mb = len(file_bytes) / (1024 * 1024)
        if size_mb > MAX_IMAGE_SIZE_MB:
            return False, f"File size {size_mb:.1f} MB exceeds limit of {MAX_IMAGE_SIZE_MB} MB."
        
        if len(file_bytes) < 32:
            return False, "File is empty or corrupt."
            
        return True, None

    @staticmethod
    def validate_video_file(filename: str, file_bytes: bytes) -> Tuple[bool, Optional[str]]:
        """Validate uploaded video file."""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_VIDEO_EXTS:
            return False, f"Unsupported video format '{ext}'. Allowed: {', '.join(sorted(ALLOWED_VIDEO_EXTS))}"
            
        size_mb = len(file_bytes) / (1024 * 1024)
        if size_mb > MAX_VIDEO_SIZE_MB:
            return False, f"Video size {size_mb:.1f} MB exceeds limit of {MAX_VIDEO_SIZE_MB} MB."
            
        if len(file_bytes) < 128:
            return False, "Video file is corrupt or empty."
            
        return True, None

    @staticmethod
    def validate_document_file(filename: str, file_bytes: bytes) -> Tuple[bool, Optional[str]]:
        """Validate uploaded audit document."""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_DOC_EXTS:
            return False, f"Unsupported document format '{ext}'. Allowed: {', '.join(sorted(ALLOWED_DOC_EXTS))}"
            
        size_mb = len(file_bytes) / (1024 * 1024)
        if size_mb > MAX_DOC_SIZE_MB:
            return False, f"Document size {size_mb:.1f} MB exceeds limit of {MAX_DOC_SIZE_MB} MB."
            
        if len(file_bytes) < 16:
            return False, "Document file is empty."
            
        return True, None
