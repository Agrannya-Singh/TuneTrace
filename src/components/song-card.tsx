'use client';

import type { Song } from '@/lib/spotify';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SongCardProps {
  song: Song;
  isMuted: boolean;
  onMuteToggle: () => void;
  isActive: boolean;
}

export function SongCard({ song, isMuted, onMuteToggle, isActive }: SongCardProps) {
  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-neutral-800"
    >
      <Image
        src={song.albumArtUrl || 'https://placehold.co/500x500.png'}
        alt={`${song.title} by ${song.artist}`}
        fill
        className="object-cover"
        data-ai-hint="album cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={isActive}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute top-4 right-4">
        <Button
            onClick={(e) => {
                e.stopPropagation();
                onMuteToggle();
            }}
            size="icon"
            variant="ghost"
            className="rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
        >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h2 className="text-3xl font-bold font-headline">{song.title}</h2>
        <p className="text-xl text-neutral-300">{song.artist}</p>
      </div>
    </div>
  );
}
