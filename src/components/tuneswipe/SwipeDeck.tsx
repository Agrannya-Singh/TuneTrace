import TinderCard from 'react-tinder-card';
import { SongCard } from '../song-card'; // Make sure this path is correct
import type { Song } from '@/lib/spotify';

export type TinderCardAPI = {
    swipe: (dir: 'left' | 'right' | 'up' | 'down') => Promise<void>;
    restoreCard: () => Promise<void>;
};

interface SwipeDeckProps {
    songs: Song[];
    childRefs: React.RefObject<any>[];
    currentIndex: number;
    onSwipe: (dir: 'left' | 'right' | 'up' | 'down', song: Song, index: number) => void;
    onCardLeftScreen: (songId: string, index: number) => void;
}

export function SwipeDeck({ songs, childRefs, currentIndex, onSwipe, onCardLeftScreen }: SwipeDeckProps) {
    if (songs.length === 0 || childRefs.length === 0) return null;

    return (
        <div className="w-full max-w-sm h-[60vh] md:max-w-md md:h-[65vh] relative">
            {songs.map((song, index) => (
                <TinderCard
                    ref={childRefs[index]}
                    className="absolute inset-0"
                    key={`${song.id}-${index}`}
                    onSwipe={(dir) => onSwipe(dir, song, index)}
                    onCardLeftScreen={() => onCardLeftScreen(song.id, index)}
                    preventSwipe={['up', 'down']}
                >
                    <SongCard
                        song={song}
                        isActive={index === currentIndex}
                    />
                </TinderCard>
            ))}
        </div>
    );
}
