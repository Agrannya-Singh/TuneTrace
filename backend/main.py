from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv
import requests
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import pandas as pd
import numpy as np
import json
from datetime import datetime
import logging

# Import our custom modules
from database import get_db, SessionLocal
from ml_utils import recommender, model_manager

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TuneTrace ML Backend",
    description="ML-based music recommendation service for TuneTrace",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Song(BaseModel):
    id: str
    title: str
    artist: str
    album_art_url: str
    preview_url: Optional[str] = None
    source: str  # 'youtube' or 'spotify'
    spotify_uri: Optional[str] = None
    duration: Optional[int] = None
    album: Optional[str] = None
    popularity: Optional[int] = None
    features: Optional[Dict[str, Any]] = None

class RecommendationRequest(BaseModel):
    liked_songs: List[Song]
    mood: Optional[str] = None
    genre: Optional[str] = None
    limit: int = 20
    source: str = "youtube"  # 'youtube' or 'spotify'

class SearchRequest(BaseModel):
    query: str
    source: str = "youtube"
    limit: int = 20

# Initialize API clients
class APIClients:
    def __init__(self):
        self.youtube_api_key = os.getenv("YOUTUBE_API_KEY")
        self.spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
        self.spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        
        # Initialize YouTube API
        if self.youtube_api_key:
            self.youtube_service = build('youtube', 'v3', developerKey=self.youtube_api_key)
        else:
            self.youtube_service = None
            logger.warning("YouTube API key not found")
        
        # Initialize Spotify API
        if self.spotify_client_id and self.spotify_client_secret:
            self.spotify_credentials = SpotifyClientCredentials(
                client_id=self.spotify_client_id,
                client_secret=self.spotify_client_secret
            )
            self.spotify_client = spotipy.Spotify(client_credentials_manager=self.spotify_credentials)
        else:
            self.spotify_client = None
            logger.warning("Spotify credentials not found")

# Initialize API clients
api_clients = APIClients()

# Use the advanced ML recommender from ml_utils
ml_engine = recommender

# YouTube API functions
async def search_youtube_tracks(query: str, limit: int = 20) -> List[Song]:
    """Search for tracks on YouTube"""
    if not api_clients.youtube_service:
        raise HTTPException(status_code=500, detail="YouTube API not configured")
    
    try:
        search_response = api_clients.youtube_service.search().list(
            q=query,
            part='snippet',
            maxResults=limit * 2,  # Get more to filter
            type='video',
            videoCategoryId='10'  # Music category
        ).execute()
        
        songs = []
        for item in search_response.get('items', []):
            video_id = item['id']['videoId']
            
            # Get video details for duration
            video_response = api_clients.youtube_service.videos().list(
                part='contentDetails,snippet',
                id=video_id
            ).execute()
            
            if video_response.get('items'):
                video = video_response['items'][0]
                duration = video['contentDetails']['duration']
                
                # Convert ISO 8601 duration to seconds
                import re
                match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
                if match:
                    hours, minutes, seconds = match.groups()
                    total_seconds = (int(hours or 0) * 3600 + 
                                   int(minutes or 0) * 60 + 
                                   int(seconds or 0))
                    
                    # Filter out shorts and very long videos
                    if 60 <= total_seconds <= 900:  # 1-15 minutes
                        song = Song(
                            id=video_id,
                            title=item['snippet']['title'],
                            artist=item['snippet']['channelTitle'],
                            album_art_url=item['snippet']['thumbnails']['high']['url'],
                            preview_url=f"https://www.youtube.com/embed/{video_id}",
                            source="youtube",
                            duration=total_seconds * 1000  # Convert to milliseconds
                        )
                        songs.append(song)
                        
                        if len(songs) >= limit:
                            break
        
        return songs
    except HttpError as e:
        logger.error(f"YouTube API error: {e}")
        raise HTTPException(status_code=500, detail="YouTube API error")

