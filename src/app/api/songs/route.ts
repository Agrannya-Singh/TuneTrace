'use server';

import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/spotify';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

// A simple in-memory cache for the access token
let accessTokenCache: { token: string; expires: number } | null = null;

async function getAccessToken() {
  if (accessTokenCache && accessTokenCache.expires > Date.now()) {
    return accessTokenCache.token;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify client ID or secret is not set in .env file');
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-cache',
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Spotify Token API responded with ${res.status}`, errorBody);
    throw new Error('Failed to fetch access token from Spotify');
  }

  const data = await res.json();
  const token = data.access_token;
  const expiresIn = data.expires_in; // Typically 3600 seconds

  // Cache the token, setting expiry to 5 minutes before it actually expires
  accessTokenCache = {
    token: token,
    expires: Date.now() + (expiresIn - 300) * 1000,
  };

  return token;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getAccessToken();
    const playlistId = '37i9dQZEVXbMDoHDwVN2tF'; // Spotify's Global Top 50 Playlist ID
    const url = `${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?limit=50&fields=items(track(id,name,artists(name),album(images),preview_url))`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
    });

    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Spotify Playlist API responded with ${res.status}`, errorBody);
        throw new Error(`Spotify Playlist API responded with ${res.status}`);
    }

    const data = await res.json();

    const songs: Song[] = data.items
      .map((item: any) => {
        if (!item.track || !item.track.id || !item.track.album.images.length) {
          return null;
        }
        return {
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists.map((a: any) => a.name).join(', '),
          albumArtUrl: item.track.album.images[0].url,
          previewUrl: item.track.preview_url,
        };
      })
      .filter((song: Song | null): song is Song => song !== null && !!song.previewUrl); // Only include songs with a preview URL

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from Spotify:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from Spotify. Reason: ${errorMessage}` }), { status: 502 });
  }
}
