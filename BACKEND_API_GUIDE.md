# TuneTrace API: Frontend Integration Guide

This guide provides frontend developers with the information needed to integrate with the TuneTrace backend API.

## 1. Core Concepts

- **`user_id`**: A mandatory string that uniquely identifies a user. This can be an email address or any other unique identifier obtained from your authentication provider (e.g., OAuth sub). All API calls related to user data require this identifier.
- **Hybrid Recommendations**: The system generates suggestions using a machine learning model first. If that fails or provides no results, it falls back to a simpler collaborative filtering method, and finally to genre-based recommendations.

## 2. API Endpoints

The base URL for the API should be configured in your frontend application's environment settings.

---

### **POST /suggestions**

This is the primary endpoint for fetching song recommendations for a user.

-   **Method**: `POST`
-   **Description**: Submits a list of songs a user likes and receives a list of new suggestions. The backend will asynchronously process the liked songs, associate them with the user, and use them to generate future recommendations.
-   **Content-Type**: `application/json`

#### Request Body (`LikedSongsRequest`)

```json
{
  "user_id": "user-email@example.com",
  "songs": ["Hotel California", "Bohemian Rhapsody", "Stairway to Heaven"],
  "genre": "Rock"
}
```

-   `user_id` (string, **required**): The unique identifier for the user.
-   `songs` (array of strings, **required**): A list of song titles the user has liked. Must contain at least 1 and at most 50 titles.
-   `genre` (string, *optional*): The genre to use for fallback suggestions if the primary recommendation engine fails.

#### Success Response (200 OK) (`SuggestionResponse`)

The response is a list of suggested songs, each conforming to the `SongSuggestion` model.

```json
{
  "suggestions": [
    {
      "title": "Africa",
      "artist": "Toto",
      "youtube_video_id": "FTQbiN8iSSP"
    },
    {
      "title": "Don't Stop Believin'",
      "artist": "Journey",
      "youtube_video_id": "1k8craCGpgs"
    }
  ]
}
```

-   `title` (string): The title of the suggested song.
-   `artist` (string): The artist or channel associated with the song.
-   `youtube_video_id` (string): The unique YouTube video ID, which can be used to embed the video or link to it (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`).

#### Error Responses

-   **422 Unprocessable Entity**: The request body is invalid (e.g., missing `user_id`, empty `songs` array). The response body will contain details about the validation error.
-   **503 Service Unavailable**: The backend cannot connect to the YouTube API or another critical external service. This is a server-side issue.
-   **500 Internal Server Error**: An unexpected error occurred on the server.

---

### **GET /liked-songs**

Retrieves the history of songs a user has liked.

-   **Method**: `GET`
-   **Description**: Fetches a list of all songs previously liked by a specific user, sorted by the date they were added in descending order.
-   **URL Parameters**:

    -   `user_id` (string, **required**): The unique identifier for the user.

    *Example*: `/liked-songs?user_id=user-email@example.com`

#### Success Response (200 OK) (`List[LikedSongResponse]`)

The response is an array of liked song objects.

```json
[
  {
    "video_id": "9bZkp7q19f0",
    "title": "The Final Countdown",
    "artist": "Europe",
    "created_at": "2023-10-27T10:00:00Z"
  },
  {
    "video_id": "rY0WxgSXdEE",
    "title": "Take on Me",
    "artist": "a-ha",
    "created_at": "2023-10-26T15:30:00Z"
  }
]
```

-   `video_id` (string): The YouTube video ID of the liked song.
-   `title` (string): The song title.
-   `artist` (string): The song artist.
-   `created_at` (string): The ISO 8601 timestamp of when the user liked the song.

#### Error Responses

-   **422 Unprocessable Entity**: The `user_id` parameter is missing or invalid.
-   **500 Internal Server Error**: An unexpected error occurred while fetching the data.

---

### **GET /health**

A simple health check endpoint to verify that the API service is running.

-   **Method**: `GET`
-   **Description**: Can be used to ping the server and confirm its operational status.
-   **Success Response (200 OK)**:

```json
{
  "status": "healthy"
}
```
