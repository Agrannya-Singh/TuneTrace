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

/**
 * Handles GET requests to fetch a list of music videos from the YouTube API based on mood, genre, or specific video IDs.
 *
 * Extracts query parameters from the request to determine the search criteria. If `videoIds` are provided, retrieves details for those specific videos. Otherwise, performs a search using the provided mood and genre, or defaults to the most popular music videos. Filters out shorts, long videos, and videos with disallowed keywords. Returns up to 50 randomly shuffled songs in JSON format, each containing video ID, title, artist, album art URL, and a YouTube embed preview URL. Returns an empty array if no suitable videos are found. Responds with an error message and appropriate status code if the YouTube API key is missing or if an error occurs during processing.
 */
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
  const videoIds = searchParams.get('videoIds');
  
  let query = `${mood} ${genre} music`.trim();

  try {
    let videoItems: any[] = [];

    if (videoIds) {
      // Fetch specific videos by ID, as recommended by the microservice
      const params = new URLSearchParams({
        part: 'snippet,contentDetails',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      });
      const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: `YouTube API responded with ${res.status}` }));
        throw new Error(errorData.message || `YouTube API responded with ${res.status}`);
      }
      const data = await res.json();
      videoItems = data.items || [];
    } else {
      // Fetch based on user's mood/genre selection or default to popular
      const params = new URLSearchParams({
        part: 'snippet',
        type: 'video',
        videoCategoryId: '10', // Music
        maxResults: '50', // Fetch more to ensure we have enough after filtering
        key: YOUTUBE_API_KEY,
      });

      if (query !== 'music') {
        params.set('q', query);
      } else {
        params.set('chart', 'mostPopular');
        params.set('regionCode', 'US');
      }
      
      const searchRes = await fetch(`${YOUTUBE_API_BASE}/search?${params.toString()}`);
      if (!searchRes.ok) {
        const errorData = await searchRes.json().catch(() => ({ message: `YouTube API responded with ${searchRes.status}` }));
        throw new Error(errorData.message || `YouTube API responded with ${searchRes.status}`);
      }
      const searchData = await searchRes.json();
      const ids = (searchData.items || []).map((item: any) => item.id.videoId).join(',');

      if (ids) {
        const detailsParams = new URLSearchParams({
          part: 'contentDetails,snippet',
          id: ids,
          key: YOUTUBE_API_KEY,
        });
        const detailsRes = await fetch(`${YOUTUBE_API_BASE}/videos?${detailsParams.toString()}`);
        if (detailsRes.ok) {
          const detailsData = await detailsRes.json();
          videoItems = detailsData.items || [];
        }
      }
    }

    if (videoItems.length === 0) {
      console.error('No items found from YouTube API for query:', query);
      return NextResponse.json([]);
    }

    // Filter out shorts, long videos, and unwanted content
    const songs: Song[] = videoItems
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

    // Shuffle the array to ensure freshness on each request
    const shuffledSongs = songs.sort(() => Math.random() - 0.5);

    // Ensure we return at least 20 songs if we started with a search
    if (!videoIds && shuffledSongs.length < 20 && query !== 'music') {
        // In a real-world scenario, you might make another API call here with a page token
        // For now, we've increased maxResults to minimize this.
    }
    
    // Return up to 50 songs for a broad search, or the recommended songs.
    return NextResponse.json(shuffledSongs.slice(0, 50));

  } catch (error) {
    console.error('[API/Songs] Error fetching tracks from YouTube:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new NextResponse(JSON.stringify({ error: `Failed to fetch tracks from YouTube. Reason: ${errorMessage}` }), { status: 502 });
  }
}
