import os
from google import genai
from typing import Tuple, Optional
import base64
from dotenv import load_dotenv

# Load environment variables from .env.local at the root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env.local'))

# Configure Gemini
# You must set GEMINI_API_KEY environment variable.
try:
    client = genai.Client()
except Exception as e:
    # Handle environment where API key might not be set yet
    client = None

def get_risk_score(similarity: float) -> Tuple[str, str]:
    """
    Determines risk level and a basic reason based on similarity.
    """
    if similarity >= 90.0:
        return "High", "Near duplicate detected. Likely a direct copy or very minor modification."
    elif similarity >= 70.0:
        return "Medium", "Significant similarity detected. Possible crop, color filter, or watermark removal."
    else:
        return "Low", "Low similarity. Media appears to be distinct or heavily modified."

def explain_with_gemini(similarity: float, image_bytes: Optional[bytes] = None) -> str:
    """
    Uses Gemini AI to generate a contextual explanation of the match.
    """
    if client is None:
        return "AI explanation unavailable: Gemini not configured."
        
    prompt = f"An uploaded image was analyzed against our database of suspicious/copyrighted media. It resulted in a perceptual similarity score of {similarity:.1f}%. Based on this score, provide a brief, professional 1-sentence explanation of what this means for copyright violation (e.g. 'This uploaded content appears to be a modified duplicate with minor changes' or 'This content appears largely distinct'). Do not hallucinate specifics about the image contents unless you are absolutely sure."
    
    # If we wanted to pass the actual image to Gemini Vision for a better explanation:
    # (Simplified for now to rely on the similarity score to save bandwidth/latency,
    # but the image_bytes are passed in if you want to implement multimodal later.)
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "Error generating AI explanation."
