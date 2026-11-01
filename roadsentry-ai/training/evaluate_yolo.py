"""
RoadSentry AI - YOLOv8 Road Damage Model Evaluation
Computes genuine mAP50, mAP50-95, precision, and recall on the test/validation split.
"""
import argparse
from pathlib import Path

def evaluate_model(
    model_path: str = "models/road_damage_yolov8n.pt",
    data_yaml: str = "data/rdd2022_yolo/dataset.yaml",
    imgsz: int = 640,
    conf: float = 0.35
):
    """Evaluate YOLOv8 model checkpoint on road damage dataset."""
    try:
        from ultralytics import YOLO
    except ImportError:
        print("Ultralytics is not installed. Run: pip install ultralytics")
        return

    if not Path(model_path).exists():
        print(f"Model checkpoint not found at {model_path}.")
        return

    print(f"Loading {model_path} for validation on {data_yaml}...")
    model = YOLO(model_path)
    metrics = model.val(data=data_yaml, imgsz=imgsz, conf=conf)

    print("\n=== Genuine Evaluation Results ===")
    print(f"mAP50:      {metrics.box.map50:.4f}")
    print(f"mAP50-95:   {metrics.box.map:.4f}")
    print(f"Precision:  {metrics.box.mp:.4f}")
    print(f"Recall:     {metrics.box.mr:.4f}")

    return metrics

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate YOLOv8 on test set.")
    parser.add_argument("--model", default="models/road_damage_yolov8n.pt")
    parser.add_argument("--data", default="data/rdd2022_yolo/dataset.yaml")
    args = parser.parse_args()
    evaluate_model(args.model, args.data)
