import { Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DiscoveryViewProps {
    query: string;
    setQuery: (query: string) => void;
    onSubmit: () => void;
    onBack: () => void;
}

export function DiscoveryView({ query, setQuery, onSubmit, onBack }: DiscoveryViewProps) {
    return (
        <Card className="w-full max-w-lg bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Compass className="text-blue-400" />
                    Semantic Discovery
                </CardTitle>
                <CardDescription className="text-neutral-400">
                    Search for music using natural language. Describe the vibe, instruments, or similar artists.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="discovery-query" className="text-sm font-medium text-neutral-300">
                            Describe what you're looking for
                        </Label>
                        <div className="relative">
                            <Input
                                id="discovery-query"
                                placeholder="e.g. 'acoustic guitar with melancholic vibes' or 'upbeat synthpop like The Weeknd'"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 h-12 pr-10"
                            />
                            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/50 pointer-events-none" />
                        </div>
                        <p className="text-xs text-neutral-500 italic">
                            Pro tip: Our AI understands context, not just keywords.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12"
                            disabled={!query.trim()}
                        >
                            Explore Semantically
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onBack}
                            className="w-full text-neutral-400 hover:text-white hover:bg-neutral-800"
                        >
                            Back to Categories
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
