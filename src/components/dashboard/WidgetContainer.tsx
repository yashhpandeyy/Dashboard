'use client';

import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
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
  toggleWidgetBackground: (id: string) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export function WidgetContainer({ 
  widget, 
  children, 
  updateWidgetPosition, 
  updateWidgetSize, 
  toggleWidgetLock,
  toggleWidgetBackground,
  onDragStart,
  onDragEnd,
}: WidgetContainerProps) {
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialWidgetPos = useRef<{ x: number; y: number } | null>(null);

  const resizeStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialWidgetSize = useRef<{ width: number; height: number } | null>(null);

  // Dragging logic
  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (widget.isLocked || e.button !== 0) return;

    onDragStart();
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
    onDragEnd();
    dragStartPos.current = null;
    initialWidgetPos.current = null;
    document.removeEventListener('mousemove', handleDragMouseMove);
    document.removeEventListener('mouseup', handleDragMouseUp);
  };

  // Resizing logic
  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent triggering the drag handler
    if (widget.isLocked || e.button !== 0) return;

    onDragStart();
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
    onDragEnd();
    resizeStartPos.current = null;
    initialWidgetSize.current = null;
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  };

  const handleDoubleClick = () => {
    toggleWidgetBackground(widget.id);
  };
  
  const isLocked = widget.isLocked ?? false;
  const backgroundDisabled = widget.backgroundDisabled ?? false;

  return (
    <div
      className={cn(
        "absolute flex flex-col rounded-xl transition-all",
        !backgroundDisabled && "bg-black/5 backdrop-blur-lg border border-white/10 shadow-lg",
        !isLocked && 'cursor-grab active:cursor-grabbing'
      )}
      style={{
        transform: `translate(${widget.position.x}px, ${widget.position.y}px)`,
        width: `${widget.size?.width ?? 280}px`,
        height: `${widget.size?.height ?? 150}px`,
      }}
      onMouseDown={handleDragMouseDown}
      onDoubleClick={handleDoubleClick}
    >
       {!isLocked && (
         <div className="absolute top-1/2 left-2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10" onMouseDown={(e) => {
           // Allow drag handle to work, but don't propagate to the whole card
           e.stopPropagation();
           handleDragMouseDown(e);
         }}>
           <GripVertical className="h-5 w-5 text-muted-foreground/50" />
         </div>
       )}
       {!backgroundDisabled && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-7 w-7 z-10"
          onClick={(e) => {
             e.stopPropagation();
             toggleWidgetLock(widget.id);
          }}
           onMouseDown={(e) => e.stopPropagation()} // Prevent card drag
        >
          {isLocked ? <CircleDot className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
          <span className="sr-only">{isLocked ? 'Unlock' : 'Lock'} widget</span>
        </Button>
       )}

      <div className="flex-grow h-full overflow-hidden rounded-xl">{children}</div>
      {!isLocked && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize touch-none z-10"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
