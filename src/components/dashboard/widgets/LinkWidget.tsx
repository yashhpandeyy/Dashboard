'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Check, ExternalLink } from 'lucide-react';

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
        className="relative flex h-full w-full cursor-pointer items-center justify-center p-4 group"
        onClick={() => window.open(widgetData?.url, '_blank')}
    >
      <h3 className="text-xl font-bold text-center text-foreground break-all">
        {widgetData?.title}
      </h3>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 left-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
        }}
      >
        <Settings className="h-4 w-4" />
      </Button>
      <ExternalLink className="absolute bottom-2 right-2 h-4 w-4 text-muted-foreground/50" />
    </div>
  );
}
