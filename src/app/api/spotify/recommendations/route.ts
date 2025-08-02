import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyRecommendations } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackIds = searchParams.get('trackIds');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!trackIds) {
      return NextResponse.json(
        { error: 'Query parameter "trackIds" is required' },
        { status: 400 }
      );
    }

    const trackIdsArray = trackIds.split(',').filter(id => id.trim());
    
    if (trackIdsArray.length === 0) {
      return NextResponse.json(
        { error: 'At least one track ID is required' },
        { status: 400 }
      );
    }

    const recommendations = await getSpotifyRecommendations(trackIdsArray, limit);
    
    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error in Spotify recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to get Spotify recommendations' },
      { status: 500 }
    );
  }
} 