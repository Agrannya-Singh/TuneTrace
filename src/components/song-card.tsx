'use client';

import type { Song } from '@/lib/spotify';
import Image from 'next/image';
import { Youtube } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isActive: boolean;
}

/**
 * Displays a music track card with album art, title, and artist.
 * The card is interactive, opening the song's preview URL in a new tab.
 * This version corrects text truncation issues for long titles and artist names.
 *
 * @param {SongCardProps} props The component props.
 * @returns {React.ReactElement} The rendered SongCard component.
 */
export function SongCard({ song, isActive }: SongCardProps) {
  const openPreview = () => {
    // Check for song.previewUrl to prevent errors
    if (song.previewUrl) {
      window.open(song.previewUrl.replace('embed/', 'watch?v='), '_blank');
    }
  };

  const FALLBACK_IMAGE_URL = 'https://placehold.co/600x600/1e293b/ffffff?text=No+Art';

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Clickable Image Area */}
      <div
        role="button"
        tabIndex={0}
        onClick={openPreview}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openPreview()}
        className="relative w-full h-4/5 group rounded-t-xl overflow-hidden shadow-lg bg-neutral-800 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Image
          src={song.albumArtUrl || FALLBACK_IMAGE_URL}
          alt={`Album art for ${song.title} by ${song.artist}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={isActive}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE_URL; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 rounded-full p-4">
            <Youtube className="h-16 w-16 text-white" />
          </div>
        </div>
      </div>

      {/* Text Area with CSS Fix */}
      <div className="w-full flex-1 p-4 text-white flex flex-col justify-center items-center bg-neutral-900 rounded-b-xl">
        <h2
          className="w-full text-center text-lg font-bold font-headline truncate"
          title={song.title}
        >
          {song.title}
        </h2>
        <p
          className="w-full text-center text-sm text-neutral-300 truncate"
          title={song.artist}
        >
          {song.artist}
        </p>
      </div>
    </div>
  );
}
