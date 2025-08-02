import SpotifyWebApi from 'spotify-web-api-node';

export interface Song {
  id: string; // YouTube Video ID or Spotify Track ID
  title: string;
  artist: string; // YouTube Channel Title or Spotify Artist
  albumArtUrl: string; // YouTube Thumbnail URL or Spotify Album Art
  previewUrl: string | null; // YouTube Embed URL or Spotify Preview URL
  source: 'youtube' | 'spotify'; // Track the source of the song
  spotifyUri?: string; // Spotify track URI for playlist creation
  duration?: number; // Duration in milliseconds
  album?: string; // Album name
  popularity?: number; // Spotify popularity score
}

// Spotify API configuration
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:9002/api/spotify/callback',
});

// Get Spotify access token
export async function getSpotifyAccessToken(): Promise<string | null> {
  try {
    const clientCredentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${clientCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get Spotify access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    return null;
  }
}

// Search Spotify tracks
export async function searchSpotifyTracks(query: string, limit: number = 20): Promise<Song[]> {
  try {
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      throw new Error('No Spotify access token available');
    }

    spotifyApi.setAccessToken(accessToken);
    
    const response = await spotifyApi.searchTracks(query, {
      limit,
      market: 'US',
    });

    return response.body.tracks?.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      albumArtUrl: track.album.images[0]?.url || '',
      previewUrl: track.preview_url,
      source: 'spotify' as const,
      spotifyUri: track.uri,
      duration: track.duration_ms,
      album: track.album.name,
      popularity: track.popularity,
    })) || [];
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    return [];
  }
}

// Get user's top tracks (requires user authentication)
export async function getUserTopTracks(accessToken: string, limit: number = 20): Promise<Song[]> {
  try {
    spotifyApi.setAccessToken(accessToken);
    
    const response = await spotifyApi.getMyTopTracks({
      limit,
      time_range: 'short_term', // 4 weeks
    });

    return response.body.items.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      albumArtUrl: track.album.images[0]?.url || '',
      previewUrl: track.preview_url,
      source: 'spotify' as const,
      spotifyUri: track.uri,
      duration: track.duration_ms,
      album: track.album.name,
      popularity: track.popularity,
    }));
  } catch (error) {
    console.error('Error getting user top tracks:', error);
    return [];
  }
}

// Get recommendations based on track IDs
export async function getSpotifyRecommendations(
  trackIds: string[], 
  limit: number = 20
): Promise<Song[]> {
  try {
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
      throw new Error('No Spotify access token available');
    }

    spotifyApi.setAccessToken(accessToken);
    
    const response = await spotifyApi.getRecommendations({
      seed_tracks: trackIds.slice(0, 5), // Spotify allows max 5 seed tracks
      limit,
      market: 'US',
    });

    return response.body.tracks.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      albumArtUrl: track.album.images[0]?.url || '',
      previewUrl: track.preview_url,
      source: 'spotify' as const,
      spotifyUri: track.uri,
      duration: track.duration_ms,
      album: track.album.name,
      popularity: track.popularity,
    }));
  } catch (error) {
    console.error('Error getting Spotify recommendations:', error);
    return [];
  }
}

// Create a Spotify playlist
export async function createSpotifyPlaylist(
  accessToken: string,
  name: string,
  description: string,
  trackUris: string[]
): Promise<string | null> {
  try {
    spotifyApi.setAccessToken(accessToken);
    
    // Get current user
    const userResponse = await spotifyApi.getMe();
    const userId = userResponse.body.id;
    
    // Create playlist
    const playlistResponse = await spotifyApi.createPlaylist(userId, {
      name,
      description,
      public: false,
    });
    
    const playlistId = playlistResponse.body.id;
    
    // Add tracks to playlist
    if (trackUris.length > 0) {
      await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    }
    
    return playlistId;
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    return null;
  }
}

// Get Spotify authorization URL
export function getSpotifyAuthUrl(): string {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-modify-private',
    'playlist-modify-public',
  ];
  
  const state = Math.random().toString(36).substring(7);
  
  return spotifyApi.createAuthorizeURL(scopes, state);
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
} | null> {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:9002/api/spotify/callback',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
}

export { spotifyApi };
