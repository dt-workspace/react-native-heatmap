// Export main component
export { default as Heatmap } from './components/Heatmap';

// Export types
export type {
  HeatmapProps,
  HeatmapData,
  ColorScheme,
  Theme,
  AccessibilityProps,
  AnimationConfig,
  TooltipConfig,
  ProcessedCellData,
  CalendarLayoutData,
  LayoutType,
  CellShape,
} from './types';

// Export color schemes and themes
export { COLOR_SCHEMES, DEFAULT_THEME, DARK_THEME } from './types';

// Export utilities
export {
  generateDateRange,
  formatDateISO,
  parseISODate,
  processHeatmapData,
  calculateCalendarLayout,
  calculateGridDimensions,
  calculateHeatmapDimensions,
  resolveColorScheme,
} from './utils';
