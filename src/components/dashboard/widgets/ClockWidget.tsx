'use client';

import { useState, useEffect } from 'react';

export function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formattedTime = time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '--:--';
  const formattedDate = time?.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) ?? 'Loading...';

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-5xl font-bold tracking-wider text-foreground tabular-nums">
          {formattedTime}
        </h2>
        <p className="text-sm text-muted-foreground">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
