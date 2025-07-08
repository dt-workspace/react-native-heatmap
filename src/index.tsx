// Export main component
export { default as Heatmap } from './components/Heatmap';

// Export additional components
export { default as Tooltip } from './components/Tooltip';
export { default as AnimatedCell } from './components/AnimatedCell';
export { default as CardLayout } from './components/CardLayout';

// Export types
export type {
  HeatmapProps,
  HeatmapData,
  ColorScheme,
  Theme,
  AccessibilityProps,
  AnimationConfig,
  TooltipConfig,
  GestureConfig,
  ProcessedCellData,
  CalendarLayoutData,
  LayoutType,
  CellShape,
  // Time-based layout types
  DailyLayoutData,
  WeeklyLayoutData,
  MonthlyLayoutData,
  YearlyLayoutData,
  CustomRangeLayoutData,
  TimelineScrollLayoutData,
  RealTimeLayoutData,
  TimeLayoutConfig,
  // CardLayout types
  CardLayoutProps,
  CardLayoutConfig,
  CardSectionConfig,
  BadgeConfig,
} from './types';

// Export color schemes and themes
export {
  COLOR_SCHEMES,
  DEFAULT_THEME,
  DARK_THEME,
  DEFAULT_CARD_LAYOUT,
  DEFAULT_CARD_SECTION,
} from './types';

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
  // Time-based layout utilities
  calculateDailyLayout,
  calculateWeeklyLayout,
  calculateMonthlyLayout,
  calculateYearlyLayout,
  calculateCustomRangeLayout,
  calculateTimelineScrollLayout,
  calculateRealTimeLayout,
} from './utils';
