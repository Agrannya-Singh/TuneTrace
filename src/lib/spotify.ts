// Mocks for Spotify API
// In a real application, this would be replaced with actual API calls to Spotify.
'use server';
import { cookies } from 'next/headers';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
}

const getApi = async (path: string) => {
    // This is a hack to pass cookies to the server-side fetch call
    // In a real app, you would have a more robust way of handling authentication
    const cookieHeader = cookies().toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/${path}`, {
        headers: {
            'Cookie': cookieHeader,
        }
    });
    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Failed to fetch ${path}: ${res.status}`, errorBody);
        throw new Error(`Failed to fetch ${path}: ${res.status}`);
    }
    return res.json();
}

const postApi = async (path: string, body: any) => {
    const cookieHeader = cookies().toString();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Failed to POST to ${path}: ${res.status}`, errorBody);
        throw new Error(`Failed to POST to ${path}: ${res.status}`);
    }
    return res.json();
};

export const importLikedSongs = async (): Promise<string[]> => {
  console.log('Importing liked songs from Spotify...');
  const { items } = await getApi('me/tracks?limit=50');
  const trackIds = items.map((item: any) => item.track.id);
  console.log('Liked songs imported:', trackIds.length);
  return trackIds;
};

export const getSongDetails = async (songIds: string[]): Promise<Song[]> => {
  if (songIds.length === 0) return [];
  console.log('Fetching details for songs:', songIds);
  const { tracks } = await getApi(`tracks?ids=${songIds.join(',')}`);

  return tracks.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a:any) => a.name).join(', '),
      albumArtUrl: track.album.images[0]?.url || 'https://placehold.co/600x600.png',
  })).filter(Boolean); // Filter out any null tracks if API returns them
};

let tuneSwipePlaylistId: string | null = null;
const PLAYLIST_NAME = 'TuneSwipe Discoveries';

const findOrCreatePlaylist = async (): Promise<string> => {
    if (tuneSwipePlaylistId) return tuneSwipePlaylistId;

    const { id: userId } = await getApi('me');
    
    // Check if playlist already exists
    let playlists = await getApi(`users/${userId}/playlists?limit=50`);
    let playlist = playlists.items.find((p: any) => p.name === PLAYLIST_NAME);

    if (playlist) {
        tuneSwipePlaylistId = playlist.id;
        return tuneSwipePlaylistId!;
    }

    // Create a new playlist
    const newPlaylist = await postApi(`users/${userId}/playlists`, {
        name: PLAYLIST_NAME,
        description: 'Songs you liked on TuneSwipe. Created by TuneSwipe.',
        public: false,
    });
    
    tuneSwipePlaylistId = newPlaylist.id;
    return tuneSwipePlaylistId!;
};

export const addToPlaylist = async (songId: string): Promise<void> => {
  try {
    const playlistId = await findOrCreatePlaylist();
    const spotifyUri = `spotify:track:${songId}`;
    await postApi(`playlists/${playlistId}/tracks`, {
      uris: [spotifyUri],
    });
    console.log(`Added ${songId} to playlist ${PLAYLIST_NAME}.`);
  } catch (error) {
    console.error('Failed to add song to playlist:', error);
    // We can choose to throw or handle this gracefully.
    // For now, we'll just log the error and not disrupt the user flow.
  }
};


export const getSpotifyRecommendations = async (params: { seed_tracks: string[], limit: number}) => {
    const { seed_tracks, limit } = params;
    if (seed_tracks.length === 0) return { tracks: [] };
    const queryParams = new URLSearchParams({
        seed_tracks: seed_tracks.join(','),
        limit: limit.toString(),
    });
    console.log(`Fetching spotify recommendations with seeds: ${seed_tracks.join(',')}`);
    return getApi(`recommendations?${queryParams.toString()}`);
}
