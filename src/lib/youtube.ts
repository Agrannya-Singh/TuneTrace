import type { Song } from './spotify';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

async function searchYoutube(query: string, pageToken?: string): Promise<any> {
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    videoCategoryId: '10', // Music
    maxResults: '20',
    key: YOUTUBE_API_KEY!,
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const response = await fetch(`${YOUTUBE_API_URL}/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch from YouTube API');
  }
  return response.json();
}

async function getVideos(videoIds: string): Promise<any> {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails',
    id: videoIds,
    key: YOUTUBE_API_KEY!,
  });

  const response = await fetch(`${YOUTUBE_API_URL}/videos?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch from YouTube API');
  }
  return response.json();
}

function transformToSong(item: any): Song {
  const videoId = typeof item.id === 'object' ? item.id.videoId : item.id;
  return {
    id: videoId,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    albumArtUrl: item.snippet.thumbnails.high.url,
    previewUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}

export async function getSongsByQuery(query: string, pageToken?: string): Promise<Song[]> {
  const data = await searchYoutube(query, pageToken);
  return data.items.map(transformToSong);
}

export async function getSongsByIds(videoIds: string): Promise<Song[]> {
  const data = await getVideos(videoIds);
  return data.items.map(transformToSong);
}
