'use client';

import type { Song } from '@/lib/lastfm';
import Image from 'next/image';

interface SongCardProps {
  song: Song;
}

export function SongCard({ song }: SongCardProps) {

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-neutral-800"
    >
      <Image
        src={song.albumArtUrl}
        alt={`${song.title} by ${song.artist}`}
        fill
        className="object-cover"
        data-ai-hint="album cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h2 className="text-3xl font-bold font-headline">{song.title}</h2>
        <p className="text-xl text-neutral-300">{song.artist}</p>
      </div>
    </div>
  );
}
