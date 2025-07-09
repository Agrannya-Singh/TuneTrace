'use client';

import type { Song } from '@/lib/spotify';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SongCardProps {
  song: Song;
  isActive: boolean;
}

export function SongCard({ song, isActive }: SongCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isActive && song.previewUrl) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error("Audio play failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive, song.previewUrl]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from being swiped
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

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
      {song.previewUrl && (
        <>
           <audio ref={audioRef} src={song.previewUrl} loop muted={isMuted} />
           <button onClick={toggleMute} className="absolute top-4 right-4 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </>
      )}
    </div>
  );
}
