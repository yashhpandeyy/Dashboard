'use client';

import { useState, useEffect } from 'react';

export function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-5xl font-bold tracking-wider text-foreground tabular-nums">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </h2>
        <p className="text-sm text-muted-foreground">
          {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}
