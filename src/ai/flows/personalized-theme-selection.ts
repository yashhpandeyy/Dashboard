'use server';

/**
 * @fileOverview Personalized theme selection flow.
 *
 * This file defines a Genkit flow that suggests personalized theme options based on a user-provided description.
 * - personalizedThemeSelection - A function that initiates the theme suggestion process.
 * - ThemeSelectionInput - The input type for the personalizedThemeSelection function.
 * - ThemeSelectionOutput - The return type for the personalizedThemeSelection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ThemeSelectionInputSchema = z.object({
  themeDescription: z
    .string()
    .describe(
      'A detailed description of the desired theme, including colors, styles, and overall aesthetic.'
    ),
});
export type ThemeSelectionInput = z.infer<typeof ThemeSelectionInputSchema>;

const ThemeSelectionOutputSchema = z.object({
  themeSuggestion: z
    .string()
    .describe(
      'A personalized theme suggestion based on the provided description, including specific color palettes, font recommendations, and layout ideas.'
    ),
});
export type ThemeSelectionOutput = z.infer<typeof ThemeSelectionOutputSchema>;

export async function personalizedThemeSelection(
  input: ThemeSelectionInput
): Promise<ThemeSelectionOutput> {
  return personalizedThemeSelectionFlow(input);
}

const themeSelectionPrompt = ai.definePrompt({
  name: 'themeSelectionPrompt',
  input: {schema: ThemeSelectionInputSchema},
  output: {schema: ThemeSelectionOutputSchema},
  prompt: `You are a theme customization expert for personal dashboards. Based on the user's description, generate a personalized theme suggestion.

Description: {{{themeDescription}}}

Theme Suggestion:`, // Corrected the prompt
});

const personalizedThemeSelectionFlow = ai.defineFlow(
  {
    name: 'personalizedThemeSelectionFlow',
    inputSchema: ThemeSelectionInputSchema,
    outputSchema: ThemeSelectionOutputSchema,
  },
  async input => {
    const {output} = await themeSelectionPrompt(input);
    return output!;
  }
);
