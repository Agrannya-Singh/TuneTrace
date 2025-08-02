'use client';

import { useState, useMemo, useRef, useEffect, useCallback, createRef } from 'react';
import type { TinderCardAPI } from 'react-tinder-card';
import TinderCard from 'react-tinder-card';
import type { Song } from '@/lib/spotify';
import { SongCard } from './song-card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, RotateCw, X, Music, ListMusic, Download, Info, Search } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { SpotifyIntegration } from './spotify-integration';


type AppState = 'moodSelection' | 'loading' | 'ready' | 'outOfCards' | 'error';

const genres = ['Rap', 'Hip Hop', 'Pop', 'Rock', 'Indie', 'Electronic', 'R&B', 'Country', 'Alternative', 'Metal', 'Folk'];
const moods = ['Chill', 'Upbeat', 'Workout', 'Party', 'Sad', 'Focus', 'Romantic', 'Energetic'];

const SUGGESTION_SERVICE_BASE_URL = 'https://song-suggest-microservice.onrender.com'; 

/**
 * Sends error details and context information to the backend logging endpoint.
 *
 * Attempts to POST the provided error and context to `/api/log`. If the logging request fails, the error is logged to the console.
 *
 * @param error - The error object or message to log
 * @param context - Additional context describing where or how the error occurred
 */
async function logRecommendationError(error: any, context: string) {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error, context }),
    });
  } catch (e) {
    console.error("Failed to write to log endpoint:", e);
  }
}

/**
 * Provides a swipe-based music discovery interface where users can select genres and moods, swipe through song cards, like tracks, and receive personalized recommendations.
 *
 * Users begin by selecting genres and moods or leaving them blank to view top charts. Songs are presented as swipeable cards; swiping right adds a song to the liked list. When all cards are swiped, the component fetches new recommendations based on liked songs from an external microservice. The UI adapts to loading, error, and empty states, and users can download their liked songs or restart the discovery process at any time.
 *
 * @returns The rendered music discovery UI as a React component.
 */
