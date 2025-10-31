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
  updateWidgetSize: (id: string, size: { width: number; height: number }) => void;
  toggleWidgetLock: (id: string) => void;
}

export function WidgetContainer({ 
  widget, 
  children, 
  updateWidgetPosition, 
  updateWidgetSize, 
  toggleWidgetLock 
}: WidgetContainerProps) {
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialWidgetPos = useRef<{ x: number; y: number } | null>(null);

  const resizeStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialWidgetSize = useRef<{ width: number; height: number } | null>(null);

  // Dragging logic
  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (widget.isLocked || e.button !== 0) return;

    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialWidgetPos.current = widget.position;
    document.addEventListener('mousemove', handleDragMouseMove);
    document.addEventListener('mouseup', handleDragMouseUp);
  };

  const handleDragMouseMove = (e: MouseEvent) => {
    if (!dragStartPos.current || !initialWidgetPos.current) return;

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    const newX = initialWidgetPos.current.x + dx;
    const newY = initialWidgetPos.current.y + dy;

    updateWidgetPosition(widget.id, { x: newX, y: newY });
  };

  const handleDragMouseUp = () => {
    dragStartPos.current = null;
    initialWidgetPos.current = null;
    document.removeEventListener('mousemove', handleDragMouseMove);
    document.removeEventListener('mouseup', handleDragMouseUp);
  };

  // Resizing logic
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent triggering the drag handler
    if (widget.isLocked || e.button !== 0) return;

    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    initialWidgetSize.current = widget.size;
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizeStartPos.current || !initialWidgetSize.current) return;

    const dx = e.clientX - resizeStartPos.current.x;
    const dy = e.clientY - resizeStartPos.current.y;

    const newWidth = Math.max(280, initialWidgetSize.current.width + dx);
    const newHeight = Math.max(150, initialWidgetSize.current.height + dy);

    updateWidgetSize(widget.id, { width: newWidth, height: newHeight });
  };

  const handleResizeMouseUp = () => {
    resizeStartPos.current = null;
    initialWidgetSize.current = null;
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  };
  
  const isLocked = widget.isLocked ?? false;

  return (
    <div
      className="absolute flex flex-col bg-black/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg"
      style={{
        transform: `translate(${widget.position.x}px, ${widget.position.y}px)`,
        width: `${widget.size?.width ?? 280}px`,
        height: `${widget.size?.height ?? 150}px`,
      }}
    >
      <div
        className={cn(
          'relative flex h-8 items-center justify-center rounded-t-xl bg-black/20',
          !isLocked && 'cursor-grab active:cursor-grabbing'
        )}
        onMouseDown={handleDragMouseDown}
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
      <div className="flex-grow h-full overflow-hidden">{children}</div>
      {!isLocked && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize touch-none"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
