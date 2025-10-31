'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { getSearchSuggestions } from '@/app/actions';
import { useDebounce } from '@/hooks/use-debounce';

export function SearchWidget() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery) {
        setIsLoading(true);
        const results = await getSearchSuggestions(debouncedQuery);
        setSuggestions(results);
        setIsLoading(false);
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, '_blank');
      setQuery('');
      setSuggestions([]);
      formRef.current?.reset();
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(query);
  };
  
  const onSuggestionClick = (suggestion: string) => {
      setQuery(suggestion);
      handleSearch(suggestion);
  };

  return (
    <div className="flex h-full w-full flex-col p-4">
      <form ref={formRef} onSubmit={onFormSubmit} className="flex w-full items-center gap-2">
        <Input
          type="search"
          name="search"
          placeholder="Search the web..."
          className="flex-grow bg-black/30 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
        <Button type="submit" size="icon" variant="secondary">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
      {(isLoading || suggestions.length > 0) && (
        <div className="mt-2 flex-grow overflow-y-auto rounded-md bg-black/20 p-2">
            {isLoading && suggestions.length === 0 ? (
                 <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                 </div>
            ) : (
                <ul className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-1.5 px-2"
                        onClick={() => onSuggestionClick(suggestion)}
                        >
                        {suggestion}
                        </Button>
                    </li>
                    ))}
                </ul>
            )}
        </div>
      )}
    </div>
  );
}
