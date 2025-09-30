# TuneTrace Backend API Guide

## Overview

This document provides a comprehensive guide for the backend team on the TuneTrace application architecture, API endpoints, data contracts, and integration points with external services. TuneTrace is a music discovery application that uses YouTube for music content and integrates with an AI-powered recommendation microservice.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [External Service Integration](#external-service-integration)
6. [Authentication Flow](#authentication-flow)
7. [Environment Configuration](#environment-configuration)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend  │ ◄─────► │   Next.js API    │ ◄─────► │  YouTube API    │
│  (Next.js)  │         │     Routes       │         │                 │
└─────────────┘         └──────────────────┘         └─────────────────┘
                                 │
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  AI Microservice │
                        │   (FastAPI)      │
                        └──────────────────┘
                        
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Database/Redis  │
                        │   (Caching)      │
                        └──────────────────┘
```

### Request Flow

1. **Initial Song Discovery**: User selects genre/mood → Frontend → `/api/songs` → YouTube API → Return song list
2. **User Interactions**: User swipes right/left → Liked songs stored in frontend state
3. **AI Recommendations**: When cards run out → Frontend → Microservice `/suggestions` → Return recommended video IDs → `/api/songs` (with videoIds param) → YouTube API
4. **Authentication**: Google OAuth 2.0 via NextAuth.js

---

## Technology Stack

### Frontend & API
- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js v4.24.11
- **Deployment**: Vercel, Render

### Backend Microservice (Python)
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis (sub-200ms latency)
- **Deployment**: Render
- **Base URL**: `https://song-suggest-microservice.onrender.com`

---

## API Endpoints

### 1. `/api/songs` - Song Discovery Endpoint

**Method**: `GET`

**Purpose**: Fetches music videos from YouTube based on user preferences or specific video IDs.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mood` | string | No | Mood filter (e.g., "Chill", "Upbeat", "Energetic") |
| `genre` | string | No | Genre filter (e.g., "Rap", "Pop", "Rock", "Indie") |
| `videoIds` | string | No | Comma-separated YouTube video IDs for specific song retrieval |

#### Request Examples

**Initial Discovery (by genre & mood)**
```http
GET /api/songs?genre=Indie&mood=Chill
```

**Recommended Songs (by video IDs)**
```http
GET /api/songs?videoIds=dQw4w9WgXcQ,9bZkp7q19f0,kJQP7kiw5Fk
```

**Default Top Charts**
```http
GET /api/songs
```

#### Response Format

**Success Response** (200 OK)
```json
[
  {
    "id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "artist": "Official Rick Astley",
    "albumArtUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    "previewUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    "id": "9bZkp7q19f0",
    "title": "PSY - GANGNAM STYLE",
    "artist": "officialpsy",
    "albumArtUrl": "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    "previewUrl": "https://www.youtube.com/embed/9bZkp7q19f0"
  }
]
```

**Error Response** (502 Bad Gateway)
```json
{
  "error": "Failed to fetch tracks from YouTube. Reason: YouTube API responded with 403"
}
```

**Error Response** (500 Internal Server Error)
```json
{
  "error": "Server configuration error: Missing YouTube API key."
}
```

#### Implementation Details

**Filtering Logic**:
- **Duration Filter**: Excludes videos ≤60 seconds (shorts) and >900 seconds (15 minutes)
- **Content Filter**: Removes videos with keywords: "short", "shorts", "commentary", "reaction", "live", "interview", "full album"
- **Category**: Only fetches from YouTube Music category (categoryId: 10)
- **Max Results**: Returns up to 50 songs per request
- **Shuffling**: Results are randomly shuffled for variety

**API Flow**:
```typescript
if (videoIds provided) {
  // Fetch specific videos by ID for recommendations
  YouTube API: videos?id={videoIds}&part=snippet,contentDetails
} else {
  // Search by genre/mood or fetch popular
  if (genre || mood) {
    YouTube API: search?q={query}&videoCategoryId=10&type=video
  } else {
    YouTube API: search?chart=mostPopular&regionCode=US&videoCategoryId=10
  }
  // Get detailed info
  YouTube API: videos?id={ids}&part=contentDetails,snippet
}
```

---

### 2. `/api/log` - Error Logging Endpoint

**Method**: `POST`

**Purpose**: Logs errors from the frontend for monitoring and debugging.

#### Request Body

```json
{
  "error": "Error message or object",
  "context": "getRecommendations"
}
```

#### Request Example

```http
POST /api/log
Content-Type: application/json

{
  "error": "Microservice responded with 503",
  "context": "getRecommendations"
}
```

#### Response Format

**Success Response** (200 OK)
```json
{
  "message": "Error logged successfully."
}
```

**Error Response** (400 Bad Request)
```json
{
  "message": "Missing error or context in request body."
}
```

**Error Response** (500 Internal Server Error)
```json
{
  "message": "Failed to log error.",
  "error": "ENOENT: no such file or directory"
}
```

#### Implementation Details

- Logs are written to `recommendation-errors.log` in the project root
- Log format: `[{timestamp}] Error during "{context}": {error_json}`
- Used for tracking recommendation service failures

---

### 3. `/api/auth/[...nextauth]` - Authentication Endpoint

**Methods**: `GET`, `POST`

**Purpose**: Handles OAuth 2.0 authentication with Google.

**Provider**: NextAuth.js with Google Provider

#### Authentication URLs

| Purpose | URL |
|---------|-----|
| Sign In | `/api/auth/signin` |
| Sign Out | `/api/auth/signout` |
| Callback | `/api/auth/callback/google` |
| Session | `/api/auth/session` |

#### Session Object Structure

```typescript
{
  user: {
    name: string,
    email: string,
    image: string
  },
  accessToken: string,  // Google OAuth access token
  expires: string       // ISO 8601 timestamp
}
```

#### Implementation Details

- **Strategy**: JWT-based session management
- **Access Token**: Persisted in JWT for potential Google API calls
- **Callbacks**: Custom jwt and session callbacks to include access_token
- See `Auth.md` for detailed setup instructions

---

## Data Models

### Song Type Definition

**File**: `src/lib/spotify.ts` (Note: Despite the filename, this is for YouTube)

```typescript
export interface Song {
  id: string;              // YouTube Video ID
  title: string;           // Video title
  artist: string;          // YouTube Channel Title
  albumArtUrl: string;     // YouTube Thumbnail URL (high quality)
  previewUrl: string | null; // YouTube Embed URL
}
```

**Example**:
```typescript
{
  id: "dQw4w9WgXcQ",
  title: "Rick Astley - Never Gonna Give You Up",
  artist: "Official Rick Astley",
  albumArtUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  previewUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
}
```

---

## External Service Integration

### 1. YouTube Data API v3

**Base URL**: `https://www.googleapis.com/youtube/v3`

**Authentication**: API Key (passed as query parameter)

**Required API Scopes**: None (public data)

#### Used Endpoints

**Search Endpoint**
```
GET /search?part=snippet&type=video&videoCategoryId=10&maxResults=50&q={query}&key={API_KEY}
```

**Videos Endpoint**
```
GET /videos?part=snippet,contentDetails&id={videoIds}&key={API_KEY}
```

**Most Popular**
```
GET /search?part=snippet&chart=mostPopular&regionCode=US&videoCategoryId=10&key={API_KEY}
```

#### Rate Limits
- **Quota**: 10,000 units per day (default)
- **Search**: 100 units per request
- **Videos**: 1 unit per request
- **Recommendation**: Monitor usage to stay within limits

#### Error Codes
- `403`: Quota exceeded or invalid API key
- `400`: Invalid request parameters
- `404`: Video not found

---

### 2. AI Recommendation Microservice

**Base URL**: `https://song-suggest-microservice.onrender.com`

**Framework**: FastAPI (Python)

**Authentication**: Bearer token (optional, uses Google OAuth access token)

#### POST `/suggestions` - Get Personalized Recommendations

**Purpose**: Receives liked songs and returns AI-recommended YouTube video IDs.

**Request Headers**
```http
Content-Type: application/json
Authorization: Bearer {access_token}  // Optional: Google OAuth token
```

**Request Body**
```json
{
  "user_id": "user@example.com",
  "songs": [
    "Rick Astley - Never Gonna Give You Up - Official Rick Astley",
    "PSY - GANGNAM STYLE - officialpsy",
    "The Weeknd - Blinding Lights - TheWeekndVEVO"
  ]
}
```

**Response Format** (200 OK)
```json
{
  "suggestions": [
    {
      "youtube_video_id": "kJQP7kiw5Fk",
      "title": "Billie Eilish - bad guy",
      "score": 0.92
    },
    {
      "youtube_video_id": "fHI8X4OXluQ",
      "title": "The Weeknd - Starboy",
      "score": 0.89
    }
  ]
}
```

**Error Response** (503 Service Unavailable)
```json
{
  "detail": "Recommendation service temporarily unavailable"
}
```

**Error Response** (400 Bad Request)
```json
{
  "detail": "Invalid request format: 'songs' field required"
}
```

#### Integration Pattern

**Frontend Flow**:
```typescript
// 1. Collect liked songs
const songTitles = likedSongs.map(s => `${s.title} - ${s.artist}`);

// 2. Send to microservice
const response = await fetch(`${MICROSERVICE_URL}/suggestions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}` // Optional
  },
  body: JSON.stringify({ 
    user_id: user.email, 
    songs: songTitles 
  })
});

// 3. Extract video IDs
const data = await response.json();
const videoIds = data.suggestions.map(s => s.youtube_video_id).join(',');

// 4. Fetch from YouTube via /api/songs
await fetch(`/api/songs?videoIds=${videoIds}`);
```

#### Backend Requirements

**Expected Features**:
- Collaborative filtering + content-based algorithms
- Fallback mechanisms when insufficient data
- Redis caching for sub-200ms latency
- User interaction history persistence
- Scalability: Handle 100+ concurrent users

**Database Schema** (Expected):
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  created_at TIMESTAMP
)

-- User interactions
user_interactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  youtube_video_id VARCHAR,
  action VARCHAR, -- 'like', 'dislike', 'skip'
  timestamp TIMESTAMP
)

