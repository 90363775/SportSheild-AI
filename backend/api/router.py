from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from services import hash_service, analysis_service, logging_service

router = APIRouter()

@router.post("/media/suspicious")
async def register_suspicious(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a media file to act as a baseline suspicious/official asset.
    """
    try:
        contents = await file.read()
        phash = hash_service.compute_hash(contents)
        
        media = logging_service.register_suspicious_media(db, file.filename, phash)
        return {"message": "Suspicious media registered", "id": media.id, "phash": phash}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/media/analyze")
async def analyze_media(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a media file, compute its hash, and compare it against all registered suspicious media.
    Logs the violation and uses Gemini AI for an explanation.
    """
    try:
        contents = await file.read()
        uploaded_hash = hash_service.compute_hash(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
        
    known_media = logging_service.get_all_suspicious_media(db)
    
    if not known_media:
        return {"message": "No suspicious media registered to compare against.", "similarity": 0}
        
    highest_similarity = 0.0
    matched_asset_name = None
    
    # Compare against all known hashes
    for asset in known_media:
        sim = hash_service.calculate_similarity(uploaded_hash, asset.phash)
        if sim > highest_similarity:
            highest_similarity = sim
            matched_asset_name = asset.filename
            
    # Determine risk and reason
    risk_level, reason = analysis_service.get_risk_score(highest_similarity)
    
    # Generate AI explanation
    ai_explanation = analysis_service.explain_with_gemini(highest_similarity, contents)
    
    # Log violation
    log = logging_service.log_violation(
        db=db,
        filename=file.filename,
        similarity=highest_similarity,
        risk_level=risk_level,
        reason=reason,
        matched_asset=matched_asset_name,
        source_platform="upload_portal"
    )
    
    return {
        "filename": file.filename,
        "similarity": round(highest_similarity, 2),
        "risk": risk_level,
        "reason": reason,
        "ai_explanation": ai_explanation,
        "matched_asset": matched_asset_name,
        "log_id": log.id
    }

@router.get("/analytics/violations")
async def get_violations(db: Session = Depends(get_db)):
    """
    Retrieve all logged violations for the frontend dashboard.
    """
    violations = logging_service.get_all_violations(db)
    return violations
