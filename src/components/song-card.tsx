'use client';

import type { Song } from '@/lib/spotify';
import Image from 'next/image';
import { Youtube } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isActive: boolean;
}

export function SongCard({ song, isActive }: SongCardProps) {
  const openPreview = () => {
    if (song.previewUrl) {
      window.open(song.previewUrl.replace('embed/', 'watch?v='), '_blank');
    }
  }

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-neutral-800 cursor-pointer group"
      onClick={openPreview}
    >
      <Image
        src={song.albumArtUrl || 'https://placehold.co/600x600.png'}
        alt={`${song.title} by ${song.artist}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        data-ai-hint="music video thumbnail"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={isActive}
        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600.png'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/50 rounded-full p-4">
           <Youtube className="h-16 w-16 text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h2 className="text-3xl font-bold font-headline">{song.title}</h2>
        <p className="text-xl text-neutral-300">{song.artist}</p>
      </div>
    </div>
  );
}