-- Song metadata cache
song_cache (
  youtube_video_id VARCHAR PRIMARY KEY,
  title VARCHAR,
  artist VARCHAR,
  genre VARCHAR[],
  features JSONB,
  updated_at TIMESTAMP
)
```

---

## Authentication Flow

### OAuth 2.0 with Google

**Provider**: Google OAuth 2.0
**Library**: NextAuth.js v4

#### Setup Requirements

1. **Google Cloud Console**:
   - Create OAuth 2.0 Client ID
   - Enable Google People API
   - Add authorized redirect URIs:
     - Local: `http://localhost:3000/api/auth/callback/google`
     - Vercel: `https://tune-trace-rubp.vercel.app/api/auth/callback/google`
     - Render: `https://tunetrace.onrender.com/api/auth/callback/google`

2. **Environment Variables**:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=random-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

#### Authentication Flow Diagram

```
┌──────────┐           ┌──────────┐           ┌─────────────┐
│  Client  │           │ NextAuth │           │   Google    │
└────┬─────┘           └────┬─────┘           └──────┬──────┘
     │                      │                        │
     │ 1. signIn("google")  │                        │
     ├─────────────────────►│                        │
     │                      │ 2. Redirect to Google  │
     │                      ├───────────────────────►│
     │                      │                        │
     │                      │    3. User Authorizes  │
     │                      │◄───────────────────────┤
     │                      │                        │
     │  4. JWT + Session    │                        │
     │◄─────────────────────┤                        │
     │                      │                        │
```

