import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/lastfm';

const { LASTFM_API_KEY } = process.env;
const LASTFM_API_BASE = 'http://ws.audioscrobbler.com/2.0/';

export async function GET(req: NextRequest) {
  if (!LASTFM_API_KEY) {
    console.error('Last.fm API key is not set in .env file');
    return new NextResponse(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
  }

  try {
    const url = `${LASTFM_API_BASE}?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json&limit=50`;
    const res = await fetch(url, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Last.fm API responded with ${res.status}`, errorBody);
      throw new Error(`Last.fm API responded with ${res.status}`);
    }

    const data = await res.json();

    if (data.error) {
      console.error('Last.fm API Error:', data.message);
      throw new Error(data.message);
    }

    const songs: Song[] = data.tracks.track
      .map((item: any) => {
        if (!item.name || !item.artist.name || !item.image || item.image.length < 4) {
          return null;
        }
        return {
          id: item.mbid || `${item.name}-${item.artist.name}`, // Use mbid or create a unique ID
          title: item.name,
          artist: item.artist.name,
          albumArtUrl: item.image[3]['#text'].replace('/300x300/', '/500x500/'), // Get large image
        };
      })
      .filter((song: Song | null): song is Song => song !== null);

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from Last.fm:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch tracks from Last.fm.' }), { status: 502 });
  }
}
