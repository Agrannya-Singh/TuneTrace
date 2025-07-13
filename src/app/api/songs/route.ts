
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
  const genre = searchParams.get('genre') || 'popular music';
  
  const useChart = !mood && genre === 'popular music';

  try {
    let initialItems: any[] = [];

    if (useChart) {
      const params = new URLSearchParams({
        part: 'snippet,contentDetails', // Fetch contentDetails for duration
        chart: 'mostPopular',
        videoCategoryId: '10', // Music
        maxResults: '50',
        regionCode: 'US',
        key: YOUTUBE_API_KEY,
      });
      const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params.toString()}`);
      if (!res.ok) throw new Error(`YouTube API responded with ${res.status}`);
      const data = await res.json();
      initialItems = data.items || [];

    } else {
      const query = `${mood} ${genre} official music video`.trim();
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10',
        maxResults: '50',
        key: YOUTUBE_API_KEY,
      });
      const searchRes = await fetch(`${YOUTUBE_API_BASE}/search?${params.toString()}`);
      if (!searchRes.ok) throw new Error(`YouTube API responded with ${searchRes.status}`);
      const searchData = await searchRes.json();
      
      const searchItems = searchData.items || [];
      const ids = searchItems.map((item: any) => item.id.videoId).join(',');

      if (!ids) {
        return NextResponse.json([]);
      }

      // Fetch video details for the search results to get duration
      const videoParams = new URLSearchParams({
        part: 'snippet,contentDetails',
        id: ids,
        key: YOUTUBE_API_KEY,
      });
      const videoRes = await fetch(`${YOUTUBE_API_BASE}/videos?${videoParams.toString()}`);
      if (!videoRes.ok) throw new Error(`YouTube API responded with ${videoRes.status}`);
      const videoData = await videoRes.json();
      initialItems = videoData.items || [];
    }

    if (!initialItems || initialItems.length === 0) {
      console.error('No items found from YouTube API');
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
        const disallowedKeywords = ['short', 'shorts', 'commentary', 'reaction', 'live', 'interview'];
        if (disallowedKeywords.some(keyword => title.includes(keyword))) {
          return false;
        }

        return true;
      })
      .map((item: any) => {
        const videoId = typeof item.id === 'string' ? item.id : item.id.videoId;
        return {
          id: videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          albumArtUrl: item.snippet.thumbnails.high.url,
          previewUrl: `https://www.youtube.com/embed/${videoId}`,
        };
      });

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from YouTube:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from YouTube. Reason: ${errorMessage}` }), { status: 502 });
  }
}
