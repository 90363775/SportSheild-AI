import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

DATABASE_URL = "sqlite:///./sportshield.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class SuspiciousMedia(Base):
    __tablename__ = "suspicious_media"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    phash = Column(String, index=True)
    added_at = Column(DateTime, default=datetime.datetime.utcnow)

class ViolationLog(Base):
    __tablename__ = "violation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    similarity = Column(Float)
    risk_level = Column(String)
    reason = Column(String)
    matched_asset = Column(String, nullable=True)
    source_platform = Column(String, default="manual")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
