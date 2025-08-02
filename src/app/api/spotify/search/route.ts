import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyTracks } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const tracks = await searchSpotifyTracks(query, limit);
    
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error in Spotify search API:', error);
    return NextResponse.json(
      { error: 'Failed to search Spotify tracks' },
      { status: 500 }
    );
  }
} 