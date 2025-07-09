'use client';

import type { Song } from '@/lib/spotify';
import Image from 'next/image';
import { Volume2, VolumeX } from 'lucide-react';
import React, { useState } from 'react';

interface SongCardProps {
  song: Song;
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  onMuteToggle: () => void;
  isMuted: boolean;
}

export function SongCard({ song, audioRef, isPlaying, onMuteToggle, isMuted }: SongCardProps) {

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-neutral-800"
    >
      <audio ref={audioRef} src={song.previewUrl} loop muted={isMuted} />
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
      <div className="absolute top-4 right-4">
          <button 
            onClick={(e) => {
                e.stopPropagation(); // Prevent card from being dragged
                onMuteToggle();
            }}
            className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
      </div>
    </div>
  );
}
