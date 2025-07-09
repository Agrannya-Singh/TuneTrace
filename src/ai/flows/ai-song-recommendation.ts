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

const prompt = ai.definePrompt({
  name: 'recommendSongsPrompt',
  input: {schema: RecommendSongsInputSchema},
  output: {schema: RecommendSongsOutputSchema},
  prompt: `You are a music recommendation expert. Analyze the user's music preferences based on their swipe history and liked songs to generate personalized song recommendations.

Swipe History (song IDs): {{{swipeHistory}}}
Liked Songs (song IDs): {{{likedSongs}}}

Based on this data, recommend songs that the user might like. Only return a list of song IDs.
Ensure that the recommended songs are diverse and align with the user's taste.  Do not recommend songs that are already in their liked songs.
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
