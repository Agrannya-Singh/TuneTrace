# TuneTrace API Documentation

## Overview

TuneTrace consists of two main API layers:
1. **Frontend APIs** (Next.js): Handle Spotify authentication and playlist management
2. **Backend APIs** (Python FastAPI): Handle ML recommendations and music search

## Frontend APIs (Next.js)

### Base URL
```
http://localhost:9002 (development)
https://your-frontend-service.onrender.com (production)
```

### 1. Spotify Authentication

#### GET `/api/spotify/auth`
Get Spotify authorization URL for OAuth flow.

**Response:**
```json
{
  "authUrl": "https://accounts.spotify.com/authorize?client_id=...&response_type=code&redirect_uri=..."
}
```

#### GET `/api/spotify/callback`
Handle Spotify OAuth callback and exchange authorization code for tokens.

**Query Parameters:**
- `code` (string): Authorization code from Spotify
- `state` (string): State parameter for security

**Response:**
```json
{
  "access_token": "BQ...",
  "refresh_token": "AQ...",
  "expires_in": 3600
}
```

### 2. Spotify Search

#### GET `/api/spotify/search`
Search for tracks on Spotify.

**Query Parameters:**
- `q` (string): Search query
- `limit` (number, optional): Number of results (default: 20)

**Response:**
```json
[
  {
    "id": "spotify:track:123456",
    "title": "Song Title",
    "artist": "Artist Name",
    "albumArtUrl": "https://i.scdn.co/image/...",
    "previewUrl": "https://p.scdn.co/mp3-preview/...",
    "source": "spotify",
    "spotifyUri": "spotify:track:123456",
    "duration": 180000,
    "album": "Album Name",
    "popularity": 85
  }
]
```

### 3. Spotify Recommendations

#### GET `/api/spotify/recommendations`
Get Spotify track recommendations based on track IDs.

**Query Parameters:**
- `trackIds` (string): Comma-separated list of Spotify track IDs
- `limit` (number, optional): Number of recommendations (default: 20)

**Response:**
```json
[
  {
    "id": "spotify:track:789012",
    "title": "Recommended Song",
    "artist": "Recommended Artist",
    "albumArtUrl": "https://i.scdn.co/image/...",
    "previewUrl": "https://p.scdn.co/mp3-preview/...",
    "source": "spotify",
    "spotifyUri": "spotify:track:789012",
    "duration": 200000,
    "album": "Recommended Album",
    "popularity": 78
  }
]
```

### 4. Spotify Playlist Creation

#### POST `/api/spotify/playlist`
Create a Spotify playlist with liked songs.

**Request Body:**
```json
{
  "accessToken": "BQ...",
  "playlistName": "My TuneTrace Playlist",
  "likedSongs": [
    {
      "id": "spotify:track:123456",
      "title": "Song Title",
      "artist": "Artist Name",
      "spotifyUri": "spotify:track:123456"
    }
  ]
}
```

**Response:**
```json
{
  "playlistId": "37i9dQZF1DX...",
  "playlistUrl": "https://open.spotify.com/playlist/37i9dQZF1DX...",
  "message": "Playlist created successfully"
}
```

### 5. Deprecated Endpoints

#### GET `/api/songs` (DEPRECATED)
This endpoint is deprecated and returns a 410 Gone status.

**Response:**
```json
{
  "error": "This endpoint is deprecated. Please use the Python backend directly.",
  "message": "The frontend now communicates with the Python ML backend for all song operations."
}
```

## Backend APIs (Python FastAPI)

### Base URL
```
http://localhost:8000 (development)
https://your-backend-service.onrender.com (production)
```

### 1. Health Check

#### GET `/health`
Check if the backend service is healthy.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### 2. Music Search

#### POST `/api/search`
Search for music tracks across multiple sources.

**Request Body:**
```json
{
  "query": "chill indie music",
  "source": "youtube", // "youtube" or "spotify"
  "limit": 20
}
```

**Response:**
```json
{
  "songs": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Song Title",
      "artist": "Artist Name",
      "albumArtUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      "previewUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "source": "youtube",
      "duration": 180000,
      "album": "Album Name",
      "popularity": 85
    }
  ],
  "total": 20,
  "query": "chill indie music",
  "source": "youtube"
}
```

### 3. ML Recommendations

#### POST `/api/recommendations`
Get personalized music recommendations using ML algorithms.

