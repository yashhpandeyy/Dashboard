'use client';

import { Button } from "@/components/ui/button";

const defaultTabs = [
  { name: "Code", url: "https://github.com" },
  { name: "Design", url: "https://dribbble.com" },
  { name: "Social", url: "https://twitter.com" },
  { name: "News", url: "https://news.ycombinator.com" },
];

export function TabsWidget() {
  return (
    <div className="flex h-full w-full flex-col justify-center p-4">
      <div className="grid grid-cols-2 gap-2">
        {defaultTabs.map((tab) => (
          <Button
            key={tab.name}
            variant="secondary"
            className="h-12 text-base"
            onClick={() => window.open(tab.url, '_blank')}
          >
            {tab.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
