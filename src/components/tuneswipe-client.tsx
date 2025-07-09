'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { TinderCardAPI } from 'react-tinder-card';
import TinderCard from 'react-tinder-card';
import { recommendSongs } from '@/ai/flows/ai-song-recommendation';
import {
  importLikedSongs,
  getSongDetails,
  addToPlaylist,
  type Song,
} from '@/lib/spotify';
import { SongCard } from './song-card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, RotateCw, X, Music, Check, ListMusic } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

type AppState = 'initial' | 'loading' | 'ready' | 'outOfCards' | 'error';

export default function TuneSwipeClient() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [songs, setSongs] = useState<Song[]>([]);
  const [likedSongsFromSpotify, setLikedSongsFromSpotify] = useState<string[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

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

  const fetchRecommendations = useCallback(async (initialLikedSongs: string[], currentSwipeHistory: string[]) => {
    setAppState('loading');
    try {
      const allKnownSongs = [...initialLikedSongs, ...currentSwipeHistory];
      const aiInput = {
        likedSongs: initialLikedSongs.length > 0 ? initialLikedSongs : ['37i9dQZF1DXcBWIGoYBM5M'], // fallback playlist if no liked songs
        swipeHistory: currentSwipeHistory,
      };
      
      const { recommendedSongs: recommendedSongIds } = await recommendSongs(aiInput);
      
      const existingSongIds = new Set([...songs.map(s => s.id), ...allKnownSongs]);
      const newSongIds = recommendedSongIds.filter(id => !existingSongIds.has(id));

      if (newSongIds.length > 0) {
        const newSongsData = await getSongDetails(newSongIds);
        setSongs(prevSongs => [...prevSongs, ...newSongsData]);
        setAppState('ready');
      } else {
        // If AI returns no new songs, it means we might be out of good recommendations
        setAppState('outOfCards');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setAppState('error');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch song recommendations. Please try again later.",
      })
    }
  }, [songs, toast]);

  const handleImport = async () => {
    setAppState('loading');
    try {
      const importedIds = await importLikedSongs();
      setLikedSongsFromSpotify(importedIds);
      // Reset state for new user session
      setSongs([]);
      setSwipeHistory([]);
      updateCurrentIndex(0);
      await fetchRecommendations(importedIds, []);
    } catch (error) {
      console.error('Error importing songs:', error);
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
          router.push('/api/spotify/login');
      } else {
        setAppState('error');
      }
    }
  };
  
  useEffect(() => {
    if (songs.length > 0) {
      updateCurrentIndex(songs.length - 1);
    }
  }, [songs.length]);

  const swiped = (direction: 'left' | 'right', song: Song, index: number) => {
    updateCurrentIndex(index - 1);
    setSwipeHistory(prev => [...prev, song.id]);
    if (direction === 'right') {
      addToPlaylist(song.id);
      toast({
          title: "Added to Playlist",
          description: `${song.title} by ${song.artist} has been added.`,
          action: (
              <div className="p-2 bg-primary/20 rounded-full">
                  <Check className="h-4 w-4 text-primary" />
              </div>
          ),
      });
    }
  };

  const outOfFrame = (songId: string, idx: number) => {
    const isLastCard = idx === 0;
    if (isLastCard) {
        setAppState('outOfCards');
    }
    // Prefetch when there are 5 cards left
    if (currentIndexRef.current < 5 && songs.length > 5 && appState === 'ready') {
      fetchRecommendations(likedSongsFromSpotify, swipeHistory);
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
      case 'initial':
        return (
          <div className="text-center flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl font-bold font-headline mb-4 text-white">Welcome to TuneSwipe</h1>
            <p className="text-xl text-neutral-400 mb-8 max-w-md">Discover your next favorite song with a swipe. Connect to Spotify to import your Liked Songs and get personalized recommendations.</p>
            <Button size="lg" onClick={() => router.push('/api/spotify/login')} className="bg-primary hover:bg-accent text-primary-foreground">
              <ListMusic className="mr-2" />
              Connect with Spotify
            </Button>
          </div>
        );
      case 'loading':
         return (
          <div className="text-center flex flex-col items-center justify-center h-full text-white">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl">Finding your next jam...</p>
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
                    key={`${song.id}-${index}`}
                    onSwipe={(dir) => swiped(dir, song, index)}
                    onCardLeftScreen={() => outOfFrame(song.id, index)}
                    preventSwipe={['up', 'down']}
                  >
                    <SongCard song={song} />
                  </TinderCard>
                ))
              ) : null }

              {appState === 'outOfCards' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 rounded-xl text-white text-center p-8">
                  <Music className="h-16 w-16 mb-4 text-primary" />
                  <h2 className="text-2xl font-bold">You've reached the end!</h2>
                  <p className="text-neutral-300 mb-4">You've swiped through all available recommendations.</p>
                  <Button onClick={() => fetchRecommendations(likedSongsFromSpotify, swipeHistory)}>
                    <RotateCw className="mr-2" />
                    Get More Songs
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
            <p className="text-neutral-400 mb-4">We couldn't load your songs. Please try again.</p>
            <Button onClick={() => router.push('/api/spotify/login')}>
              <RotateCw className="mr-2" />
              Connect with Spotify
            </Button>
          </div>
        );
    }
  };

  useEffect(() => {
    // This effect runs once on mount to check if we are coming back from Spotify auth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('authed') === 'true') {
        handleImport();
        // Clean up the URL
        window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return (
    <div className="bg-background w-screen h-screen overflow-hidden flex flex-col items-center justify-center p-4">
      {renderContent()}
    </div>
  );
}