**Request Body:**
```json
{
  "liked_songs": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Liked Song",
      "artist": "Liked Artist",
      "source": "youtube"
    }
  ],
  "limit": 20,
  "source": "youtube" // "youtube" or "spotify"
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "abc123",
      "title": "Recommended Song",
      "artist": "Recommended Artist",
      "albumArtUrl": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "previewUrl": "https://www.youtube.com/embed/abc123",
      "source": "youtube",
      "duration": 200000,
      "album": "Recommended Album",
      "popularity": 78,
      "confidence": 0.85,
      "reason": "Similar to your liked songs"
    }
  ],
  "total": 20,
  "algorithm": "hybrid",
  "user_profile": {
    "preferred_genres": ["indie", "alternative"],
    "preferred_artists": ["Artist A", "Artist B"],
    "audio_features": {
      "danceability": 0.7,
      "energy": 0.6,
      "valence": 0.8
    }
  }
}
```

### 4. User Profile

#### GET `/api/user-profile`
Get the current user's music profile and preferences.

**Response:**
```json
{
  "user_id": "user123",
  "profile": {
    "preferred_genres": ["indie", "alternative", "rock"],
    "preferred_artists": ["Artist A", "Artist B", "Artist C"],
    "audio_features": {
      "danceability": 0.7,
      "energy": 0.6,
      "valence": 0.8,
      "tempo": 120,
      "acousticness": 0.3,
      "instrumentalness": 0.2
    },
    "total_liked_songs": 45,
    "last_activity": "2024-01-15T10:30:00Z"
  },
  "recommendations_history": [
    {
      "timestamp": "2024-01-15T10:25:00Z",
      "algorithm": "hybrid",
      "songs_recommended": 20,
      "songs_liked": 5
    }
  ]
}
```

## Error Responses

All APIs return consistent error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": "Missing required field: query",
  "status_code": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "details": "Invalid or expired access token",
  "status_code": 401
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "details": "No songs found for the given query",
  "status_code": 404
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Failed to connect to external API",
  "status_code": 500
}
```

## Rate Limiting

### Frontend APIs
- **Spotify APIs**: Limited by Spotify's rate limits
- **General APIs**: No specific rate limiting implemented

### Backend APIs
- **Search API**: 100 requests per minute per IP
- **Recommendations API**: 50 requests per minute per IP
- **Health Check**: No rate limiting

## Authentication

### Spotify APIs
Require valid Spotify access tokens obtained through OAuth 2.0 flow.

### Backend APIs
Currently no authentication required. Consider implementing API keys for production.

## CORS Configuration

### Frontend APIs
```javascript
// CORS headers for Spotify APIs
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Backend APIs
```python
# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## Data Models

### Song Object
```typescript
interface Song {
  id: string;                    // Unique identifier
  title: string;                 // Song title
  artist: string;                // Artist name
  albumArtUrl: string;           // Album art URL
  previewUrl: string | null;     // Preview/embed URL
  source: 'youtube' | 'spotify'; // Data source
  spotifyUri?: string;           // Spotify track URI
  duration?: number;             // Duration in milliseconds
  album?: string;                // Album name
  popularity?: number;           // Popularity score (0-100)
}
```

### Recommendation Request
```typescript
interface RecommendationRequest {
  liked_songs: Song[];           // User's liked songs
  limit: number;                 // Number of recommendations
  source: 'youtube' | 'spotify'; // Preferred source
}
```

### Search Request
```typescript
interface SearchRequest {
  query: string;                 // Search query
  source: 'youtube' | 'spotify'; // Preferred source
  limit: number;                 // Number of results
}
```

## Testing

### Using curl

#### Test Health Check
```bash
curl -X GET http://localhost:8000/health
```

#### Test Search API
```bash
curl -X POST http://localhost:8000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "chill music", "source": "youtube", "limit": 5}'
```

#### Test Recommendations API
```bash
curl -X POST http://localhost:8000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{"liked_songs": [{"id": "test123", "title": "Test Song", "artist": "Test Artist", "source": "youtube"}], "limit": 5, "source": "youtube"}'
```

### Using Postman

1. Import the API collection
2. Set up environment variables
3. Test each endpoint with sample data
4. Verify responses match expected schemas

## Versioning

Current API version: `v1`

Future versions will be available at:
- Frontend: `/api/v2/...`
- Backend: `/api/v2/...`

## Support

For API support:
1. Check the health endpoint first
2. Review error responses for details
3. Check logs for debugging information
4. Contact the development team for issues 