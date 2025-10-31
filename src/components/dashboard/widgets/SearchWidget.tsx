'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchWidget() {
  const [query, setQuery] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, '_blank');
      setQuery('');
      formRef.current?.reset();
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="flex h-full w-full flex-col justify-center p-4">
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
    </div>
  );
}
