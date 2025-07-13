'use server';

import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/spotify';

const { YOUTUBE_API_KEY } = process.env;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search';

// In-memory cache for API responses to avoid hitting rate limits
const cache = {
  data: null,
  timestamp: 0,
  ttl: 1000 * 60 * 60, // 1 hour
};

export async function GET(req: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key is not set in .env file');
    return new NextResponse(
      JSON.stringify({ error: 'Server configuration error: Missing YouTube API key.' }),
      { status: 500 }
    );
  }

  const now = Date.now();
  if (cache.data && (now - cache.timestamp < cache.ttl)) {
    return NextResponse.json(cache.data);
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: 'Top 50 Global playlist', // A query to get a list of popular music videos
      type: 'video',
      videoCategoryId: '10', // 10 is the category ID for Music
      maxResults: '50',
      key: YOUTUBE_API_KEY,
    });

    const res = await fetch(`${YOUTUBE_API_BASE}?${params.toString()}`);

    if (!res.ok) {
      const errorBody = await res.json();
      console.error(`YouTube API responded with ${res.status}`, errorBody);
      throw new Error(`YouTube API responded with ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.items) {
      console.error('Unexpected response structure from YouTube API', data);
      throw new Error('Invalid data structure from YouTube API.');
    }

    const songs: Song[] = data.items
      .map((item: any) => {
        if (!item.id.videoId || !item.snippet.title || !item.snippet.channelTitle || !item.snippet.thumbnails?.high?.url) {
          return null;
        }

        return {
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          albumArtUrl: item.snippet.thumbnails.high.url,
          previewUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        };
      })
      .filter((song: Song | null): song is Song => song !== null);

    cache.data = songs;
    cache.timestamp = now;

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from YouTube:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from YouTube. Reason: ${errorMessage}` }), { status: 502 });
  }
}
