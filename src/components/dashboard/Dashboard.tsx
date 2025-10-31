'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WidgetInstance, WidgetType } from '@/lib/types';
import { WidgetContainer } from './WidgetContainer';
import { WidgetToolbar } from './WidgetToolbar';
import { ClockWidget } from './widgets/ClockWidget';
import { SearchWidget } from './widgets/SearchWidget';
import { TabsWidget } from './widgets/TabsWidget';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WIDGET_COMPONENTS: Record<WidgetType, React.ComponentType> = {
  Clock: ClockWidget,
  Search: SearchWidget,
  Tabs: TabsWidget,
};

const LOCAL_STORAGE_KEY = 'dark-knight-dashboard-layout';

export default function Dashboard() {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLayout = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedLayout) {
        setWidgets(JSON.parse(savedLayout));
      } else {
        // Default layout for new users
        setWidgets([
          { id: `widget-${Date.now()}`, type: 'Clock', position: { x: 100, y: 100 }, isLocked: false },
        ]);
      }
    } catch (error) {
        console.error("Failed to parse layout from localStorage", error);
         setWidgets([
          { id: `widget-default`, type: 'Clock', position: { x: 100, y: 100 }, isLocked: false },
        ]);
    }
  }, []);

  const addWidget = useCallback((type: WidgetType) => {
    const newWidget: WidgetInstance = {
      id: `widget-${Date.now()}`,
      type,
      position: { x: 50, y: 50 }, // Default position
      isLocked: false,
    };
    setWidgets((prev) => [...prev, newWidget]);
  }, []);

  const updateWidgetPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, position } : widget
      )
    );
  }, []);

  const toggleWidgetLock = useCallback((id: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === id ? { ...widget, isLocked: !widget.isLocked } : widget
      )
    );
  }, []);

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(widgets));
    toast({
      title: 'Layout Saved',
      description: 'Your widget layout has been saved.',
    });
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <>
      <WidgetToolbar addWidget={addWidget} />
      
      {widgets.map((widget) => {
        const WidgetComponent = WIDGET_COMPONENTS[widget.type];
        return (
          <WidgetContainer
            key={widget.id}
            widget={widget}
            updateWidgetPosition={updateWidgetPosition}
            toggleWidgetLock={toggleWidgetLock}
          >
            {WidgetComponent ? <WidgetComponent /> : <div>Unknown Widget</div>}
          </WidgetContainer>
        );
      })}

      <Button
        variant="secondary"
        size="lg"
        className="absolute bottom-6 right-6 z-20 h-14 shadow-lg"
        onClick={handleSave}
      >
        <Save className="mr-2 h-5 w-5" />
        Save Layout
      </Button>
    </>
  );
}
