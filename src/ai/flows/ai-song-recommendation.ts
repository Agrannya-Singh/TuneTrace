// This is a server-side file.
'use server';

/**
 * @fileOverview AI-powered song recommendation flow based on user preferences.
 *
 * - recommendSongs - A function that generates song recommendations based on user's swipe history and liked songs.
 * - RecommendSongsInput - The input type for the recommendSongs function.
 * - RecommendSongsOutput - The return type for the recommendSongs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getSpotifyRecommendations} from '@/lib/spotify';

const RecommendSongsInputSchema = z.object({
  swipeHistory: z
    .array(z.string())
    .describe('List of song IDs the user has swiped on (liked or disliked).'),
  likedSongs: z.array(z.string()).describe('List of song IDs the user has liked on Spotify.'),
});
export type RecommendSongsInput = z.infer<typeof RecommendSongsInputSchema>;

const RecommendSongsOutputSchema = z.object({
  recommendedSongs: z
    .array(z.string())
    .describe('List of song IDs recommended for the user.'),
});
export type RecommendSongsOutput = z.infer<typeof RecommendSongsOutputSchema>;

export async function recommendSongs(input: RecommendSongsInput): Promise<RecommendSongsOutput> {
  return recommendSongsFlow(input);
}

const spotifyRecommendationsTool = ai.defineTool(
    {
        name: 'getSpotifyRecommendations',
        description: 'Gets song recommendations from Spotify based on seed tracks.',
        inputSchema: z.object({
            seed_tracks: z.array(z.string()).describe('A list of Spotify track IDs to use as a seed for recommendations.'),
            limit: z.number().describe('The number of recommendations to return.'),
        }),
        outputSchema: z.object({
            tracks: z.array(z.object({
                id: z.string(),
            })),
        }),
    },
    async ({ seed_tracks, limit }) => getSpotifyRecommendations({ seed_tracks, limit })
);


const prompt = ai.definePrompt({
  name: 'recommendSongsPrompt',
  input: {schema: RecommendSongsInputSchema},
  output: {schema: RecommendSongsOutputSchema},
  tools: [spotifyRecommendationsTool],
  prompt: `You are a music recommendation expert. Your goal is to help users discover new music.
  
Analyze the user's music preferences based on their existing liked songs and their recent swipe history.

- Liked Songs (song IDs): {{{likedSongs}}}
- Swipe History (song IDs): {{{swipeHistory}}}

1. Identify up to 5 key "seed" tracks from the user's liked songs that best represent their core taste.
2. Use the 'getSpotifyRecommendations' tool with these seed tracks to fetch a list of potential new songs.
3. From the tool's output, select up to 20 song IDs to recommend to the user.
4. Ensure you do not recommend songs that are already in the user's liked songs or swipe history.
5. Return the final list of recommended song IDs.
`,  
});

const recommendSongsFlow = ai.defineFlow(
  {
    name: 'recommendSongsFlow',
    inputSchema: RecommendSongsInputSchema,
    outputSchema: RecommendSongsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
