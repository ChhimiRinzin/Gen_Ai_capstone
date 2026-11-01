"""
RoadSentry AI - Computer Vision & Image Processing Service
Authentic OpenCV deterministic image processing and quality analysis.
"""
from typing import Dict, Any, Tuple, List, Optional
import numpy as np
from PIL import Image
import io

# We import cv2 safely or provide fallback if running in lightweight testing
try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    cv2 = None
    CV2_AVAILABLE = False


class ImageProcessor:
    """
    Implements genuine computer vision processing using OpenCV:
    - Laplacian variance for blur detection
    - Brightness and contrast analysis
    - Canny edge detection
    - CLAHE (Adaptive Histogram Equalization) enhancement
    - Detection bounding box overlays
    """

    @staticmethod
    def load_image_from_bytes(file_bytes: bytes) -> np.ndarray:
        """Decode image bytes into an RGB numpy array."""
        image = Image.open(io.BytesIO(file_bytes))
        image = image.convert("RGB")
        return np.array(image)

    @staticmethod
    def analyze_image_quality(img_rgb: np.ndarray) -> Dict[str, Any]:
        """
        Assess image quality using traditional computer vision metrics:
        - Blur detection via variance of Laplacian
        - Mean intensity for brightness
        - Standard deviation of intensity for contrast
        """
        if not CV2_AVAILABLE:
            # Fallback pure numpy implementation
            gray = np.dot(img_rgb[..., :3], [0.2989, 0.5870, 0.1140]).astype(np.float32)
            # Simple gradient variance approximation
            grad_x = np.diff(gray, axis=1)
            blur_score = float(np.var(grad_x))
            brightness = float(np.mean(gray))
            contrast = float(np.std(gray))
        else:
            gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            blur_score = float(laplacian.var())
            brightness = float(np.mean(gray))
            contrast = float(np.std(gray))

        # Classifications
        is_blurry = blur_score < 100.0
        is_underexposed = brightness < 45.0
        is_overexposed = brightness > 210.0
        is_low_contrast = contrast < 35.0

        if is_blurry:
            quality_status = "Blurry — Camera motion or defocus"
        elif is_underexposed:
            quality_status = "Underexposed — Insufficient road lighting"
        elif is_overexposed:
            quality_status = "Overexposed — Severe solar glare"
        elif is_low_contrast:
            quality_status = "Low Contrast — Hazy or washed-out surface"
        else:
            quality_status = "Good — Suitable for AI damage audit"

        return {
            "blur_metric": round(blur_score, 2),
            "blur_threshold": 100.0,
            "is_blurry": is_blurry,
            "brightness": round(brightness, 1),
            "contrast": round(contrast, 1),
            "quality_status": quality_status,
            "dimensions": {"width": img_rgb.shape[1], "height": img_rgb.shape[0]},
            "megapixels": round((img_rgb.shape[1] * img_rgb.shape[0]) / 1_000_000, 2)
        }

    @staticmethod
    def generate_canny_edges(img_rgb: np.ndarray, low_thresh: int = 50, high_thresh: int = 150) -> np.ndarray:
        """Generate Canny edge visualization to highlight pavement fracture patterns."""
        if not CV2_AVAILABLE:
            gray = np.dot(img_rgb[..., :3], [0.2989, 0.5870, 0.1140]).astype(np.uint8)
            # Simple threshold gradient
            grad = np.abs(np.diff(gray, axis=0, prepend=0)) + np.abs(np.diff(gray, axis=1, prepend=0))
            edges = (grad > 30).astype(np.uint8) * 255
            return edges
        gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        edges = cv2.Canny(blurred, low_thresh, high_thresh)
        return edges

    @staticmethod
    def enhance_road_surface(img_rgb: np.ndarray) -> np.ndarray:
        """Enhance road surface details using CLAHE on the luminance channel."""
        if not CV2_AVAILABLE:
            return img_rgb
        lab = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        enhanced_lab = cv2.merge((cl, a, b))
        return cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2RGB)

    @staticmethod
    def draw_detections(
        img_rgb: np.ndarray,
        detections: List[Dict[str, Any]],
        show_labels: bool = True,
        show_conf: bool = True
    ) -> np.ndarray:
        """Overlay bounding boxes and class tags onto the image."""
        annotated = img_rgb.copy()
        h, w = annotated.shape[:2]

        color_map = {
            "D00": (56, 189, 248),   # Sky blue
            "D10": (168, 85, 247),   # Purple
            "D20": (249, 115, 22),   # Orange
            "D40": (239, 68, 68),    # Red
        }

        if not CV2_AVAILABLE:
            return annotated

        for det in detections:
            bbox = det.get("bbox", [])  # [x1, y1, x2, y2]
            if len(bbox) != 4:
                continue
            x1, y1, x2, y2 = [int(v) for v in bbox]
            code = det.get("class_code", "D00")
            color = color_map.get(code, (0, 255, 128))
            
            # Draw box
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 3)

            # Draw tag
            if show_labels:
                conf = det.get("confidence", 0.0)
                label_text = f"{code}: {det.get('class_name', '')}"
                if show_conf:
                    label_text += f" ({conf:.0%})"
                
                # Tag background
                (txt_w, txt_h), baseline = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.55, 1)
                tag_y = max(y1 - 8, txt_h + 8)
                cv2.rectangle(annotated, (x1, tag_y - txt_h - 4), (x1 + txt_w + 8, tag_y + baseline), color, -1)
                cv2.putText(annotated, label_text, (x1 + 4, tag_y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1, cv2.LINE_AA)

        return annotated

    @staticmethod
    def crop_detection(img_rgb: np.ndarray, bbox: List[int]) -> Optional[np.ndarray]:
        """Crop a specific detected damage region."""
        h, w = img_rgb.shape[:2]
        x1, y1, x2, y2 = [int(v) for v in bbox]
        x1 = max(0, x1)
        y1 = max(0, y1)
        x2 = min(w, x2)
        y2 = min(h, y2)
        if x2 > x1 and y2 > y1:
            return img_rgb[y1:y2, x1:x2]
        return None
