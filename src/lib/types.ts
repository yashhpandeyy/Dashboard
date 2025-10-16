export type WidgetType = 'Clock' | 'Search' | 'Tabs';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  data?: any;
}
