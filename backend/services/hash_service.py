import cv2
import imagehash
from PIL import Image
import numpy as np

def compute_hash(image_bytes: bytes) -> str:
    """
    Computes the perceptual hash of an image byte stream.
    We use phash as it's robust to minor edits, crops, and filters.
    """
    # Convert bytes to numpy array for OpenCV
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # If image cannot be decoded
    if img is None:
        raise ValueError("Could not decode image")

    # Convert BGR to RGB for PIL compatibility
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(img_rgb)
    
    # Compute perceptual hash
    hash_val = imagehash.phash(pil_image)
    return str(hash_val)

def calculate_similarity(hash1_str: str, hash2_str: str) -> float:
    """
    Calculates similarity percentage between two hex hash strings.
    """
    hash1 = imagehash.hex_to_hash(hash1_str)
    hash2 = imagehash.hex_to_hash(hash2_str)
    
    # Hamming distance: difference between hashes
    # Max difference for a 64-bit hash is 64
    distance = hash1 - hash2
    max_distance = len(hash1.hash) ** 2 # typically 64 for default hash size
    
    # Calculate percentage similarity
    similarity = ((max_distance - distance) / max_distance) * 100.0
    return max(0.0, similarity)
