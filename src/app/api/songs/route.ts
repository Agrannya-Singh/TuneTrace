
'use server';

import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/spotify';
import { parse } from 'iso8601-duration';

const { YOUTUBE_API_KEY } = process.env;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Helper function to convert ISO 8601 duration to seconds
function durationToSeconds(duration: string): number {
  try {
    const parsed = parse(duration);
    return (parsed.hours || 0) * 3600 + (parsed.minutes || 0) * 60 + (parsed.seconds || 0);
  } catch (e) {
    return 0;
  }
}

export async function GET(req: NextRequest) {
  if (!YOUTUBE_API_KEY) {
    console.error('YouTube API key is not set in .env file');
    return new NextResponse(
      JSON.stringify({ error: 'Server configuration error: Missing YouTube API key.' }),
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const mood = searchParams.get('mood') || '';
  const genre = searchParams.get('genre') || '';
  
  const query = `${mood} ${genre} music`.trim();

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      chart: 'mostPopular',
      videoCategoryId: '10', // Music
      maxResults: '50',
      regionCode: 'US',
      key: YOUTUBE_API_KEY,
    });
    
    // If the user provided a mood or genre, use it as a query.
    // The 'chart' parameter will then use this as a hint for popular videos matching the query.
    if (query !== 'music') {
        params.set('q', query);
    }

    const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params.toString()}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `YouTube API responded with ${res.status}` }));
      throw new Error(errorData.message || `YouTube API responded with ${res.status}`);
    }
    
    const data = await res.json();
    const initialItems = data.items || [];

    if (!initialItems || initialItems.length === 0) {
      console.error('No items found from YouTube API for query:', query);
      return NextResponse.json([]);
    }

    // Filter out shorts, long videos, and unwanted content
    const songs: Song[] = initialItems
      .filter((item: any) => {
        const title = item.snippet?.title?.toLowerCase() || '';
        const duration = item.contentDetails?.duration;

        if (!duration) return false;

        const seconds = durationToSeconds(duration);

        // Filter out shorts (<= 60s) and long videos (> 15 mins)
        if (seconds <= 60 || seconds > 900) {
          return false;
        }

        // Filter out common non-music keywords
        const disallowedKeywords = ['short', 'shorts', 'commentary', 'reaction', 'live', 'interview', 'full album'];
        if (disallowedKeywords.some(keyword => title.includes(keyword))) {
          return false;
        }

        return true;
      })
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        albumArtUrl: item.snippet.thumbnails.high.url,
        previewUrl: `https://www.youtube.com/embed/${item.id}`,
      }));

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from YouTube:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from YouTube. Reason: ${errorMessage}` }), { status: 502 });
  }
}
