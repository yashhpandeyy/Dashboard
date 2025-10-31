'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, PlusCircle, Clock, Search, Link, Timer } from 'lucide-react';
import type { WidgetType } from '@/lib/types';
import { ThemeSelector } from './ThemeSelector';
import { Separator } from '../ui/separator';

interface WidgetToolbarProps {
  addWidget: (type: WidgetType) => void;
}

const availableWidgets: { type: WidgetType; name: string; icon: React.ElementType }[] = [
  { type: 'Clock', name: 'Clock', icon: Clock },
  { type: 'Search', name: 'Search Bar', icon: Search },
  { type: 'Tabs', name: 'Link Tabs', icon: Link },
  { type: 'Countdown', name: 'Day End Countdown', icon: Timer },
];

export function WidgetToolbar({ addWidget }: WidgetToolbarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Widgets Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] sm:w-[400px] bg-background/80 backdrop-blur-xl border-primary/20">
        <SheetHeader>
          <SheetTitle>Add Widgets</SheetTitle>
          <SheetDescription>
            Click a widget to add it to your dashboard.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-2">
          {availableWidgets.map(({ type, name, icon: Icon }) => (
            <Button
              key={type}
              variant="ghost"
              className="w-full justify-start text-base h-12"
              onClick={() => addWidget(type)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {name}
              <PlusCircle className="ml-auto h-5 w-5 text-primary" />
            </Button>
          ))}
        </div>
        <Separator className="my-4 bg-border" />
        <SheetHeader>
            <SheetTitle>AI Theme Assistant</SheetTitle>
            <SheetDescription>
                Describe a theme you like, and our AI will give you suggestions.
            </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <ThemeSelector />
        </div>
      </SheetContent>
    </Sheet>
  );
}
