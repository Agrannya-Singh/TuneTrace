import { NextResponse } from 'next/server';
import { getSongsByQuery, getSongsByIds } from '@/lib/youtube';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get('mood') || '';
  const genre = searchParams.get('genre') || '';
  const pageToken = searchParams.get('pageToken') || undefined;
  const videoIds = searchParams.get('videoIds');

  try {
    if (videoIds) {
      const songs = await getSongsByIds(videoIds);
      return NextResponse.json(songs);
    }

    let query = 'top trending music';
    if (mood || genre) {
      query = `${mood} ${genre} music`;
    }

    const songs = await getSongsByQuery(query, pageToken);
    return NextResponse.json(songs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}
