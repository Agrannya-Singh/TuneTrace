'use client';

import { useState, useMemo, useRef, useEffect, useCallback, createRef } from 'react';
import type { TinderCardAPI } from 'react-tinder-card';
import TinderCard from 'react-tinder-card';
import type { Song } from '@/lib/spotify';
import { SongCard } from './song-card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, RotateCw, X, Music, ListMusic, Download, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"


type AppState = 'loading' | 'ready' | 'outOfCards' | 'error';

export default function TuneSwipeClient() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [songs, setSongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [childRefs, setChildRefs] = useState<React.RefObject<TinderCardAPI>[]>([]);
  
  const { toast } = useToast();

  const currentIndexRef = useRef(currentIndex);

  const fetchSongs = useCallback(async () => {
    setAppState('loading');
    setLikedSongs([]); // Reset liked songs on new fetch
    try {
      const res = await fetch('/api/songs');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }
      const topSongs: Song[] = await res.json();
      
      if (topSongs.length > 0) {
        const shuffledSongs = topSongs.sort(() => Math.random() - 0.5);
        setSongs(shuffledSongs);
        setChildRefs(Array(shuffledSongs.length).fill(0).map(() => createRef<TinderCardAPI>()));
        setCurrentIndex(shuffledSongs.length - 1);
        setAppState('ready');
      } else {
        setAppState('outOfCards');
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
      setAppState('error');
      const errorMessage = error instanceof Error ? error.message : "Could not fetch songs. Please try again later.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    }
  }, [toast]);

  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = appState === 'ready' && currentIndex >= 0;

  const swiped = (direction: 'left' | 'right', song: Song, index: number) => {
    if (direction === 'right') {
      setLikedSongs((prev) => [...prev, song]);
    }
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

  const downloadLikedSongs = () => {
    const content = likedSongs.map(song => `${song.title} - ${song.artist} (https://youtube.com/watch?v=${song.id})`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tunetrace-liked-songs.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderContent = () => {
    switch (appState) {
      case 'loading':
         return (
          <div className="text-center flex flex-col items-center justify-center h-full text-white">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl">Finding some bangers on YouTube...</p>
          </div>
        );
      case 'ready':
      case 'outOfCards':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-sm h-[60vh] md:max-w-md md:h-[65vh] relative">
              {songs.length > 0 && childRefs.length > 0 ? (
                songs.map((song, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    className="absolute inset-0"
                    key={song.id}
                    onSwipe={(dir) => swiped(dir, song, index)}
                    onCardLeftScreen={() => outOfFrame(song.id, index)}
                    preventSwipe={['up', 'down']}
                  >
                    <SongCard 
                      song={song}
                      isActive={index === currentIndex}
                    />
                  </TinderCard>
                ))
              ) : null }

              {appState === 'outOfCards' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 rounded-xl text-white text-center p-8">
                  <Music className="h-16 w-16 mb-4 text-primary" />
                  <h2 className="text-2xl font-bold">You've reached the end!</h2>
                  <p className="text-neutral-300 mb-4">You've swiped through all the tracks.</p>
                  <Button onClick={fetchSongs}>
                    <RotateCw className="mr-2" />
                    Find More Songs
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-8 mt-8">
              <Button variant="outline" size="icon" className="w-20 h-20 rounded-full bg-white/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-all transform hover:scale-110" onClick={() => swipe('left')} disabled={!canSwipe}>
                <X className="h-10 w-10" />
              </Button>
               <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white/10 border-blue-500/50 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-50 transition-all">
                      <ListMusic className="h-8 w-8" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Liked Songs</DialogTitle>
                    <DialogDescription>
                      Here are the songs you've liked. You can download this list as a text file.
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-72 w-full rounded-md border p-4">
                     {likedSongs.length > 0 ? (
                        <ul className="space-y-2">
                          {likedSongs.map((song) => (
                            <li key={song.id} className="text-sm">
                              {song.title} - <span className="text-muted-foreground">{song.artist}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">You haven't liked any songs yet.</p>
                      )}
                  </ScrollArea>
                  <DialogFooter>
                    <Button onClick={downloadLikedSongs} disabled={likedSongs.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      Download List
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon" className="w-20 h-20 rounded-full bg-white/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-green-400 disabled:opacity-50 transition-all transform hover:scale-110" onClick={() => swipe('right')} disabled={!canSwipe}>
                <Heart className="h-10 w-10" />
              </Button>
            </div>
          </div>
        );
      case 'error':
        return (
          <div className="text-center flex flex-col items-center justify-center h-full text-white p-4">
             <Alert variant="destructive" className="max-w-md">
              <Info className="h-4 w-4" />
              <AlertTitle>Oops, something went wrong.</AlertTitle>
              <AlertDescription>
                We couldn't load songs from YouTube. This might be a temporary issue or a problem with the API configuration.
              </AlertDescription>
            </Alert>
            <Button onClick={fetchSongs} className="mt-4">
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
