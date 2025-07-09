import { type NextRequest, NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Helper to get a valid access token using client credentials
async function getClientCredentialsToken() {
    // spotify-web-api-node doesn't expose token expiration, so we manage it manually.
    // @ts-ignore - _credentials is not in the type definition
    if (spotifyApi.getAccessToken() && spotifyApi._credentials.tokenExpirationNumber > Date.now()) {
        return spotifyApi.getAccessToken();
    }
    
    console.log('[API Proxy] No valid token, fetching new Spotify client credentials access token...');
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const accessToken = data.body['access_token'];
        const expiresIn = data.body['expires_in'];
        
        spotifyApi.setAccessToken(accessToken);
        // Set a slightly earlier expiration to be safe (5 minutes earlier)
        // @ts-ignore
        spotifyApi._credentials.tokenExpirationNumber = Date.now() + (expiresIn - 300) * 1000;

        console.log('[API Proxy] New access token obtained.');
        return accessToken;
    } catch (error) {
        console.error('[API Proxy] Could not get client credentials token from Spotify.', error);
        return null;
    }
}


// Route handler
async function handler(req: NextRequest, { params }: { params: { path: string[] }}) {
    const path = params.path.join('/');
    const { searchParams } = new URL(req.url);

    const accessToken = await getClientCredentialsToken();
    if (!accessToken) {
        // If we can't get a token, it's an internal server error.
        // The previous function already logged the detailed error.
        return new NextResponse(JSON.stringify({ error: 'Could not authenticate with Spotify.' }), { status: 500 });
    }
    
    const spotifyUrl = `https://api.spotify.com/v1/${path}?${searchParams.toString()}`;
    console.log(`[API Proxy] Forwarding request to: ${spotifyUrl}`);

    try {
        const spotifyResponse = await fetch(spotifyUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const responseBody = await spotifyResponse.text();

        if (!spotifyResponse.ok) {
            console.error(`[API Proxy] Spotify API Error (${spotifyResponse.status}):`, responseBody);
            return new NextResponse(responseBody, { status: spotifyResponse.status, headers: { 'Content-Type': 'application/json' } });
        }

        return new NextResponse(responseBody, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch(error) {
        console.error('[API Proxy] Internal proxy error:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error while contacting Spotify.' }), { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
