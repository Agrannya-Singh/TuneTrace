import { Heart, X, ListMusic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LikedSongsDialog } from './LikedSongsDialog';

interface SwipeControlsProps {
    canSwipe: boolean;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
    onRestart: () => void;
    isFetchingRecommendations: boolean;
    likedSongsHistory: any[];
    fetchLikedSongs: () => void;
}

export function SwipeControls({
    canSwipe,
    onSwipeLeft,
    onSwipeRight,
    onRestart,
    isFetchingRecommendations,
    likedSongsHistory,
    fetchLikedSongs
}: SwipeControlsProps) {
    return (
        <>
            <div className="flex items-center gap-8 mt-8">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-20 h-20 rounded-full bg-white/10 border-red-500/50 text-red-500 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 transition-all transform hover:scale-110"
                    onClick={onSwipeLeft}
                    disabled={!canSwipe}
                >
                    <X className="h-10 w-10" />
                </Button>

                <LikedSongsDialog
                    history={likedSongsHistory}
                    onOpen={fetchLikedSongs}
                >
                    <Button variant="outline" size="icon" className="w-16 h-16 rounded-full bg-white/10 border-blue-500/50 text-blue-500 hover:bg-blue-500/20 hover:text-blue-400 disabled:opacity-50 transition-all">
                        <ListMusic className="h-8 w-8" />
                    </Button>
                </LikedSongsDialog>

                <Button
                    variant="outline"
                    size="icon"
                    className="w-20 h-20 rounded-full bg-white/10 border-primary/50 text-primary hover:bg-primary/20 hover:text-green-400 disabled:opacity-50 transition-all transform hover:scale-110"
                    onClick={onSwipeRight}
                    disabled={!canSwipe}
                >
                    <Heart className="h-10 w-10" />
                </Button>
            </div>

            {isFetchingRecommendations && (
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Getting new recommendations...</span>
                </div>
            )}

            <Button variant="link" className="mt-4 text-muted-foreground" onClick={onRestart}>
                New Search
            </Button>
        </>
    );
}
