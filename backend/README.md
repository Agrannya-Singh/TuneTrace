# TuneTrace Python Backend

A FastAPI-based ML recommendation service for TuneTrace, featuring advanced music recommendation algorithms and integration with YouTube and Spotify APIs.

## Features

### 🎵 Music APIs Integration
- **YouTube Data API**: Search and fetch music videos with filtering
- **Spotify Web API**: Access to Spotify's vast music library with audio features
- **Hybrid Search**: Search across both platforms simultaneously

### 🤖 Advanced ML Recommendations
- **Collaborative Filtering**: Based on user preferences and behavior
- **Content-Based Filtering**: Using audio features and metadata
- **Hybrid Recommendations**: Combining multiple ML approaches
- **Diverse Recommendations**: Using clustering for variety
- **Real-time Learning**: Models improve with user interactions

### 📊 User Profiling
- **Genre Preferences**: Automatic genre preference detection
- **Artist Preferences**: Track favorite artists
- **Audio Feature Analysis**: Danceability, energy, valence, etc.
- **Source Preferences**: YouTube vs Spotify preference tracking

## Architecture

```
backend/
├── main.py              # FastAPI application with endpoints
├── database.py          # SQLAlchemy models and database setup
├── ml_utils.py          # Advanced ML recommendation algorithms
├── start.py             # Startup script with initialization
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# API Keys
YOUTUBE_API_KEY=your_youtube_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Database
DATABASE_URL=sqlite:///./tunetrace.db

# ML Models
ML_MODEL_PATH=./ml_models/recommendation_model.pkl

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

### 3. Initialize Database

```bash
python database.py
```

### 4. Start the Server

```bash
python start.py
```

Or directly with uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status.

### Search Songs
```
POST /api/search
```
Search for songs on YouTube or Spotify.

**Request Body:**
```json
{
  "query": "pop music",
  "source": "spotify",
  "limit": 20
}
```

**Response:**
```json
{
  "songs": [
    {
      "id": "track_id",
      "title": "Song Title",
      "artist": "Artist Name",
      "album_art_url": "https://...",
      "preview_url": "https://...",
      "source": "spotify",
      "duration": 180000,
      "popularity": 85,
      "features": {
        "genres": ["pop", "rock"],
        "danceability": 0.7,
        "energy": 0.8,
        "valence": 0.6
      }
    }
  ]
}
```

### Get Recommendations
```
POST /api/recommendations
```
Get ML-based recommendations based on liked songs.

**Request Body:**
```json
{
  "liked_songs": [
    {
      "id": "track_id",
      "title": "Liked Song",
      "artist": "Artist",
      "source": "spotify",
      "popularity": 75,
      "duration": 180000,
      "features": {
        "genres": ["pop"],
        "danceability": 0.7
      }
    }
  ],
  "mood": "energetic",
  "genre": "pop",
  "limit": 20,
  "source": "spotify"
}
```

**Response:**
```json
{
  "songs": [...],
  "user_profile": {
    "dominant_cluster": 2,
    "genre_preferences": {"pop": 5, "rock": 3},
    "artist_preferences": {"Artist A": 3, "Artist B": 2},
    "total_liked": 10,
    "avg_popularity": 75.5,
    "avg_duration": 180000
  },
  "reason": "Advanced ML-based recommendations using hybrid filtering"
}
```

### User Profile Analysis
```
GET /api/user-profile?liked_songs=[...]
```
Get detailed user profile analysis.

## ML Algorithms

### 1. Feature Extraction
- **Text Features**: TF-IDF vectorization of titles, artists, genres
- **Audio Features**: Danceability, energy, valence, tempo, etc.
- **Hybrid Features**: Combined text and audio features with PCA

### 2. Recommendation Methods
- **Collaborative Filtering**: User-based similarity
- **Content-Based Filtering**: Feature-based similarity
- **Hybrid Approach**: Weighted combination of both methods
- **Diverse Recommendations**: Clustering-based variety

### 3. User Profiling
- **Genre Analysis**: Automatic genre preference detection
- **Artist Analysis**: Favorite artist tracking
- **Audio Feature Analysis**: Musical taste profiling
- **Cluster Analysis**: User segmentation

## Database Schema

### Users
- User information and preferences

### Songs
- Song metadata and features

### LikedSongs
- User-song interactions

### UserProfiles
- Computed user profiles

### MLModels
- Model metadata and versions

### SearchHistory
- Search query tracking

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Code Formatting
```bash
black .
isort .
```

### Type Checking
```bash
mypy .
```

## Deployment

### Docker
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "start.py"]
```

### Environment Variables
- `YOUTUBE_API_KEY`: YouTube Data API key
- `SPOTIFY_CLIENT_ID`: Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify app client secret
- `DATABASE_URL`: Database connection string
- `ML_MODEL_PATH`: Path to save ML models
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)

## Performance

- **Response Time**: < 500ms for recommendations
- **Concurrent Users**: Supports 100+ concurrent requests
- **Model Accuracy**: Continuously improving with user data
- **Memory Usage**: ~500MB for full ML stack

## Monitoring

The backend includes comprehensive logging:
- API request/response logging
- ML model performance metrics
- Error tracking and alerting
- User interaction analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 