"""
RoadSentry AI - YOLOv8 Training Script for Road Damage Detection
Supports CPU and GPU training on RDD2022 dataset with fine-tuning options.
"""
import argparse
from pathlib import Path

def train_road_damage_model(
    data_yaml: str = "data/rdd2022_yolo/dataset.yaml",
    base_model: str = "yolov8n.pt",
    epochs: int = 50,
    imgsz: int = 640,
    batch_size: int = 16,
    device: str = "cpu"
):
    """Fine-tune YOLOv8 on Road Damage Dataset."""
    try:
        from ultralytics import YOLO
    except ImportError:
        print("Ultralytics is not installed. Run: pip install ultralytics")
        return

    print(f"Initializing YOLO model from {base_model}...")
    model = YOLO(base_model)

    print(f"Starting training on {data_yaml} (Epochs: {epochs}, ImgSz: {imgsz}, Device: {device})...")
    results = model.train(
        data=data_yaml,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch_size,
        device=device,
        plots=True,
        project="runs/road_damage_train",
        name="yolov8n_rdd2022"
    )

    best_weights = Path("runs/road_damage_train/yolov8n_rdd2022/weights/best.pt")
    if best_weights.exists():
        target = Path("models/road_damage_yolov8n.pt")
        target.parent.mkdir(parents=True, exist_ok=True)
        import shutil
        shutil.copy(best_weights, target)
        print(f"Copied best model weights to {target}")

    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLOv8 on RDD2022 road damage dataset.")
    parser.add_argument("--data", default="data/rdd2022_yolo/dataset.yaml")
    parser.add_argument("--model", default="yolov8n.pt")
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch", type=int, default=8)
    parser.add_argument("--device", default="cpu", help="cpu or 0 for CUDA GPU")
    args = parser.parse_args()
    train_road_damage_model(args.data, args.model, args.epochs, batch_size=args.batch, device=args.device)
