# Spotify Integration Setup Guide

This guide will help you set up the Spotify integration features in TuneTrace.

## Prerequisites

1. A Spotify account
2. Node.js and npm installed
3. The TuneTrace project set up

## Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App name**: TuneTrace (or any name you prefer)
   - **App description**: Music discovery app with swipe interface
   - **Website**: `http://localhost:9002` (for development)
   - **Redirect URI**: `http://localhost:9002/api/spotify/callback`
5. Click "Save"
6. Note down your **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# YouTube API Configuration (existing)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Spotify API Configuration (new)
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:9002/api/spotify/callback

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

Replace `your_spotify_client_id_here` and `your_spotify_client_secret_here` with the values from your Spotify app.

## Step 3: Features Available

Once configured, you'll have access to:

### 1. Spotify Track Search
- Search for songs, artists, or albums directly from Spotify
- View track details including duration, album, and popularity
- Access to Spotify's vast music library

### 2. Spotify Recommendations
- Get personalized recommendations based on your liked songs
- Uses Spotify's recommendation algorithm for better suggestions
- Combines with existing YouTube recommendations

### 3. Spotify Playlist Creation
- Create Spotify playlists with your liked songs
- Automatic playlist creation with custom names
- Direct integration with your Spotify account

### 4. Dual Source Support
- Choose between YouTube Music and Spotify as your music source
- Seamless switching between platforms
- Enhanced music discovery experience

## Step 4: Usage

1. **Connect Spotify Account**: Click "Connect Spotify Account" in the app
2. **Choose Music Source**: Select between YouTube or Spotify when searching
3. **Search and Discover**: Use the search functionality to find tracks
4. **Create Playlists**: Create Spotify playlists with your liked songs
5. **Enjoy**: Swipe through tracks from both platforms!

## Troubleshooting

### Common Issues

1. **"Failed to connect to Spotify"**
   - Check your Client ID and Client Secret
   - Ensure redirect URI matches exactly
   - Verify your Spotify app is properly configured

2. **"No Spotify access token found"**
   - Try reconnecting your Spotify account
   - Clear browser cookies and try again
   - Check if the OAuth flow completed successfully

3. **"Failed to create playlist"**
   - Ensure you're connected to Spotify
   - Check that you have liked some Spotify tracks
   - Verify your Spotify account has playlist creation permissions

### Development Notes

- The app uses HTTP-only cookies for secure token storage
- Spotify tokens are automatically refreshed when needed
- All API calls are made server-side for security
- The integration supports both development and production environments

## Security Considerations

- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive data
- The app uses secure OAuth 2.0 flow for Spotify authentication
- Access tokens are stored securely in HTTP-only cookies

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your environment variables are set correctly
3. Ensure your Spotify app is properly configured
4. Check the network tab for API call failures

Happy music discovering! 🎵 