from sqlalchemy.orm import Session
from database import ViolationLog, SuspiciousMedia

def log_violation(db: Session, filename: str, similarity: float, risk_level: str, reason: str, matched_asset: str = None, source_platform: str = "manual"):
    """
    Records a violation scan in the database.
    """
    new_log = ViolationLog(
        filename=filename,
        similarity=similarity,
        risk_level=risk_level,
        reason=reason,
        matched_asset=matched_asset,
        source_platform=source_platform
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def register_suspicious_media(db: Session, filename: str, phash: str):
    """
    Registers a new piece of media as suspicious/official.
    """
    media = SuspiciousMedia(filename=filename, phash=phash)
    db.add(media)
    db.commit()
    db.refresh(media)
    return media

def get_all_suspicious_media(db: Session):
    """
    Returns all registered suspicious media for comparison.
    """
    return db.query(SuspiciousMedia).all()

def get_all_violations(db: Session):
    """
    Retrieves all logged violations for the analytics dashboard.
    """
    return db.query(ViolationLog).order_by(ViolationLog.timestamp.desc()).all()
