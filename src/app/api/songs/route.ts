'use server';

import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/spotify';

const { LASTFM_API_KEY } = process.env;
const LASTFM_API_BASE = 'http://ws.audioscrobbler.com/2.0/';

export async function GET(req: NextRequest) {
  if (!LASTFM_API_KEY) {
    console.error('Last.fm API key is not set in .env file');
    return new NextResponse(
      JSON.stringify({ error: 'Server configuration error: Missing Last.fm API key.' }),
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      method: 'chart.gettoptracks',
      api_key: LASTFM_API_KEY,
      format: 'json',
      limit: '50',
    });

    const res = await fetch(`${LASTFM_API_BASE}?${params.toString()}`, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Last.fm API responded with ${res.status}`, errorBody);
      throw new Error(`Last.fm API responded with ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.tracks || !data.tracks.track) {
      console.error('Unexpected response structure from Last.fm API', data);
      throw new Error('Invalid data structure from Last.fm API.');
    }

    const songs: Song[] = data.tracks.track
      .map((track: any) => {
        if (!track.name || !track.artist || !track.artist.name || !track.image) {
          return null;
        }
        // Last.fm provides multiple image sizes, find the large or extra-large one
        const albumArtUrl = track.image.find((img: any) => img.size === 'extralarge')?.['#text'] || 
                              track.image.find((img: any) => img.size === 'large')?.['#text'] ||
                              track.image[0]?.['#text'];

        if (!albumArtUrl) return null;

        return {
          id: track.mbid || `${track.name}-${track.artist.name}`, // Use MBID or create a composite key
          title: track.name,
          artist: track.artist.name,
          albumArtUrl: albumArtUrl,
          previewUrl: null, // Last.fm does not provide preview URLs
        };
      })
      .filter((song: Song | null): song is Song => song !== null);

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from Last.fm:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from Last.fm. Reason: ${errorMessage}` }), { status: 502 });
  }
}
