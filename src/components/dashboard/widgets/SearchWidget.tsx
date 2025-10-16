'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function SearchWidget() {
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank');
      event.currentTarget.reset();
    }
  };

  return (
    <div className="flex h-full w-full items-center p-4">
      <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
        <Input
          type="search"
          name="search"
          placeholder="Search the web..."
          className="flex-grow bg-black/30 text-base"
        />
        <Button type="submit" size="icon" variant="secondary">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </div>
  );
}
