import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Song } from '@/lib/spotify';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface LikedSongsDialogProps {
    likedSongs: Song[];
    history: any[];
    onOpen: () => void;
    children: React.ReactNode;
}

export function LikedSongsDialog({ likedSongs, history, onOpen, children }: LikedSongsDialogProps) {

    // Merge local swipe likes with server history, deduplicating by video id
    const localAsHistory = likedSongs.map(s => ({
        title: s.title,
        artist: s.artist,
        video_id: s.id,
    }));
    const remoteIds = new Set(history.map((s: any) => s.video_id || s.youtube_video_id));
    const uniqueLocal = localAsHistory.filter(s => !remoteIds.has(s.video_id));
    const mergedSongs = [...uniqueLocal, ...history];

    const downloadLikedSongs = () => {
        const content = mergedSongs.map(song => `${song.title} - ${song.artist} (https://youtube.com/watch?v=${song.video_id})`).join('\n');
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

    return (
        <Dialog>
            <DialogTrigger asChild onClick={onOpen}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Liked Songs</DialogTitle>
                    <DialogDescription>
                        Here are the songs you've liked. You can download this list as a text file.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                    {mergedSongs.length > 0 ? (
                        <ul className="space-y-2">
                            {mergedSongs.map((song) => {
                                const title = typeof song.title === 'string' ? song.title : 'Unknown Title';
                                const artist = typeof song.artist === 'string' ? song.artist : 'Unknown Artist';
                                const key = song.video_id || song.youtube_video_id || Math.random();
                                return (
                                    <li key={key} className="text-sm">
                                        {title} - <span className="text-muted-foreground">{artist}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">You haven't liked any songs yet.</p>
                    )}
                </ScrollArea>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button onClick={downloadLikedSongs} disabled={mergedSongs.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        Download List
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
