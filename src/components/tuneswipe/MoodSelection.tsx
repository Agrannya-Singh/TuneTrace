import { Search, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

const genres = ['Rap', 'Hip Hop', 'Pop', 'Rock', 'Indie', 'Electronic', 'R&B', 'Country', 'Alternative', 'Metal', 'Folk'];
const moods = ['Chill', 'Upbeat', 'Workout', 'Party', 'Sad', 'Focus', 'Romantic', 'Energetic'];

interface MoodSelectionProps {
    selectedGenres: string[];
    selectedMoods: string[];
    onCheckboxChange: (type: 'genre' | 'mood', value: string, checked: boolean) => void;
    onSubmit: () => void;
    onTryDiscovery: () => void;
}

export function MoodSelection({ selectedGenres, selectedMoods, onCheckboxChange, onSubmit, onTryDiscovery }: MoodSelectionProps) {
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Find Your Vibe</CardTitle>
                <CardDescription>
                    Select your desired genres and moods to get song recommendations. If you leave it blank, we'll show you the current top charts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-lg font-semibold mb-2 block">Genres</Label>
                            <ScrollArea className="h-48 p-4 border rounded-md">
                                <div className="space-y-2">
                                    {genres.map(genre => (
                                        <div key={genre} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`genre-${genre}`}
                                                onCheckedChange={(checked) => onCheckboxChange('genre', genre, !!checked)}
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
                                                onCheckedChange={(checked) => onCheckboxChange('mood', mood, !!checked)}
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
                    <div className="flex flex-col gap-3 mt-6">
                        <Button type="submit" className="w-full">
                            <Search className="mr-2 h-4 w-4" />
                            Find Music
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                            onClick={onTryDiscovery}
                        >
                            <Compass className="mr-2 h-4 w-4" />
                            Try Semantic Discovery
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
