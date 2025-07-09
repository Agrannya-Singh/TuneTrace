import { type NextRequest, NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';
import { cookies } from 'next/headers';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  // The redirectUri is now handled on the client-side after the initial redirect from Spotify
  redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL}`,
});

const SPOTIFY_TOKEN_COOKIE = 'spotify_token';
const SPOTIFY_STATE_COOKIE = 'spotify_auth_state';

const scopes = [
    'user-read-email',
    'user-library-read',
    'playlist-modify-public',
    'playlist-modify-private',
];

// Helper to get a valid access token
async function getValidAccessToken() {
    const cookieStore = cookies();
    const tokenInfo = cookieStore.get(SPOTIFY_TOKEN_COOKIE);

    if (!tokenInfo) return null;

    const token = JSON.parse(tokenInfo.value);
    spotifyApi.setAccessToken(token.access_token);
    spotifyApi.setRefreshToken(token.refresh_token);

    // Check if the token is expired (or close to expiring)
    if (Date.now() > token.expires_at - 60000) {
        console.log('Refreshing Spotify access token...');
        try {
            const data = await spotifyApi.refreshAccessToken();
            const newAccessToken = data.body['access_token'];
            const newExpiresIn = data.body['expires_in'];
            
            spotifyApi.setAccessToken(newAccessToken);

            const newToken = {
                ...token,
                access_token: newAccessToken,
                expires_at: Date.now() + newExpiresIn * 1000,
            };

            cookieStore.set(SPOTIFY_TOKEN_COOKIE, JSON.stringify(newToken), {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return newAccessToken;
        } catch (error) {
            console.error('Could not refresh access token', error);
            // Clear the bad cookie
            cookieStore.delete(SPOTIFY_TOKEN_COOKIE);
            return null;
        }
    }

    return token.access_token;
}

// Route handler
async function handler(req: NextRequest, { params }: { params: { path: string[] }}) {
    const path = params.path.join('/');
    const { searchParams } = new URL(req.url);

    if (path === 'login') {
        const state = Math.random().toString(36).substring(7);
        const cookieStore = cookies();
        cookieStore.set(SPOTIFY_STATE_COOKIE, state, {
            httpOnly: true,
            maxAge: 300, // 5 minutes
            path: '/',
        });
        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
        return NextResponse.redirect(authorizeURL);
    }
    
    if (path === 'token') {
        const cookieStore = cookies();
        const storedState = cookieStore.get(SPOTIFY_STATE_COOKIE)?.value;
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        cookieStore.delete(SPOTIFY_STATE_COOKIE);

        if (state === null || state !== storedState) {
            return new NextResponse('State mismatch error', { status: 400 });
        }
        
        try {
            const data = await spotifyApi.authorizationCodeGrant(code!);
            const { access_token, refresh_token, expires_in } = data.body;
            
            const tokenInfo = {
                access_token,
                refresh_token,
                expires_at: Date.now() + expires_in * 1000,
            }

            cookieStore.set(SPOTIFY_TOKEN_COOKIE, JSON.stringify(tokenInfo), {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });
            
            return NextResponse.json({ success: true });

        } catch (error) {
            console.error('Error getting Tokens:', error);
            return new NextResponse('Internal Server Error', { status: 500 });
        }
    }

    // All other paths are treated as proxied API calls
    const accessToken = await getValidAccessToken();
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