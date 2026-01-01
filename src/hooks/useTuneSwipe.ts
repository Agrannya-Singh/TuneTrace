import { useState, useRef, useEffect, useCallback, createRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/app/context/AuthContext';
// import { getSongsByIds } from '@/lib/youtube';
import type { Song } from '@/lib/spotify';

const SUGGESTION_SERVICE_BASE_URL = 'https://song-suggest-microservice.onrender.com';

export type AppState = 'moodSelection' | 'loading' | 'ready' | 'outOfCards' | 'error';
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';



export function useTuneSwipe() {
    const { user } = useAuth();
    const { toast } = useToast();

    const [appState, setAppState] = useState<AppState>('moodSelection');
    const [songs, setSongs] = useState<Song[]>([]);
    const [likedSongs, setLikedSongs] = useState<Song[]>([]);
    const [likedSongsHistory, setLikedSongsHistory] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [childRefs, setChildRefs] = useState<React.RefObject<any>[]>([]);

    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
    const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);

    const currentIndexRef = useRef(currentIndex);

    const updateCurrentIndex = (val: number) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const fetchLikedSongs = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`${SUGGESTION_SERVICE_BASE_URL}/liked-songs?user_id=${user.email}`);
            if (res.ok) {
                const data = await res.json();
                setLikedSongsHistory(data);
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
        }
    }, [user]);

    const pendingLikesRef = useRef<Song[]>([]);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const persistLikes = useCallback(async () => {
        if (pendingLikesRef.current.length === 0) return;

        // Take up to 50 songs from the pending queue
        const songsToSave = [...pendingLikesRef.current].slice(0, 50);

        // Remove the processed songs from the queue
        pendingLikesRef.current = pendingLikesRef.current.slice(50);

        try {
            await fetch(`${SUGGESTION_SERVICE_BASE_URL}/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.email || 'anon@use.com',
                    songs: songsToSave.map(s => `${s.title} - ${s.artist}`),
                    genre: selectedGenres.length > 0 ? selectedGenres.join(' ') : 'any'
                })
            });
        } catch (e) {
            console.error("Failed to persist likes", e);
            // On error, we might want to put them back? For now, we just log.
        }
    }, [user, selectedGenres]);

    const queueLike = (song: Song) => {
        pendingLikesRef.current.push(song);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            persistLikes();
        }, 2000); // Wait 2 seconds of inactivity before sending
    };

    const fetchSongs = useCallback(async (genres: string[], moods: string[], videoIds?: string) => {
        if (videoIds) {
            setIsFetchingRecommendations(true);
        } else {
            setAppState('loading');
            setLikedSongs([]);
        }

        try {
            const params = new URLSearchParams();
            if (videoIds) {
                params.set('videoIds', videoIds);
            } else {
                const genreQuery = genres.join(' ');
                const moodQuery = moods.join(' ');
                params.set('mood', moodQuery);
                params.set('genre', genreQuery);
            }

            const res = await fetch(`/api/songs?${params.toString()}`);

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'An unknown error occurred' }));
                throw new Error(errorData.error || `Server responded with ${res.status}`);
            }

            let fetchedSongs = await res.json();

            if (fetchedSongs.length < 20 && !videoIds) {
                const secondRes = await fetch(`/api/songs?${params.toString()}&pageToken=next`);
                if (secondRes.ok) {
                    const extraSongs = await secondRes.json();
                    fetchedSongs = [...fetchedSongs, ...extraSongs.filter((s: Song) => !fetchedSongs.some((fs: Song) => fs.id === s.id))];
                }
            }

            if (fetchedSongs.length > 0) {
                const newSongs = fetchedSongs.filter((song: Song) => !songs.some((existing: Song) => existing.id === song.id));

                if (videoIds) {
                    setSongs(prevSongs => {
                        const updatedSongs = [...newSongs, ...prevSongs.slice(currentIndex + 1)];
                        setChildRefs(Array(updatedSongs.length).fill(0).map(() => createRef()));
                        setCurrentIndex(updatedSongs.length - 1);
                        return updatedSongs;
                    });
                    setAppState('ready');
                } else {
                    setSongs(newSongs);
                    setChildRefs(Array(newSongs.length).fill(0).map(() => createRef()));
                    setCurrentIndex(newSongs.length - 1);
                    setAppState('ready');
                }
            } else if (!videoIds) {
                setAppState('outOfCards');
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
                });
            }
        } finally {
            setIsFetchingRecommendations(false);
        }
    }, [toast, currentIndex, songs, selectedGenres, selectedMoods]);

    const getRecommendations = useCallback(async () => {
        if (isFetchingRecommendations || likedSongs.length === 0) return;

        setIsFetchingRecommendations(true);
        setAppState('loading');

        try {
            const songFormatted = likedSongs
                .slice(-50)
                .map(s => `${s.title} - ${s.artist}`);

            const res = await fetch(`${SUGGESTION_SERVICE_BASE_URL}/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.email,
                    songs: songFormatted,
                    genre: selectedGenres.length > 0 ? selectedGenres.join(' ') : 'any'
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.detail || `Microservice responded with ${res.status}`);
            }

            const data = await res.json();

            if (data.suggestions && data.suggestions.length > 0) {
                const videoIds = data.suggestions.map((s: any) => s.youtube_video_id).join(',');

                // Use local API to fetch YouTube details (protects API Key)
                const ytRes = await fetch(`/api/songs?videoIds=${videoIds}`);
                if (!ytRes.ok) throw new Error('Failed to fetch song details');
                const newSongs: Song[] = await ytRes.json();
                setSongs(prevSongs => {
                    const updatedSongs = [...newSongs, ...prevSongs.slice(currentIndex + 1)];
                    setChildRefs(Array(updatedSongs.length).fill(0).map(() => createRef()));
                    setCurrentIndex(updatedSongs.length - 1);
                    return updatedSongs;
                });
                setAppState('ready');
                toast({
                    title: "Here are some new tracks!",
                    description: "We've curated these recommendations based on your likes.",
                });
            } else {
                setAppState('outOfCards');
            }
        } catch (e) {
            console.error("Failed to get recommendations", e);
            const errorMessage = e instanceof Error ? e.message : "Could not fetch recommendations at this time.";
            toast({
                variant: "destructive",
                title: "Recommendation Error",
                description: errorMessage,
            });
            setAppState('outOfCards');
        } finally {
            setIsFetchingRecommendations(false);
        }
    }, [fetchSongs, isFetchingRecommendations, toast, likedSongs, selectedGenres, user]);

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
    };

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

    const outOfFrame = (songId: string, idx: number) => {
        if (currentIndexRef.current < 0) {
            setAppState('outOfCards');
        }
    };

    const swiped = (direction: SwipeDirection, song: Song, index: number) => {
        if (direction === 'right') {
            setLikedSongs((prev) => [...prev, song]);
            queueLike(song);
        }
        updateCurrentIndex(index - 1);
    };

    const canSwipe = appState === 'ready' && currentIndex >= 0 && currentIndex < songs.length;

    const swipe = async (dir: 'left' | 'right') => {
        if (canSwipe && childRefs[currentIndex]) {
            await childRefs[currentIndex]?.current?.swipe(dir);
        }
    };

    return {
        appState,
        songs,
        childRefs,
        currentIndex,
        selectedGenres,
        selectedMoods,
        likedSongs,
        likedSongsHistory,
        isFetchingRecommendations,
        handlers: {
            handleCheckboxChange,
            handleFindSongs,
            handleRestart,
            fetchLikedSongs,
            swiped,
            outOfFrame,
            swipe,
        },
        flags: {
            canSwipe
        }
    };
}
