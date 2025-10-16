'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getThemeSuggestion } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Terminal, Wand2 } from 'lucide-react';

const initialState = {
  success: false,
  suggestion: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : <>
        <Wand2 className="mr-2 h-4 w-4" />
        Generate Theme Idea
      </>}
    </Button>
  );
}

export function ThemeSelector() {
  const [state, formAction] = useFormState(getThemeSuggestion, initialState);

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
        <Textarea
          name="themeDescription"
          placeholder="e.g., a futuristic cyberpunk theme with neon lights and a rainy city vibe..."
          className="min-h-[100px] bg-background"
          required
        />
        <SubmitButton />
      </form>

      {state.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.suggestion && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Theme Suggestion</AlertTitle>
          <AlertDescription>
            {state.suggestion}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
