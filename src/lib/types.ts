export type WidgetType = 'Clock' | 'Search' | 'Tabs' | 'Countdown' | 'Link';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isLocked?: boolean;
  backgroundDisabled?: boolean;
  data?: any;
}
