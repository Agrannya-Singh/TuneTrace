// Mocks for Spotify API
// In a real application, this would be replaced with actual API calls to Spotify.
'use server';

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
}

const getApi = async (path: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/${path}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    return res.json();
}

export const importLikedSongs = async (): Promise<string[]> => {
  console.log('Importing liked songs from Spotify...');
  const { items } = await getApi('me/tracks?limit=50');
  const trackIds = items.map((item: any) => item.track.id);
  console.log('Liked songs imported:', trackIds);
  return trackIds;
};

export const getSongDetails = async (songIds: string[]): Promise<Song[]> => {
  console.log('Fetching details for songs:', songIds);
  const { tracks } = await getApi(`tracks?ids=${songIds.join(',')}`);

  return tracks.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a:any) => a.name).join(', '),
      albumArtUrl: track.album.images[0]?.url || 'https://placehold.co/600x600.png',
  }));
};

let addedSongs: string[] = [];
export const addToPlaylist = async (songId: string): Promise<void> => {
  addedSongs.push(songId);
  console.log(`Adding ${songId} to playlist...`);
  // In a real app, we might create a playlist and add songs to it.
  // For this demo, we'll just log it.
  console.log('Current playlist:', addedSongs);
};
