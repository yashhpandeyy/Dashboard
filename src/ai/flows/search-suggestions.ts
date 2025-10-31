'use server';

/**
 * @fileOverview Provides search suggestions based on user input.
 *
 * - getSearchSuggestions - A function that fetches search suggestions.
 * - SearchSuggestionInput - The input type for the getSearchSuggestions function.
 * - SearchSuggestionOutput - The return type for the getSearchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchSuggestionInputSchema = z.object({
  query: z
    .string()
    .describe('The partial search query entered by the user.'),
});
export type SearchSuggestionInput = z.infer<typeof SearchSuggestionInputSchema>;

const SearchSuggestionOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of 5 predictive search suggestions.'),
});
export type SearchSuggestionOutput = z.infer<
  typeof SearchSuggestionOutputSchema
>;

export async function getSearchSuggestions(
  input: SearchSuggestionInput
): Promise<SearchSuggestionOutput> {
  return searchSuggestionFlow(input);
}

const searchSuggestionPrompt = ai.definePrompt({
  name: 'searchSuggestionPrompt',
  input: {schema: SearchSuggestionInputSchema},
  output: {schema: SearchSuggestionOutputSchema},
  prompt: `You are a search suggestion engine. Based on the user's partial query, provide a list of 5 relevant and concise search suggestions to help them complete their thought. Return only the suggestions.

Query: {{{query}}}
`,
});

const searchSuggestionFlow = ai.defineFlow(
  {
    name: 'searchSuggestionFlow',
    inputSchema: SearchSuggestionInputSchema,
    outputSchema: SearchSuggestionOutputSchema,
  },
  async input => {
    if (!input.query) {
        return { suggestions: [] };
    }
    const {output} = await searchSuggestionPrompt(input);
    return output || { suggestions: [] };
  }
);
