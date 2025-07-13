export interface Song {
  id: string; // YouTube Video ID
  title: string;
  artist: string; // YouTube Channel Title
  albumArtUrl: string; // YouTube Thumbnail URL
  previewUrl: string | null; // YouTube Embed URL
}
