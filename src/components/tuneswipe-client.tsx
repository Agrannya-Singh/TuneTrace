'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { TinderCardAPI } from 'react-tinder-card';
import TinderCard from 'react-tinder-card';
import type { Song } from '@/lib/lastfm';
import { SongCard } from './song-card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, RotateCw, X, Music } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

type AppState = 'loading' | 'ready' | 'outOfCards' | 'error';

export default function TuneSwipeClient() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(songs.length)
        .fill(0)
        .map(() => useRef<TinderCardAPI>(null)),
    [songs]
  );
  
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0 && currentIndex < songs.length;

  const fetchSongs = useCallback(async () => {
    setAppState('loading');
    try {
      const res = await fetch('/api/songs');
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }
      const topSongs = await res.json();
      
      setSongs(topSongs);
      setCurrentIndex(topSongs.length - 1);
      if (topSongs.length > 0) {
        setAppState('ready');
      } else {
        setAppState('outOfCards');
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setAppState('error');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch songs from Last.fm. Please check credentials and try again.",
      })
    }
  }, [toast]);

  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial mount


  const swiped = (index: number) => {
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (songId: string, idx: number) => {
    const isLastCard = idx === 0;
    if (isLastCard) {
        setAppState('outOfCards');
    }
  };
  
  const swipe = async (dir: 'left' | 'right') => {
    if (canSwipe && currentIndex < songs.length) {
      const cardRef = childRefs[currentIndex];
      if (cardRef && cardRef.current) {
        await cardRef.current.swipe(dir);
      }
    }
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
         return (
          <div className="text-center flex flex-col items-center justify-center h-full text-white">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl">Loading Top Tracks from Last.fm...</p>
          </div>
        );
      case 'ready':
      case 'outOfCards':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-sm h-[60vh] md:max-w-md md:h-[65vh] relative">
              {songs.length > 0 ? (
                songs.map((song, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    className="absolute inset-0"
                    key={song.id}
                    onSwipe={() => swiped(index)}
                    onCardLeftScreen={() => outOfFrame(song.id, index)}
                    preventSwipe={['up', 'down']}
                  >
                    <SongCard 
                      song={song}
                    />
                  </TinderCard>
                ))
              ) : null }

              {appState === 'outOfCards' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 rounded-xl text-white text-center p-8">
                  <Music className="h-16 w-16 mb-4 text-primary" />
                  <h2 className="text-2xl font-bold">You've reached the end!</h2>
                  <p className="text-neutral-300 mb-4">You've swiped through the top tracks.</p>
                  <Button onClick={fetchSongs}>
                    <RotateCw className="mr-2" />
                    Reload Playlist
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-8 mt-8">
              <Button variant="outline" size="icon" className="w-20 h-20 rounded-full bg-white/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-all transform hover:scale-110" onClick={() => swipe('left')} disabled={!canSwipe}>
                <X className="h-10 w-10" />
              </Button>
              <Button variant="outline" size="icon" className="w-24 h-24 rounded-full bg-white/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-green-400 disabled:opacity-50 transition-all transform hover:scale-110" onClick={() => swipe('right')} disabled={!canSwipe}>
                <Heart className="h-12 w-12" />
              </Button>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="text-center flex flex-col items-center justify-center h-full text-white">
            <h2 className="text-2xl font-bold text-destructive">Oops, something went wrong.</h2>
            <p className="text-neutral-400 mb-4">We couldn't load songs from Last.fm.</p>
            <Button onClick={fetchSongs}>
              <RotateCw className="mr-2" />
              Try Again
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="bg-background w-screen h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {renderContent()}
    </div>
  );
}
