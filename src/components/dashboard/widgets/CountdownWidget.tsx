'use client';

import { useState, useEffect } from 'react';

export function CountdownWidget() {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        const totalMinutes = Math.floor(difference / (1000 * 60));
        const seconds = Math.floor((difference / 1000) % 60);
        const milliseconds = Math.floor((difference % 1000) / 10);

        const formattedMinutes = totalMinutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        const formattedMilliseconds = milliseconds.toString().padStart(2, '0');

        setTimeLeft(`${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`);
      } else {
        setTimeLeft('00:00:00');
      }
      
      animationFrameId = requestAnimationFrame(calculateTimeLeft);
    };
    
    animationFrameId = requestAnimationFrame(calculateTimeLeft);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-wider text-foreground tabular-nums">
          {timeLeft ?? 'Loading...'}
        </h2>
        <p className="text-sm text-muted-foreground">
          Until Day End (MM:SS:ms)
        </p>
      </div>
    </div>
  );
}
