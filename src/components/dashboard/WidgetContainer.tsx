'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import type { WidgetInstance } from '@/lib/types';
import { GripVertical } from 'lucide-react';

interface WidgetContainerProps {
  widget: WidgetInstance;
  children: ReactNode;
  updateWidgetPosition: (id: string, position: { x: number; y: number }) => void;
}

export function WidgetContainer({ widget, children, updateWidgetPosition }: WidgetContainerProps) {
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const initialWidgetPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent drag on right-click
    if (e.button !== 0) return;

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

  return (
    <div
      className="absolute flex flex-col bg-card/10 backdrop-blur-md border border-primary/20 rounded-xl shadow-lg"
      style={{
        transform: `translate(${widget.position.x}px, ${widget.position.y}px)`,
        minWidth: '280px',
        minHeight: '150px',
      }}
    >
      <div
        className="flex h-8 cursor-grab items-center justify-center rounded-t-xl bg-black/20 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
