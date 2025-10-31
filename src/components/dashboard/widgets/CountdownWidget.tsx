'use client';

import { useState, useEffect } from 'react';

export function CountdownWidget() {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      } else {
        setTimeLeft('00:00:00');
      }
    };
    
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-wider text-foreground tabular-nums">
          {timeLeft ?? 'Loading...'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Until Day End
        </p>
      </div>
    </div>
  );
}
