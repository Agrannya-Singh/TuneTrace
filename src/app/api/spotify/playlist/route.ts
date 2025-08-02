import { NextRequest, NextResponse } from 'next/server';
import { createSpotifyPlaylist } from '@/lib/spotify';

export async function POST(req: NextRequest) {
  try {
    const { name, description, trackUris } = await req.json();
    
    // Get access token from cookies
    const accessToken = req.cookies.get('spotify_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No Spotify access token found. Please connect your Spotify account first.' },
        { status: 401 }
      );
    }

    if (!name || !trackUris || !Array.isArray(trackUris)) {
      return NextResponse.json(
        { error: 'Name and trackUris array are required' },
        { status: 400 }
      );
    }

    const playlistId = await createSpotifyPlaylist(
      accessToken,
      name,
      description || 'Created with TuneTrace',
      trackUris
    );

    if (!playlistId) {
      return NextResponse.json(
        { error: 'Failed to create Spotify playlist' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      playlistId,
      message: 'Playlist created successfully!' 
    });
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    return NextResponse.json(
      { error: 'Failed to create Spotify playlist' },
      { status: 500 }
    );
  }
} 