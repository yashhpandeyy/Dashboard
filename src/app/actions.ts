'use server';

import { personalizedThemeSelection } from '@/ai/flows/personalized-theme-selection';
import { getSearchSuggestions as getSearchSuggestionsFlow } from '@/ai/flows/search-suggestions';

export async function getThemeSuggestion(prevState: any, formData: FormData) {
  const themeDescription = formData.get('themeDescription') as string;
  if (!themeDescription) {
    return { success: false, error: 'Please enter a description for your theme.' };
  }

  try {
    const result = await personalizedThemeSelection({ themeDescription });
    return { success: true, suggestion: result.themeSuggestion };
  } catch (error) {
    console.error('AI Error:', error);
    return { success: false, error: 'Failed to get a theme suggestion. Please try again.' };
  }
}

export async function getSearchSuggestions(query: string) {
    if (!query) {
        return [];
    }
    try {
        const result = await getSearchSuggestionsFlow({ query });
        return result.suggestions;
    } catch (error) {
        console.error('Search Suggestion Error:', error);
        return [];
    }
}
