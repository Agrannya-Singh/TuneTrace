import { type NextRequest, NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Helper to get a valid access token using client credentials
async function getClientCredentialsToken() {
    // Check if we have a valid token in memory (simple cache)
    if (spotifyApi.getAccessToken() && (spotifyApi as any)._credentials.tokenExpirationNumber > Date.now()) {
        return spotifyApi.getAccessToken();
    }
    
    console.log('Fetching new Spotify client credentials access token...');
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        const accessToken = data.body['access_token'];
        const expiresIn = data.body['expires_in'];
        
        spotifyApi.setAccessToken(accessToken);
        // Set a slightly earlier expiration to be safe
        (spotifyApi as any)._credentials.tokenExpirationNumber = Date.now() + (expiresIn - 300) * 1000;

        console.log('New access token obtained.');
        return accessToken;
    } catch (error) {
        console.error('Could not get client credentials token', error);
        return null;
    }
}


// Route handler
async function handler(req: NextRequest, { params }: { params: { path: string[] }}) {
    const path = params.path.join('/');
    const { searchParams } = new URL(req.url);

    // All paths are treated as proxied API calls using client credentials
    const accessToken = await getClientCredentialsToken();
    if (!accessToken) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Construct the Spotify API URL
    const spotifyUrl = `https://api.spotify.com/v1/${path}?${searchParams.toString()}`;

    try {
        const spotifyResponse = await fetch(spotifyUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!spotifyResponse.ok) {
            const error = await spotifyResponse.json();
            console.error('Spotify API Error:', error);
            return new NextResponse(JSON.stringify(error), { status: spotifyResponse.status });
        }

        const data = await spotifyResponse.json();
        return NextResponse.json(data);
    } catch(error) {
        console.error('Proxy Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
