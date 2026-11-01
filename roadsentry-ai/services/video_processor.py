"""
RoadSentry AI - Video Road Inspection Engine
Processes uploaded MP4 video with configurable frame sampling and stationary hazard deduplication notes.
"""
from pathlib import Path
from typing import Dict, Any, List, Optional
import tempfile
import os

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    cv2 = None
    CV2_AVAILABLE = False


class VideoProcessor:
    """
    Extracts frames from road inspection videos at calibrated intervals,
    executes YOLO road damage detection, and summarizes detections.
    """

    @staticmethod
    def process_video_stream(
        video_bytes: bytes,
        detector,
        sampling_interval_sec: float = 1.0,
        max_frames_to_process: int = 30,
        conf_threshold: float = 0.35
    ) -> Dict[str, Any]:
        """
        Sample and analyze video frames. Uses temporary file with deterministic cleanup.
        """
        if not CV2_AVAILABLE:
            return {
                "success": False,
                "error": "OpenCV (cv2) is required for video decoding.",
                "frames": [],
                "summary": {}
            }

        # Write to temporary file for cv2.VideoCapture
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp_file:
            tmp_path = tmp_file.name
            tmp_file.write(video_bytes)

        try:
            cap = cv2.VideoCapture(tmp_path)
            if not cap.isOpened():
                return {
                    "success": False,
                    "error": "Could not open video stream. Verify codec compatibility.",
                    "frames": [],
                    "summary": {}
                }

            fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration_sec = total_frames / fps if fps > 0 else 0.0

            frame_step = max(1, int(fps * sampling_interval_sec))
            processed_frames = []
            current_frame_idx = 0
            damage_aggregate = {"D00": 0, "D10": 0, "D20": 0, "D40": 0}

            while cap.isOpened() and len(processed_frames) < max_frames_to_process:
                cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame_idx)
                ret, bgr_frame = cap.read()
                if not ret:
                    break

                rgb_frame = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)
                timestamp_sec = round(current_frame_idx / fps, 2)

                # Run detector on frame
                det_result = detector.detect(rgb_frame, conf_threshold=conf_threshold)
                detections = det_result.get("detections", [])

                for d in detections:
                    c = d.get("class_code", "D00")
                    if c in damage_aggregate:
                        damage_aggregate[c] += 1

                processed_frames.append({
                    "frame_index": current_frame_idx,
                    "timestamp_sec": timestamp_sec,
                    "timestamp_str": f"{int(timestamp_sec // 60):02d}:{int(timestamp_sec % 60):02d}.{int((timestamp_sec % 1) * 10)}",
                    "detections_count": len(detections),
                    "detections": detections,
                    "rgb_frame": rgb_frame  # numpy array
                })

                current_frame_idx += frame_step
                if current_frame_idx >= total_frames:
                    break

            cap.release()

            return {
                "success": True,
                "video_metadata": {
                    "fps": round(fps, 1),
                    "total_frames": total_frames,
                    "duration_sec": round(duration_sec, 1),
                    "sampled_frames_count": len(processed_frames)
                },
                "damage_aggregate": damage_aggregate,
                "frames": processed_frames,
                "deduplication_notice": (
                    "Important Auditor Limitation: Video frame sampling counts visible damage regions per sampled frame. "
                    "Without inertial vehicle odometry or multi-object tracking (DeepSORT/ByteTrack), consecutive frames of "
                    "the same stationary pothole or crack may register multiple times. Auditor verification is advised."
                )
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
