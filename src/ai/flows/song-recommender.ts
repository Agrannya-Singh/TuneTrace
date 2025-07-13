'use server';
/**
 * @fileOverview An AI flow for recommending songs.
 *
 * - recommendSongs - A function that recommends songs based on a list of liked tracks.
 * - SongRecommenderInput - The input type for the recommendSongs function.
 * - SongRecommenderOutput - The return type for the recommendSongs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SongRecommenderInputSchema = z.object({
  likedSongs: z.array(z.string()).describe('A list of song titles and artists that the user has liked.'),
});
export type SongRecommenderInput = z.infer<typeof SongRecommenderInputSchema>;

const SongRecommenderOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe('The title of the recommended song.'),
      artist: z.string().describe('The artist of the recommended song.'),
    })
  ).describe('A list of 5 new song recommendations.'),
});
export type SongRecommenderOutput = z.infer<typeof SongRecommenderOutputSchema>;

export async function recommendSongs(input: SongRecommenderInput): Promise<SongRecommenderOutput> {
  return recommendSongsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSongsPrompt',
  input: { schema: SongRecommenderInputSchema },
  output: { schema: SongRecommenderOutputSchema },
  prompt: `You are a world-class music discovery expert. Your task is to recommend 5 new songs to a user based on the tracks they have liked.

Provide a diverse set of recommendations that match the vibe of the liked songs, but introduce them to new tracks they might not have heard before.

Return ONLY the list of 5 recommendations in the requested format.

Liked Songs:
{{#each likedSongs}}
- {{this}}
{{/each}}
`,
});

const recommendSongsFlow = ai.defineFlow(
  {
    name: 'recommendSongsFlow',
    inputSchema: SongRecommenderInputSchema,
    outputSchema: SongRecommenderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
