import { useState, useRef, useEffect, useCallback, createRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/app/context/AuthContext';
import { getSongsByIds, getSongsByQuery } from '@/lib/youtube';
import type { Song } from '@/lib/spotify';

const SUGGESTION_SERVICE_BASE_URL = 'https://song-suggest-fastapi-ajaqgfa8aja8crbn.southeastasia-01.azurewebsites.net';

export type AppState = 'moodSelection' | 'loading' | 'ready' | 'outOfCards' | 'error' | 'discovery';
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
    const [discoveryQuery, setDiscoveryQuery] = useState('');
    const [isFetchingRecommendations, setIsFetchingRecommendations] = useState(false);

    const currentIndexRef = useRef(currentIndex);
    const pendingLikesRef = useRef<Song[]>([]);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const updateCurrentIndex = (val: number) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const fetchLikedSongs = useCallback(async () => {
        if (!user?.email) return;
        try {
            const res = await fetch(`${SUGGESTION_SERVICE_BASE_URL}/liked-songs?user_id=${user.email}`);
            if (res.ok) {
                const data = await res.json();
                setLikedSongsHistory(data);
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
        }
    }, [user?.email]);

    const persistLikes = useCallback(async () => {
        if (pendingLikesRef.current.length === 0) return;

        const songsToSave = [...pendingLikesRef.current].slice(0, 50);
        pendingLikesRef.current = pendingLikesRef.current.slice(50);

        try {
            await fetch(`${SUGGESTION_SERVICE_BASE_URL}/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.email || 'anon@use.com',
                    songs: songsToSave.map(s => `${s.title} - ${s.artist}`),
                    genre: selectedGenres.length > 0 ? selectedGenres.join(' ') : 'any'
                })
            });
        } catch (e) {
            console.error("Failed to persist likes", e);
        }
    }, [user?.email, selectedGenres]);

    const queueLike = (song: Song) => {
        pendingLikesRef.current.push(song);
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            persistLikes();
        }, 2000);
    };

    const fetchSongs = useCallback(async (genres: string[], moods: string[], videoIds?: string) => {
        if (videoIds) {
            setIsFetchingRecommendations(true);
        } else {
            setAppState('loading');
            setLikedSongs([]);
        }

        try {
            let fetchedSongs: Song[] = [];

            if (videoIds) {
                fetchedSongs = await getSongsByIds(videoIds);
            } else {
                const genreQuery = genres.join(' ');
                const moodQuery = moods.join(' ');
                let query = (moodQuery || genreQuery) 
                    ? `${moodQuery} ${genreQuery} music` 
                    : 'top trending music';

                fetchedSongs = await getSongsByQuery(query);

                if (fetchedSongs.length < 20) {
                    const extraSongs = await getSongsByQuery(query, 'next');
                    fetchedSongs = [...fetchedSongs, ...extraSongs];
                }
            }

            if (fetchedSongs.length > 0) {
                // Filter out songs already in the list
                const newSongs = fetchedSongs.filter(
                    (song: Song) => !songs.some((existing: Song) => existing.id === song.id)
                );

                setSongs(prevSongs => {
                    const updatedSongs = videoIds 
                        ? [...newSongs, ...prevSongs.slice(currentIndex + 1)]
                        : newSongs;
                    
                    setChildRefs(Array(updatedSongs.length).fill(0).map(() => createRef()));
                    setCurrentIndex(updatedSongs.length - 1);
                    currentIndexRef.current = updatedSongs.length - 1;
                    return updatedSongs;
                });
                setAppState('ready');
            } else if (!videoIds) {
                setAppState('outOfCards');
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            if (!videoIds) {
                setAppState('error');
                toast({
                    variant: "destructive",
                    title: "Error Fetching Songs",
                    description: error instanceof Error ? error.message : "Could not fetch songs.",
                });
            }
        } finally {
            setIsFetchingRecommendations(false);
        }
    }, [toast, currentIndex, songs]);

    const discoverMusic = useCallback(async (query: string) => {
        setAppState('loading');
        setLikedSongs([]);
        try {
            const res = await fetch(`${SUGGESTION_SERVICE_BASE_URL}/discover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    limit: 10
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.detail || `Server error: ${res.status}`);
            }

            const data = await res.json();
            if (data.results?.length > 0) {
                const vIds = data.results.map((s: any) => s.youtube_video_id).join(',');
                await fetchSongs([], [], vIds);
                toast({
                    title: "Discovery Results",
                    description: `Found ${data.results.length} songs matching your semantic query.`,
                });
            } else {
                setAppState('outOfCards');
            }
        } catch (e) {
            console.error("Discovery error", e);
            setAppState('error');
            toast({
                variant: "destructive",
                title: "Discovery Failed",
                description: e instanceof Error ? e.message : "Could not discover music.",
            });
        }
    }, [fetchSongs, toast]);

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.email || 'anon@use.com',
                    songs: songFormatted,
                    genre: selectedGenres.length > 0 ? selectedGenres.join(' ') : 'any'
                })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.detail || `Server error: ${res.status}`);
            }

            const data = await res.json();

            if (data.suggestions?.length > 0) {
                const vIds = data.suggestions.map((s: any) => s.youtube_video_id).join(',');
                await fetchSongs([], [], vIds);
                toast({
                    title: "Here are some new tracks!",
                    description: "Curated based on your likes.",
                });
            } else {
                setAppState('outOfCards');
            }
        } catch (e) {
            console.error("Recommendation error", e);
            setAppState('outOfCards');
        } finally {
            setIsFetchingRecommendations(false);
        }
    }, [fetchSongs, isFetchingRecommendations, toast, likedSongs, selectedGenres, user?.email]);

    useEffect(() => {
        if (appState === 'outOfCards' && likedSongs.length > 0) {
            getRecommendations();
        }
    }, [appState, likedSongs.length, getRecommendations]);

    const handleFindSongs = () => fetchSongs(selectedGenres, selectedMoods);

    const handleDiscovery = () => {
        if (discoveryQuery.trim()) {
            discoverMusic(discoveryQuery);
        }
    };

    const handleRestart = () => {
        setAppState('moodSelection');
        setSongs([]);
        setLikedSongs([]);
        setSelectedGenres([]);
        setSelectedMoods([]);
        setDiscoveryQuery('');
        updateCurrentIndex(0);
    };

    const handleCheckboxChange = (type: 'genre' | 'mood', value: string, checked: boolean) => {
        const updater = type === 'genre' ? setSelectedGenres : setSelectedMoods;
        updater((prev: string[]) => checked ? [...prev, value] : prev.filter((item) => item !== value));
    };

    const outOfFrame = () => {
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
        if (canSwipe && childRefs[currentIndex]?.current) {
            await childRefs[currentIndex].current.swipe(dir);
        }
    };

    return {
        appState,
        songs,
        childRefs,
        currentIndex,
        selectedGenres,
        selectedMoods,
        discoveryQuery,
        likedSongs,
        likedSongsHistory,
        isFetchingRecommendations,
        handlers: {
            handleCheckboxChange,
            handleFindSongs,
            handleDiscovery,
            setDiscoveryQuery,
            handleRestart,
            fetchLikedSongs,
            swiped,
            outOfFrame,
            swipe,
            setAppState,
        },
        flags: { canSwipe }
    };
}

