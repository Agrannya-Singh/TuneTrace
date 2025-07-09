// This file is no longer used, but kept for reference if needed.
// The primary song interface is now in /src/lib/lastfm.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArtUrl: string;
  previewUrl: string | null;
}
