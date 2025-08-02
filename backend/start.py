#!/usr/bin/env python3
"""
TuneTrace ML Backend Startup Script
Initializes the database, loads ML models, and starts the FastAPI server
"""

import os
import sys
import uvicorn
from dotenv import load_dotenv
import logging

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_db
from ml_utils import recommender, model_manager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def initialize_backend():
    """Initialize the backend components"""
    try:
        # Initialize database
        logger.info("Initializing database...")
        init_db()
        logger.info("Database initialized successfully")
        
        # Initialize ML models
        logger.info("Initializing ML models...")
        
        # Create models directory if it doesn't exist
        models_dir = os.getenv("ML_MODEL_PATH", "./ml_models")
        os.makedirs(os.path.dirname(models_dir), exist_ok=True)
        
        logger.info("ML models initialized successfully")
        
        # Test ML components
        logger.info("Testing ML components...")
        test_songs = [
            {
                'id': 'test1',
                'title': 'Test Song 1',
                'artist': 'Test Artist',
                'source': 'spotify',
                'popularity': 75,
                'duration': 180000,
                'features': {
                    'genres': ['pop', 'rock'],
                    'danceability': 0.7,
                    'energy': 0.8,
                    'valence': 0.6
                }
            }
        ]
        
        user_profile = recommender.create_user_profile(test_songs)
        logger.info(f"User profile test successful: {len(user_profile)} profile elements")
        
        logger.info("Backend initialization completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Backend initialization failed: {e}")
        return False

def main():
    """Main startup function"""
    logger.info("Starting TuneTrace ML Backend...")
    
    # Check environment variables
    required_env_vars = [
        "YOUTUBE_API_KEY",
        "SPOTIFY_CLIENT_ID", 
        "SPOTIFY_CLIENT_SECRET"
    ]
    
    missing_vars = []
    for var in required_env_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.warning(f"Missing environment variables: {missing_vars}")
        logger.warning("Some features may not work without these variables")
    
    # Initialize backend
    if not initialize_backend():
        logger.error("Failed to initialize backend. Exiting.")
        sys.exit(1)
    
    # Start the server
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    logger.info(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 