#### Session Management

**Frontend Usage**:
```typescript
import { useSession, signIn, signOut } from "next-auth/react";

// In component
const { data: session } = useSession();

if (session) {
  console.log(session.user.email);
  console.log(session.accessToken); // For API calls
}

// Sign in
signIn("google");

// Sign out
signOut();
```

---

## Environment Configuration

### Required Environment Variables

**File**: `.env.local` (create from `env.sample`)

```bash
# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=AIzaSy...
# Note: NEXT_PUBLIC prefix makes it available to client-side

# Google OAuth 2.0
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...

# NextAuth.js
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000  # Change per environment
```

### Environment-Specific URLs

| Environment | NEXTAUTH_URL | Callback URL |
|-------------|--------------|--------------|
| Local | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` |
| Vercel | `https://tune-trace-rubp.vercel.app` | `https://tune-trace-rubp.vercel.app/api/auth/callback/google` |
| Render | `https://tunetrace.onrender.com` | `https://tunetrace.onrender.com/api/auth/callback/google` |

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Error Handling

### Error Response Structure

All API errors follow this structure:

```typescript
{
  error: string;  // Human-readable error message
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful response |
| 400 | Bad Request | Missing or invalid parameters |
| 403 | Forbidden | API key invalid or quota exceeded |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server configuration error |
| 502 | Bad Gateway | External service (YouTube/Microservice) error |
| 503 | Service Unavailable | Microservice temporarily down |

### Frontend Error Handling Pattern

```typescript
try {
  const res = await fetch('/api/songs?mood=Chill');
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ 
      error: 'An unknown error occurred' 
    }));
    throw new Error(errorData.error || `Server responded with ${res.status}`);
  }
  
  const songs = await res.json();
  // Process songs
  
} catch (error) {
  console.error('Error fetching songs:', error);
  
  // Log to backend
  await logRecommendationError(
    error instanceof Error ? error.message : 'Unknown error',
    'fetchSongs'
  );
  
  // Show toast notification
  toast({
    variant: "destructive",
    title: "Error",
    description: error.message
  });
}
```

### Recommendation Service Fallback

When the microservice fails:
1. Error is logged via `/api/log`
2. User sees "out of cards" state
3. Option to restart with new search

**No Degradation**: The app does not fall back to random recommendations to maintain quality.

---

## Performance Considerations

### YouTube API Optimization

**Batch Requests**:
```typescript
// Good: Single request for 50 videos
/videos?id=id1,id2,id3,...,id50

