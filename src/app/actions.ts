'use server';

import { personalizedThemeSelection } from '@/ai/flows/personalized-theme-selection';

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
