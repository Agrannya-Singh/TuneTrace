import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/lastfm';

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const API_URL = 'https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=' + LASTFM_API_KEY + '&format=json&limit=50';


export async function GET(req: NextRequest) {
    if (!LASTFM_API_KEY) {
        return new NextResponse(JSON.stringify({ error: 'Last.fm API key not configured.' }), { status: 500 });
    }

    try {
        const res = await fetch(API_URL, {
            headers: {
                'User-Agent': 'TuneTrace/1.0'
            }
        });

        if (!res.ok) {
            throw new Error(`Last.fm API responded with ${res.status}`);
        }

        const data = await res.json();
        
        const songs: Song[] = data.tracks.track
            .map((item: any) => {
                if (!item.name || !item.artist || !item.image) return null;
                const albumArt = item.image.find((i: any) => i.size === 'extralarge');
                return {
                    id: item.mbid || `${item.name}-${item.artist.name}`, // Use mbid or create a fallback id
                    title: item.name,
                    artist: item.artist.name,
                    albumArtUrl: albumArt['#text'] || 'https://placehold.co/600x600.png',
                }
            })
            .filter((song: Song | null): song is Song => song !== null);

        return NextResponse.json(songs);

    } catch (error) {
        console.error('[API/Songs] Error fetching tracks from Last.fm:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch tracks from Last.fm.' }), { status: 502 });
    }
}
