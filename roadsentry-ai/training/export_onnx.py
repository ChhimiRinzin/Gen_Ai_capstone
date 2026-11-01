"""
RoadSentry AI - YOLOv8 Road Damage Model ONNX Export Script
Converts trained PyTorch weights (.pt) to ONNX format optimized for ONNX Runtime Web.
Outputs to:
  - public/models/road_damage_yolov8n.onnx (for direct browser web inference)
  - models/road_damage_yolov8n.onnx (for backend/codespace inference)

Classes included in RDD2022 trained model:
  0: D00 - Longitudinal Crack
  1: D10 - Transverse Crack
  2: D20 - Alligator Crack
  3: D40 - Pothole
"""

import argparse
import os
import shutil
from pathlib import Path

def export_to_onnx(
    weights_path: str = "models/road_damage_yolov8n.pt",
    output_dir: str = "public/models",
    imgsz: int = 640,
    opset: int = 12,
    simplify: bool = True
):
    print(f"[RoadSentry AI] Starting ONNX export from: {weights_path}")
    
    if not os.path.exists(weights_path):
        print(f"Error: Weights file '{weights_path}' does not exist.")
        print("Please train the model first using 'python training/train_yolo.py',")
        print("or place your trained RDD2022 YOLOv8 .pt checkpoint at that path.")
        return False

    try:
        from ultralytics import YOLO
    except ImportError:
        print("Error: Ultralytics is required for export. Install with:")
        print("  pip install ultralytics onnx")
        return False

    # Load model
    print("Loading YOLO model weights...")
    model = YOLO(weights_path)
    
    # Verify class count
    print(f"Model class mapping: {model.names}")
    has_d40 = any("D40" in str(v) or "Pothole" in str(v) or "pothole" in str(v).lower() for v in model.names.values())
    if not has_d40:
        print("WARNING: 'D40' or 'Pothole' not explicitly found in model class mapping.")
        print(f"Available classes: {model.names}")
    else:
        print("Verified: Model includes D40 (Pothole) class.")

    # Export to ONNX format
    print(f"Exporting to ONNX with imgsz={imgsz}, opset={opset}, dynamic=False...")
    exported_file = model.export(
        format="onnx",
        imgsz=imgsz,
        opset=opset,
        simplify=simplify,
        dynamic=False
    )
    
    print(f"Export completed: {exported_file}")
    
    # Copy to target frontend public directory
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    target_path = Path(output_dir) / "road_damage_yolov8n.onnx"
    shutil.copy(exported_file, target_path)
    print(f"Successfully staged for browser web inference at: {target_path}")
    
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export trained YOLOv8 road damage weights to ONNX.")
    parser.add_argument("--weights", default="models/road_damage_yolov8n.pt", help="Path to .pt weights file")
    parser.add_argument("--output", default="public/models", help="Output directory for browser applet")
    parser.add_argument("--imgsz", type=int, default=640, help="Inference resolution (square)")
    parser.add_argument("--opset", type=int, default=12, help="ONNX opset version")
    args = parser.parse_args()
    
    export_to_onnx(args.weights, args.output, args.imgsz, args.opset)
