"""
RoadSentry AI - Custom Exception Hierarchy
"""

class RoadSentryException(Exception):
    """Base exception for all RoadSentry AI errors."""
    pass

class ModelNotFoundError(RoadSentryException):
    """Raised when YOLO weights or model checkpoint cannot be loaded."""
    pass

class ValidationError(RoadSentryException):
    """Raised when an uploaded file violates format, dimension or security constraints."""
    pass

class InferenceError(RoadSentryException):
    """Raised during computer vision or YOLO model inference failure."""
    pass

class GroqAPIError(RoadSentryException):
    """Raised when the Groq generative/multimodal API returns an error or times out."""
    pass

class DocumentProcessingError(RoadSentryException):
    """Raised when extracting text or tables from an audit document fails."""
    pass

class SessionError(RoadSentryException):
    """Raised when session state manipulation encounters an inconsistent state."""
    pass
