"""
RoadSentry AI - Pascal VOC XML to YOLO Annotation Converter & Dataset YAML Generator
Converts RDD2022 bounding boxes to normalized YOLO format (class x_center y_center width height).
"""
import os
import xml.etree.ElementTree as ET
from pathlib import Path
import random
import shutil

CLASS_MAPPING = {
    "D00": 0,  # Longitudinal Crack
    "D10": 1,  # Transverse Crack
    "D20": 2,  # Alligator Crack
    "D40": 3   # Pothole
}

def convert_voc_to_yolo(xml_file: Path, img_width: int, img_height: int) -> list:
    """Parse Pascal VOC XML and convert to YOLO normalized format."""
    tree = ET.parse(xml_file)
    root = tree.getroot()
    yolo_lines = []

    for obj in root.findall("object"):
        name = obj.find("name").text
        if name not in CLASS_MAPPING:
            continue
        
        class_id = CLASS_MAPPING[name]
        bndbox = obj.find("bndbox")
        xmin = float(bndbox.find("xmin").text)
        ymin = float(bndbox.find("ymin").text)
        xmax = float(bndbox.find("xmax").text)
        ymax = float(bndbox.find("ymax").text)

        # Normalize
        x_center = ((xmin + xmax) / 2.0) / img_width
        y_center = ((ymin + ymax) / 2.0) / img_height
        box_w = (xmax - xmin) / img_width
        box_h = (ymax - ymin) / img_height

        yolo_lines.append(f"{class_id} {x_center:.6f} {y_center:.6f} {box_w:.6f} {box_h:.6f}")

    return yolo_lines

def generate_dataset_yaml(output_path: str = "data/rdd2022_yolo/dataset.yaml"):
    """Generate YOLOv8 dataset configuration YAML file."""
    yaml_content = f"""# RoadSentry AI - RDD2022 YOLOv8 Dataset Config
path: {os.path.abspath('data/rdd2022_yolo')}
train: images/train
val: images/val
test: images/test

names:
  0: D00_Longitudinal_Crack
  1: D10_Transverse_Crack
  2: D20_Alligator_Crack
  3: D40_Pothole
"""
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        f.write(yaml_content)
    print(f"Generated YAML at {output_path}")

if __name__ == "__main__":
    generate_dataset_yaml()
