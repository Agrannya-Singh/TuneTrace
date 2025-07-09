// Mocks for Spotify API
// In a real application, this would be replaced with actual API calls to Spotify.

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
}

const mockSongsData: Song[] = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '2', title: 'As It Was', artist: 'Harry Styles', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '3', title: 'Levitating', artist: 'Dua Lipa', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '5', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '6', title: 'Save Your Tears', artist: 'The Weeknd', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '7', title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '8', title: 'Heat Waves', artist: 'Glass Animals', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '9', title: 'Shivers', artist: 'Ed Sheeran', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '10', title: 'Peaches', artist: 'Justin Bieber, Daniel Caesar, Giveon', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '11', title: 'Anti-Hero', artist: 'Taylor Swift', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '12', title: 'Bad Habit', artist: 'Steve Lacy', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '13', title: 'Flowers', artist: 'Miley Cyrus', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '14', title: 'Kill Bill', artist: 'SZA', albumArtUrl: 'https://placehold.co/600x600.png' },
  { id: '15', title: 'Creepin\'', artist: 'Metro Boomin, The Weeknd, 21 Savage', albumArtUrl: 'https://placehold.co/600x600.png' },
];

export const importLikedSongs = async (): Promise<string[]> => {
  console.log('Importing liked songs from Spotify...');
  await new Promise(resolve => setTimeout(resolve, 1500));
  const likedSongs = mockSongsData.slice(0, 5).map(song => song.id);
  console.log('Liked songs imported:', likedSongs);
  return likedSongs;
};

export const getSongDetails = async (songIds: string[]): Promise<Song[]> => {
  console.log('Fetching details for songs:', songIds);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // to make it more dynamic, let's add some more songs to the mock list if needed
  songIds.forEach(id => {
    if (!mockSongsData.some(s => s.id === id)) {
      mockSongsData.push({
        id,
        title: `Vibey Tune ${id}`,
        artist: `DJ AI ${id}`,
        albumArtUrl: `https://placehold.co/600x600.png`
      });
    }
  });

  return songIds.map(id => mockSongsData.find(s => s.id === id)!);
};

export const addToPlaylist = async (songId: string): Promise<void> => {
  const song = mockSongsData.find(s => s.id === songId);
  console.log(`Adding ${song?.title || songId} to playlist...`);
  await new Promise(resolve => setTimeout(resolve, 750));
  console.log('Song added to playlist.');
};
