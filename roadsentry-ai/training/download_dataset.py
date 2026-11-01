"""
RoadSentry AI - RDD2022 Dataset Downloader
Instructions and download script for the Road Damage Dataset 2022 (RDD2022) / CRDDC 2022.
Official: https://github.com/sekilab/RoadDamageDetector
"""
import os
import argparse
from pathlib import Path
import urllib.request
import zipfile

DATASET_URLS = {
    "Japan": "https://crddc2022.sekilab.global/data/Japan.tar.gz",
    "India": "https://crddc2022.sekilab.global/data/India.tar.gz",
    "Czech": "https://crddc2022.sekilab.global/data/Czech.tar.gz"
}

def download_rdd_subset(country: str = "India", target_dir: str = "data/rdd2022"):
    """
    Download and extract country subset of RDD2022.
    Note: RDD2022 is released under CC BY-SA 4.0 license.
    """
    target_path = Path(target_dir)
    target_path.mkdir(parents=True, exist_ok=True)
    
    url = DATASET_URLS.get(country)
    if not url:
        print(f"Unknown country '{country}'. Available: {list(DATASET_URLS.keys())}")
        return

    dest_file = target_path / f"{country}.tar.gz"
    print(f"Downloading RDD2022 ({country}) from {url} to {dest_file}...")
    try:
        urllib.request.urlretrieve(url, dest_file)
        print(f"Download complete: {dest_file}")
    except Exception as e:
        print(f"Direct download failed: {e}")
        print("Please visit https://crddc2022.sekilab.global/data/ to manually download tar.gz archives.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download RDD2022 road damage dataset subset.")
    parser.add_argument("--country", default="India", choices=["India", "Japan", "Czech"])
    parser.add_argument("--dir", default="data/rdd2022")
    args = parser.parse_args()
    download_rdd_subset(args.country, args.dir)