# Spotify API functions
async def search_spotify_tracks(query: str, limit: int = 20) -> List[Song]:
    """Search for tracks on Spotify"""
    if not api_clients.spotify_client:
        raise HTTPException(status_code=500, detail="Spotify API not configured")
    
    try:
        results = api_clients.spotify_client.search(
            q=query,
            type='track',
            limit=limit
        )
        
        songs = []
        for track in results['tracks']['items']:
            # Get audio features
            features = api_clients.spotify_client.audio_features(track['id'])[0]
            
            # Get artist genres
            artist_genres = []
            if track['artists']:
                artist = api_clients.spotify_client.artist(track['artists'][0]['id'])
                artist_genres = artist['genres']
            
            song = Song(
                id=track['id'],
                title=track['name'],
                artist=track['artists'][0]['name'],
                album_art_url=track['album']['images'][0]['url'] if track['album']['images'] else "",
                preview_url=track['preview_url'],
                source="spotify",
                spotify_uri=track['uri'],
                duration=track['duration_ms'],
                album=track['album']['name'],
                popularity=track['popularity'],
                features={
                    'genres': artist_genres,
                    'danceability': features['danceability'],
                    'energy': features['energy'],
                    'valence': features['valence'],
                    'tempo': features['tempo'],
                    'acousticness': features['acousticness'],
                    'instrumentalness': features['instrumentalness']
                }
            )
            songs.append(song)
        
        return songs
    except Exception as e:
        logger.error(f"Spotify API error: {e}")
        raise HTTPException(status_code=500, detail="Spotify API error")

# API Endpoints
@app.get("/")
async def root():
    return {"message": "TuneTrace ML Backend API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/search")
async def search_tracks(request: SearchRequest):
    """Search for tracks on YouTube or Spotify"""
    try:
        if request.source == "youtube":
            songs = await search_youtube_tracks(request.query, request.limit)
        elif request.source == "spotify":
            songs = await search_spotify_tracks(request.query, request.limit)
        else:
            raise HTTPException(status_code=400, detail="Invalid source. Use 'youtube' or 'spotify'")
        
        return {"songs": songs}
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Get ML-based recommendations based on liked songs"""
    try:
        if not request.liked_songs:
            # If no liked songs, return popular tracks
            if request.source == "youtube":
                songs = await search_youtube_tracks(f"{request.mood or 'popular'} {request.genre or 'music'}", request.limit)
            else:
                songs = await search_spotify_tracks(f"{request.mood or 'popular'} {request.genre or 'music'}", request.limit)
            return {"songs": songs, "reason": "No liked songs provided, returning popular tracks"}
        
        # Convert Pydantic models to dictionaries for ML processing
        liked_songs_dict = [song.dict() for song in request.liked_songs]
        
        # Create user profile using advanced ML
        user_profile = ml_engine.create_user_profile(liked_songs_dict)
        
        # Search for candidate songs
        search_query = f"{request.mood or ''} {request.genre or ''} music".strip()
        if not search_query:
            search_query = "popular music"
        
        if request.source == "youtube":
            candidate_songs = await search_youtube_tracks(search_query, request.limit * 2)
        else:
            candidate_songs = await search_spotify_tracks(search_query, request.limit * 2)
        
        # Convert candidate songs to dictionaries
        candidate_songs_dict = [song.dict() for song in candidate_songs]
        
        # Filter out already liked songs
        liked_ids = {song.id for song in request.liked_songs}
        candidate_songs_dict = [song for song in candidate_songs_dict if song['id'] not in liked_ids]
        
        # Get advanced ML-based recommendations
        recommended_songs_dict = ml_engine.hybrid_recommendation(
            liked_songs_dict, 
            candidate_songs_dict
        )
        
        # Convert back to Song objects
        recommended_songs = [Song(**song) for song in recommended_songs_dict[:request.limit]]
        
        return {
            "songs": recommended_songs,
            "user_profile": user_profile,
            "reason": "Advanced ML-based recommendations using hybrid filtering"
        }
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user-profile")
async def get_user_profile(liked_songs: str):
    """Get user profile analysis"""
    try:
        # Parse liked songs from query parameter
        songs_data = json.loads(liked_songs)
        songs = [Song(**song_data) for song_data in songs_data]
        
        user_profile = ml_engine.get_user_profile(songs)
        return {"user_profile": user_profile}
    except Exception as e:
        logger.error(f"User profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 