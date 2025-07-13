
'use server';
//agrannya singh

import { type NextRequest, NextResponse } from 'next/server';
import type { Song } from '@/lib/spotify';

const { YOUTUBE_API_KEY } = process.env;
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3/search';

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
  
  // Default to most popular chart if no genre or mood is provided
  const useChart = !mood && genre === 'popular music';

  try {
    let finalUrl = '';
    if (useChart) {
      const params = new URLSearchParams({
        part: 'snippet',
        chart: 'mostPopular',
        videoCategoryId: '10', // 10 is the category ID for Music
        maxResults: '50',
        regionCode: 'US',
        key: YOUTUBE_API_KEY,
      });
      finalUrl = `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`;
    } else {
      const query = `${mood} ${genre} official music videos`.trim();
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10',
        maxResults: '50',
        key: YOUTUBE_API_KEY,
      });
      finalUrl = `${YOUTUBE_API_BASE}?${params.toString()}`;
    }
    
    const res = await fetch(finalUrl);

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
        const videoId = useChart ? item.id : item.id.videoId;
        if (!videoId || !item.snippet?.title || !item.snippet?.channelTitle || !item.snippet?.thumbnails?.high?.url) {
          return null;
        }

        return {
          id: videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          albumArtUrl: item.snippet.thumbnails.high.url,
          previewUrl: `https://www.youtube.com/embed/${videoId}`,
        };
      })
      .filter((song: Song | null): song is Song => song !== null);

    return NextResponse.json(songs);

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from YouTube:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from YouTube. Reason: ${errorMessage}` }), { status: 502 });
  }
}