// Bad: 50 individual requests
/videos?id=id1
/videos?id=id2
...
```

**Quota Management**:
- Each `/api/songs` search uses ~101 units (100 for search + 1 for videos)
- Daily quota: 10,000 units = ~99 searches
- Recommendation requests use only 1 unit (direct video fetch)

### Caching Strategies

**Frontend**:
- Liked songs stored in React state (not persisted between sessions)
- Session data cached by NextAuth.js (JWT in cookie)

**Backend Microservice** (Expected):
- Redis cache for song metadata (TTL: 24 hours)
- User preference vectors cached (TTL: 1 hour)
- Database query results cached (sub-200ms latency target)

### Scalability Targets

Based on README achievements:
- **Target**: 100+ concurrent users
- **Database Latency**: Sub-200ms (via SQLAlchemy + Redis)
- **API Response Time**: 40% reduction via caching
- **Uptime**: Production-ready via CI/CD (Render)

---

## CI/CD Pipeline

**Platform**: Jenkins (see `Jenkinsfile`)

**Stages**:
1. Build Docker image
2. Run tests
3. Deploy to Render
4. Health checks

**Deployment Targets**:
- **Frontend**: Vercel (https://tune-trace-rubp.vercel.app)
- **Microservice**: Render (https://song-suggest-microservice.onrender.com)

---

## Key Changes in TuneTrace 2.0

### What Changed

1. **Authentication Added**:
   - Google OAuth 2.0 integration via NextAuth.js
   - User sessions persisted with JWT
   - Access tokens available for microservice calls

2. **AI-Powered Recommendations**:
   - Integration with FastAPI microservice
   - Personalized suggestions based on user likes
   - Hybrid recommendation engine (collaborative + content-based)

3. **Enhanced Data Pipeline**:
   - Redis caching for performance
   - PostgreSQL for user interaction history
   - Improved API response times (40% faster)

4. **Production Readiness**:
   - CI/CD pipeline with Jenkins
   - Docker containerization
   - Scalable architecture (100+ concurrent users)
   - Error logging and monitoring

### Migration Notes

**From Version 1.0**:
- Previously: Simple YouTube search without user accounts
- Now: Authenticated users with personalized recommendations
- API contracts remain backward compatible
- No breaking changes to `/api/songs` endpoint

---

## Testing

### API Testing Examples

**Test 1: Basic Song Fetch**
```bash
curl "http://localhost:3000/api/songs?genre=Indie&mood=Chill"
```

**Test 2: Recommendation Flow**
```bash
# Step 1: Get initial songs
curl "http://localhost:3000/api/songs?genre=Pop"

# Step 2: Simulate likes and get recommendations
curl -X POST "https://song-suggest-microservice.onrender.com/suggestions" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test@example.com",
    "songs": ["Song 1 - Artist 1", "Song 2 - Artist 2"]
  }'

# Step 3: Fetch recommended songs
curl "http://localhost:3000/api/songs?videoIds=abc123,def456"
```

**Test 3: Error Logging**
```bash
curl -X POST "http://localhost:3000/api/log" \
  -H "Content-Type: application/json" \
  -d '{
    "error": "Test error",
    "context": "testing"
  }'
```

### Expected Test Results

- Initial fetch should return 20-50 songs
- Recommendations should return 5-15 songs
- All songs should have duration between 60s and 900s
- No duplicate IDs in response

---

## Contact & Support

**Project Owner**: Agrannya Singh  
**Email**: singh.agrannya@gmail.com  
**Repository**: https://github.com/Agrannya-Singh/TuneTrace  
**Backend Microservice**: https://github.com/Agrannya-Singh/Tune_Trace_backend

---

## Appendix: Quick Reference

### Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/songs` | GET | Fetch music videos |
| `/api/log` | POST | Log errors |
| `/api/auth/*` | GET/POST | Authentication |

### External Services

| Service | URL | Purpose |
|---------|-----|---------|
| YouTube API | `googleapis.com/youtube/v3` | Music videos |
| Microservice | `song-suggest-microservice.onrender.com` | AI recommendations |
| Google OAuth | `accounts.google.com` | User authentication |

### Port Configuration

- **Development**: `localhost:9002` (see `package.json`)
- **Production**: Standard HTTPS (443)

---

**Document Version**: 2.0  
**Last Updated**: July 30, 2025  
**Status**: Production Ready
