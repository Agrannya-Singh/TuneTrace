'use server';

import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/spotify';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const GLOBAL_TOP_50_PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF';

let cachedToken: { access_token: string; expires_at: number } | null = null;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expires_at) {
    return cachedToken.access_token;
  }

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error('Spotify credentials are not set in .env file');
    throw new Error('Spotify credentials are not configured.');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
            'base64'
          ),
      },
      body: 'grant_type=client_credentials',
      cache: 'no-cache',
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Error fetching Spotify token: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Spotify token request failed with status ${response.status}`);
    }

    const data = await response.json();
    const expires_in = data.expires_in || 3600;
    cachedToken = {
      access_token: data.access_token,
      expires_at: Date.now() + (expires_in - 300) * 1000, // Refresh 5 mins before expiry
    };

    return cachedToken.access_token;
  } catch (error) {
    console.error('Exception while fetching Spotify token:', error);
    // Invalidate cache on error
    cachedToken = null;
    throw error;
  }
}

export async function GET(req: NextRequest) {
    try {
        const accessToken = await getAccessToken();
        const res = await fetch(`${SPOTIFY_API_BASE}/playlists/${GLOBAL_TOP_50_PLAYLIST_ID}/tracks?limit=50&fields=items(track(id,name,artists(name),album(images),preview_url))`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(`Spotify API responded with ${res.status}`, errorBody);
            throw new Error(`Spotify API responded with ${res.status}`);
        }

        const data = await res.json();
        const songs: Song[] = data.items
            .map((item: any) => {
                if (!item.track || !item.track.id || !item.track.album.images.length) return null;
                
                return {
                    id: item.track.id,
                    title: item.track.name,
                    artist: item.track.artists.map((a: any) => a.name).join(', '),
                    albumArtUrl: item.track.album.images[0].url, // First image is usually largest
                    previewUrl: item.track.preview_url,
                }
            })
            .filter((song: Song | null): song is Song => song !== null && !!song.previewUrl); // Only include songs with a preview

        return NextResponse.json(songs);

    } catch (error) {
        console.error('[API/Songs] Error fetching tracks from Spotify:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch tracks from Spotify.' }), { status: 502 });
    }
}
