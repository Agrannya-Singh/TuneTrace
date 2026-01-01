import { Loader2, Music, RotateCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

export function LoadingView() {
    return (
        <div className="text-center flex flex-col items-center justify-center h-full text-white">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <p className="text-xl">Finding some bangers for you...</p>
        </div>
    );
}

export function ErrorView({ onRestart }: { onRestart: () => void }) {
    return (
        <div className="text-center flex flex-col items-center justify-center h-full text-white p-4">
            <Alert variant="destructive" className="max-w-md">
                <Info className="h-4 w-4" />
                <AlertTitle>Oops, something went wrong.</AlertTitle>
                <AlertDescription>
                    We couldn't load songs from YouTube. This might be a temporary issue or a problem with the API configuration.
                </AlertDescription>
            </Alert>
            <Button onClick={onRestart} className="mt-4">
                <RotateCw className="mr-2" />
                Try Again
            </Button>
        </div>
    );
}

export function OutOfCardsView({ onRestart }: { onRestart: () => void }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 rounded-xl text-white text-center p-8">
            <Music className="h-16 w-16 mb-4 text-primary" />
            <h2 className="text-2xl font-bold">You've reached the end!</h2>
            <p className="text-neutral-300 mb-4">You've swiped through all the tracks for this vibe.</p>
            <Button onClick={onRestart}>
                <RotateCw className="mr-2" />
                Start New Search
            </Button>
        </div>
    );
}
