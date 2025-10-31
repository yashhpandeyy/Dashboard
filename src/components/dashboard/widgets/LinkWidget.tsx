'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LinkWidgetProps {
    widgetData?: {
        title?: string;
        url?: string;
    };
    updateWidgetData: (data: { title: string; url: string }) => void;
}

export function LinkWidget({ widgetData, updateWidgetData }: LinkWidgetProps) {
  const [isEditing, setIsEditing] = useState(!widgetData?.url);
  const [title, setTitle] = useState(widgetData?.title || '');
  const [url, setUrl] = useState(widgetData?.url || '');

  const handleSave = () => {
    if (title && url) {
        let finalUrl = url;
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'https://' + finalUrl;
        }
        updateWidgetData({ title, url: finalUrl });
        setIsEditing(false);
    }
  };

  const getFaviconUrl = (link: string) => {
    try {
      const urlObject = new URL(link);
      return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`;
    } catch (error) {
      return null;
    }
  };
  
  const favicon = widgetData?.url ? getFaviconUrl(widgetData.url) : null;

  if (isEditing) {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-2 p-4">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/30"
          autoFocus
        />
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-black/30"
        />
        <Button onClick={handleSave} size="sm" variant="secondary" className="mt-1">
          <Check className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>
    );
  }

  return (
    <div 
        className="group relative flex h-full w-full cursor-pointer flex-col justify-between p-4"
        onClick={() => window.open(widgetData?.url, '_blank')}
    >
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 z-10"
            onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
            }}
        >
            <Settings className="h-4 w-4" />
        </Button>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                {favicon ? (
                    <img src={favicon} alt={`${widgetData?.title} favicon`} className="h-8 w-8 rounded-md" />
                ) : (
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center">
                        <LinkIcon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                )}
                <h3 className="text-xl font-bold text-foreground break-words pr-8">
                    {widgetData?.title}
                </h3>
            </div>
            
        </div>
        
        <div className="flex items-center gap-2 pt-2">
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <p className="truncate text-sm text-muted-foreground/70">{widgetData?.url?.replace(/^https?:\/\//, '')}</p>
        </div>
    </div>
  );
}
