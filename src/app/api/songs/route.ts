import { type NextRequest, NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';
import type { Song } from '@/lib/spotify';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// A simple in-memory cache for the access token
let tokenCache = {
  accessToken: null as string | null,
  expirationTime: 0,
};

async function getClientCredentialsToken() {
    if (tokenCache.accessToken && tokenCache.expirationTime > Date.now()) {
        spotifyApi.setAccessToken(tokenCache.accessToken);
        return tokenCache.accessToken;
    }
    
    console.log('[API/Songs] No valid token, fetching new Spotify client credentials access token...');
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const accessToken = data.body['access_token'];
        const expiresIn = data.body['expires_in'];
        
        spotifyApi.setAccessToken(accessToken);
        // Set expiration to 5 minutes before it actually expires to be safe
        tokenCache.expirationTime = Date.now() + (expiresIn - 300) * 1000;
        tokenCache.accessToken = accessToken;

        console.log('[API/Songs] New access token obtained.');
        return accessToken;
    } catch (error) {
        console.error('[API/Songs] Could not get client credentials token from Spotify.', error);
        tokenCache.accessToken = null;
        tokenCache.expirationTime = 0;
        return null;
    }
}

const GLOBAL_TOP_50_PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF';

export async function GET(req: NextRequest) {
    const token = await getClientCredentialsToken();
    if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Could not authenticate with Spotify.' }), { status: 500 });
    }

    try {
        const data = await spotifyApi.getPlaylistTracks(GLOBAL_TOP_50_PLAYLIST_ID, { limit: 50 });
        const songs: Song[] = data.body.items
            .map((item: any) => {
                if (!item.track || !item.track.id || !item.track.preview_url) return null;
                return {
                    id: item.track.id,
                    title: item.track.name,
                    artist: item.track.artists.map((a:any) => a.name).join(', '),
                    albumArtUrl: item.track.album.images[0]?.url || 'https://placehold.co/600x600.png',
                    previewUrl: item.track.preview_url,
                }
            })
            .filter((song: Song | null): song is Song => song !== null);

        return NextResponse.json(songs);

    } catch (error) {
        console.error('[API/Songs] Error fetching playlist from Spotify:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch playlist from Spotify.' }), { status: 502 });
    }
}
