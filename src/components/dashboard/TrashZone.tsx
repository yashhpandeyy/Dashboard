'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrashZoneProps {
  isDragging: boolean;
  onDrop: () => void;
}

export function TrashZone({ isDragging, onDrop }: TrashZoneProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onDrop();
    }
    setIsHovered(false);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed bottom-6 left-6 z-20 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-destructive/50 bg-destructive/10 text-destructive/80 transition-all duration-300',
        isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none',
        isHovered && isDragging && 'scale-125 bg-destructive/20 border-solid'
      )}
    >
      <Trash2 className="h-7 w-7" />
    </div>
  );
}