export default function TuneSwipeClient() {
  const [appState, setAppState] = useState<AppState>('moodSelection');
  const [songs, setSongs] = useState<Song[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [childRefs, setChildRefs] = useState<React.RefObject<TinderCardAPI>[]>([]);
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);
  const [showSpotifyIntegration, setShowSpotifyIntegration] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'youtube' | 'spotify'>('youtube');

  const { toast } = useToast();

  const currentIndexRef = useRef(currentIndex);

  const fetchSongs = useCallback(async (genres: string[], moods: string[], videoIds?: string) => {
    if (videoIds) {
      setIsFetchingRecommendations(true);
    } else {
      setAppState('loading');
      setLikedSongs([]); 
    }

    try {
        const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || 'http://localhost:8000';
        
        if (videoIds) {
            // Get recommendations from Python backend
            const response = await fetch(`${pythonBackendUrl}/api/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    liked_songs: likedSongs,
                    limit: 20,
                    source: selectedSource
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
                throw new Error(errorData.error || `Server responded with ${response.status}`);
            }
            
            const data = await response.json();
            let fetchedSongs = data.songs || [];
            
            if (fetchedSongs.length > 0) {
                const newSongs = fetchedSongs.filter((song: Song) => !songs.some(existing => existing.id === song.id));
                
                // Add recommended songs to the front of the swipe queue
                setSongs(prevSongs => {
                    const updatedSongs = [...newSongs, ...prevSongs.slice(currentIndex + 1)];
                    setChildRefs(Array(updatedSongs.length).fill(0).map(() => createRef<TinderCardAPI>()));
                    setCurrentIndex(updatedSongs.length - 1);
                    return updatedSongs;
                });
                setAppState('ready');
            }
        } else {
            // Search for songs
            const searchQuery = `${moods.join(' ')} ${genres.join(' ')} music`.trim() || 'popular music';
            
            const response = await fetch(`${pythonBackendUrl}/api/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: searchQuery,
                    source: selectedSource,
                    limit: 20
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
                throw new Error(errorData.error || `Server responded with ${response.status}`);
            }
            
            const data = await response.json();
            let fetchedSongs = data.songs || [];
            
            if (fetchedSongs.length > 0) {
                const newSongs = fetchedSongs.filter((song: Song) => !songs.some(existing => existing.id === song.id));
                
                // This is a new search, so replace the song list
                setSongs(newSongs);
                setChildRefs(Array(newSongs.length).fill(0).map(() => createRef<TinderCardAPI>()));
                setCurrentIndex(newSongs.length - 1);
                setAppState('ready');
            } else {
                setAppState('outOfCards');
            }
        }
    } catch (error) {
        console.error('Error fetching songs:', error);
        if (!videoIds) {
            setAppState('error');
            const errorMessage = error instanceof Error ? error.message : "Could not fetch songs. Please try again later.";
            toast({
                variant: "destructive",
                title: "Error Fetching Songs",
                description: errorMessage,
            })
        }
    } finally {
        setIsFetchingRecommendations(false);
    }
  }, [toast, currentIndex, songs, likedSongs, selectedSource]);


  const getRecommendations = useCallback(async () => {
    if (isFetchingRecommendations || likedSongs.length === 0) return;
    
    setIsFetchingRecommendations(true);
    setAppState('loading'); // Show loading state while getting new recommendations

    try {
        // NOTE: Assuming a user_id is available. For now, using a placeholder.
        // In a real app, this would come from an authentication context.
        const userId = "test-user";
        const songTitles = likedSongs.map(s => `${s.title} - ${s.artist}`);

        const res = await fetch(`${SUGGESTION_SERVICE_BASE_URL}/suggestions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, songs: songTitles })
        });
        
        if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.detail || `Microservice responded with ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.suggestions && data.suggestions.length > 0) {
            const videoIds = data.suggestions.map((s: any) => s.youtube_video_id).join(',');
            await fetchSongs([], [], videoIds);
             toast({
                title: "Here are some new tracks!",
                description: "We've curated these recommendations based on your likes.",
            });
        } else {
             setAppState('outOfCards'); // No more recommendations to show
        }
    } catch(e) {
      console.error("Failed to get recommendations", e);
      const errorMessage = e instanceof Error ? e.message : "Could not fetch recommendations at this time.";
       toast({
        variant: "destructive",
        title: "Recommendation Error",
        description: errorMessage,
      })
      await logRecommendationError(errorMessage, "getRecommendations");
      setAppState('outOfCards'); // Fallback to out of cards state
    } finally {
        setIsFetchingRecommendations(false);
    }
  }, [fetchSongs, isFetchingRecommendations, toast, likedSongs]);


  useEffect(() => {
    if (appState === 'outOfCards' && likedSongs.length > 0) {
        getRecommendations();
    }
  }, [appState, likedSongs, getRecommendations]);

  const handleFindSongs = () => {
      fetchSongs(selectedGenres, selectedMoods);
  };
  
  const handleRestart = () => {
    setAppState('moodSelection');
    setSongs([]);
    setLikedSongs([]);
    setSelectedGenres([]);
    setSelectedMoods([]);
    setCurrentIndex(0);
  }

  const handleCheckboxChange = (
    type: 'genre' | 'mood',
    value: string,
    checked: boolean
  ) => {
    const updater = type === 'genre' ? setSelectedGenres : setSelectedMoods;
    updater((prev: string[]) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = appState === 'ready' && currentIndex >= 0 && currentIndex < songs.length;

  const swiped = (direction: 'left' | 'right', song: Song, index: number) => {
    if (direction === 'right') {
      setLikedSongs((prev) => [...prev, song]);
    }
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (songId: string, idx: number) => {
    // Check if the card that went out of frame was the last one
    if (currentIndexRef.current < 0) {
      setAppState('outOfCards');
    }
  };

  const swipe = async (dir: 'left' | 'right') => {
    if (canSwipe && childRefs[currentIndex]) {
      await childRefs[currentIndex]?.current?.swipe(dir);
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
      case 'moodSelection':
        return (
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Find Your Vibe</CardTitle>
              <CardDescription>
                Select your desired genres and moods to get song recommendations. If you leave it blank, we'll show you the current top charts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleFindSongs(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-lg font-semibold mb-2 block">Genres</Label>
                    <ScrollArea className="h-48 p-4 border rounded-md">
                      <div className="space-y-2">
                        {genres.map(genre => (
                          <div key={genre} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`genre-${genre}`}
                              onCheckedChange={(checked) => handleCheckboxChange('genre', genre, !!checked)}
                              checked={selectedGenres.includes(genre)}
                            />
                            <label htmlFor={`genre-${genre}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {genre}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div>
                    <Label className="text-lg font-semibold mb-2 block">Moods</Label>
                     <ScrollArea className="h-48 p-4 border rounded-md">
                      <div className="space-y-2">
                        {moods.map(mood => (
                          <div key={mood} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`mood-${mood}`}
                              onCheckedChange={(checked) => handleCheckboxChange('mood', mood, !!checked)}
                              checked={selectedMoods.includes(mood)}
                            />
                            <label htmlFor={`mood-${mood}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {mood}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div>
                    <Label className="text-lg font-semibold mb-2 block">Music Source</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="youtube"
                          name="source"
                          value="youtube"
                          checked={selectedSource === 'youtube'}
                          onChange={(e) => setSelectedSource(e.target.value as 'youtube' | 'spotify')}
                          className="w-4 h-4"
                        />
                        <label htmlFor="youtube" className="text-sm font-medium">
                          YouTube Music
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="spotify"
                          name="source"
                          value="spotify"
                          checked={selectedSource === 'spotify'}
                          onChange={(e) => setSelectedSource(e.target.value as 'youtube' | 'spotify')}
                          className="w-4 h-4"
                        />
                        <label htmlFor="spotify" className="text-sm font-medium">
                          Spotify
                        </label>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Find Music
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      case 'loading':
         return (
          <div className="text-center flex flex-col items-center justify-center h-full text-white">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl">Finding some bangers for you...</p>
          </div>
        );
      case 'ready':
        return (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-sm h-[60vh] md:max-w-md md:h-[65vh] relative">
              {songs.length > 0 && childRefs.length > 0 ? (
                songs.map((song, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    className="absolute inset-0"
                    key={`${song.id}-${index}`}
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
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Liked Songs & Spotify Integration</DialogTitle>
                    <DialogDescription>
                      Here are the songs you've liked. You can download this list as a text file or create a Spotify playlist.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Liked Songs</h3>
                      <ScrollArea className="h-72 w-full rounded-md border p-4">
                         {likedSongs.length > 0 ? (
                            <ul className="space-y-2">
                              {likedSongs.map((song) => (
                                <li key={song.id} className="text-sm">
                                  {song.title} - <span className="text-muted-foreground">{song.artist}</span>
                                  {song.source === 'spotify' && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">Spotify</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground text-center">You haven't liked any songs yet.</p>
                          )}
                      </ScrollArea>
                      <div className="mt-2">
                        <Button onClick={downloadLikedSongs} disabled={likedSongs.length === 0} size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download List
                        </Button>
                      </div>
                    </div>
                    <div>
                      <SpotifyIntegration 
                        likedSongs={likedSongs}
                        onPlaylistCreated={() => {
                          toast({
                            title: "Success!",
                            description: "Your Spotify playlist has been created!",
                          });
                        }}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon" className="w-20 h-20 rounded-full bg-white/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-green-400 disabled:opacity-50 transition-all transform hover:scale-110" onClick={() => swipe('right')} disabled={!canSwipe}>
                <Heart className="h-10 w-10" />
              </Button>
            </div>
             {isFetchingRecommendations && (
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Getting new recommendations...</span>
                </div>
            )}
            <Button variant="link" className="mt-4 text-muted-foreground" onClick={handleRestart}>
              New Search
            </Button>
          </div>
        );
      case 'outOfCards':
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 rounded-xl text-white text-center p-8">
                <Music className="h-16 w-16 mb-4 text-primary" />
                <h2 className="text-2xl font-bold">You've reached the end!</h2>
                <p className="text-neutral-300 mb-4">You've swiped through all the tracks for this vibe.</p>
                <Button onClick={handleRestart}>
                    <RotateCw className="mr-2" />
                    Start New Search
                </Button>
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
            <Button onClick={handleRestart} className="mt-4">
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
