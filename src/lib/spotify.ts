// In a real application, this would be replaced with actual API calls to Spotify.
'use server';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  previewUrl: string | null;
}

const getApi = async (path: string) => {
    // This is a simplified fetch for server-side components using our proxy.
    // We construct the path directly instead of relying on an environment variable.
    const res = await fetch(`/api/spotify/${path}`, {
      cache: 'no-store', // Ensure we get fresh data
    });
    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`[Client] Failed to fetch /api/spotify/${path}: ${res.status}`, errorBody);
        throw new Error(`Failed to fetch ${path}: ${res.status}`);
    }
    return res.json();
}

const GLOBAL_TOP_50_PLAYLIST_ID = '37i9dQZEVXbMDoHDwVN2tF';

export const getGlobalTopSongs = async (): Promise<Song[]> => {
    console.log('[Client] Fetching Global Top 50 from Spotify via proxy...');
    const { items } = await getApi(`playlists/${GLOBAL_TOP_50_PLAYLIST_ID}/tracks?limit=50`);
    
    return items
      .map((item: any) => {
        if (!item.track || !item.track.id) return null;
        return {
            id: item.track.id,
            title: item.track.name,
            artist: item.track.artists.map((a:any) => a.name).join(', '),
            albumArtUrl: item.track.album.images[0]?.url || 'https://placehold.co/600x600.png',
            previewUrl: item.track.preview_url,
        }
      })
      .filter((song: Song | null): song is Song => song !== null && song.previewUrl !== null); // Filter out any null tracks or tracks without a preview
};
