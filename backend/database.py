from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Float, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tunetrace.db")
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    liked_songs = relationship("LikedSong", back_populates="user")
    user_profiles = relationship("UserProfile", back_populates="user")

class Song(Base):
    __tablename__ = "songs"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    album_art_url = Column(String)
    preview_url = Column(String)
    source = Column(String, nullable=False)  # 'youtube' or 'spotify'
    spotify_uri = Column(String)
    duration = Column(Integer)  # in milliseconds
    album = Column(String)
    popularity = Column(Integer)
    features = Column(Text)  # JSON string of audio features
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    liked_by = relationship("LikedSong", back_populates="song")

class LikedSong(Base):
    __tablename__ = "liked_songs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(String, ForeignKey("songs.id"), nullable=False)
    liked_at = Column(DateTime, default=datetime.utcnow)
    rating = Column(Float, default=1.0)  # User rating (1-5)
    
    # Relationships
    user = relationship("User", back_populates="liked_songs")
    song = relationship("Song", back_populates="liked_by")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dominant_cluster = Column(Integer)
    genre_preferences = Column(Text)  # JSON string
    artist_preferences = Column(Text)  # JSON string
    source_preferences = Column(Text)  # JSON string
    total_liked = Column(Integer, default=0)
    avg_popularity = Column(Float, default=0.0)
    avg_duration = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="user_profiles")

class MLModel(Base):
    __tablename__ = "ml_models"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    model_path = Column(String, nullable=False)
    model_type = Column(String, nullable=False)  # 'recommendation', 'clustering', etc.
    version = Column(String, nullable=False)
    accuracy = Column(Float)
    training_data_size = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(String, nullable=False)
    source = Column(String, nullable=False)  # 'youtube' or 'spotify'
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Database utility functions
def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)

def init_db():
    """Initialize database with tables"""
    create_tables()
    print("Database tables created successfully")

if __name__ == "__main__":
    init_db() 