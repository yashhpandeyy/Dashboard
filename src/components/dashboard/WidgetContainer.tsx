'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import type { WidgetInstance } from '@/lib/types';
import { GripVertical, Circle, CircleDot } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface WidgetContainerProps {
  widget: WidgetInstance;
  children: ReactNode;
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
  toggleWidgetLock: (id: string) => void;
}

export function WidgetContainer({ widget, children, updateWidgetPosition, toggleWidgetLock }: WidgetContainerProps) {
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialWidgetPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (widget.isLocked || e.button !== 0) return;

    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialWidgetPos.current = widget.position;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStartPos.current || !initialWidgetPos.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    const newX = initialWidgetPos.current.x + dx;
    const newY = initialWidgetPos.current.y + dy;

    updateWidgetPosition(widget.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragStartPos.current = null;
    initialWidgetPos.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  const isLocked = widget.isLocked ?? false;

  return (
    <div
      className="absolute flex flex-col bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg"
      style={{
        transform: `translate(${widget.position.x}px, ${widget.position.y}px)`,
        minWidth: '280px',
        minHeight: '150px',
      }}
    >
        <div
            className={cn(
            'relative flex h-8 items-center justify-center rounded-t-xl bg-black/20',
            !isLocked && 'cursor-grab active:cursor-grabbing'
            )}
            onMouseDown={handleMouseDown}
        >
            {!isLocked && <GripVertical className="h-5 w-5 text-muted-foreground" />}
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => toggleWidgetLock(widget.id)}
            >
                {isLocked ? <CircleDot className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                <span className="sr-only">{isLocked ? 'Unlock' : 'Lock'} widget</span>
            </Button>
        </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
