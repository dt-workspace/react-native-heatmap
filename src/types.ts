/**
 * Core TypeScript interfaces for React Native Heatmap component
 */

import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';

/**
 * Base data structure for heatmap cells
 */
export interface HeatmapData {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Numeric value for the heatmap cell */
  value: number;
  /** Optional metadata for additional information */
  metadata?: Record<string, any>;
}

/**
 * Color scheme configuration for heatmap visualization
 */
export interface ColorScheme {
  /** Unique identifier for the color scheme */
  name: string;
  /** Array of colors from low to high values */
  colors: string[];
  /** Number of color levels (defaults to colors.length) */
  levels?: number;
  /** Color interpolation method */
  interpolation?: 'linear' | 'exponential' | 'logarithmic';
  /** Color for empty/no-data cells */
  emptyColor?: string;
}

/**
 * Theme configuration for overall appearance
 */
export interface Theme {
  /** Color palette */
  colors: {
    /** Background color */
    background: string;
    /** Text color */
    text: string;
    /** Border color */
    border: string;
    /** Tooltip background */
    tooltip: string;
    /** Tooltip text */
    tooltipText: string;
  };
  /** Spacing configuration */
  spacing: {
    /** Spacing between cells */
    cell: number;
    /** Margin around the heatmap */
    margin: number;
    /** Internal padding */
    padding: number;
  };
  /** Typography settings */
  typography: {
    /** Font size for labels */
    fontSize: number;
    /** Font weight */
    fontWeight: string;
    /** Font family */
    fontFamily: string;
  };
}

/**
 * Accessibility configuration
 */
export interface AccessibilityProps {
  /** Accessibility label for the entire heatmap */
  label?: string;
  /** Accessibility hint */
  hint?: string;
  /** ARIA role */
  role?: string;
  /** Accessibility states */
  states?: {
    selected?: boolean;
    disabled?: boolean;
    expanded?: boolean;
  };
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Enable/disable animations */
  enabled: boolean;
  /** Animation duration in milliseconds */
  duration: number;
  /** Animation easing function */
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  /** Stagger delay between cell animations */
  staggerDelay?: number;
  /** Entry animation type */
  entryAnimation?: 'fade' | 'scale' | 'slide' | 'none';
  /** Use native driver for performance */
  useNativeDriver?: boolean;
}

/**
 * Tooltip configuration
 */
export interface TooltipConfig {
  /** Enable/disable tooltips */
  enabled: boolean;
  /** Custom tooltip content renderer */
  content?: (data: HeatmapData) => ReactNode;
  /** Tooltip position */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  /** Tooltip offset from cell */
  offset?: number;
  /** Show tooltip arrow */
  showArrow?: boolean;
  /** Tooltip background color */
  backgroundColor?: string;
  /** Tooltip text color */
  textColor?: string;
  /** Tooltip font size */
  fontSize?: number;
  /** Tooltip padding */
  padding?: number;
  /** Tooltip border radius */
  borderRadius?: number;
  /** Tooltip shadow */
  shadow?: boolean;
}

/**
 * Layout configuration options
 */
export type LayoutType =
  | 'calendar'
  | 'grid'
  | 'compact'
  | 'custom'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'customRange'
  | 'timelineScroll'
  | 'realTime';

/**
 * Gesture configuration
 */
export interface GestureConfig {
  /** Enable/disable gestures */
  enabled: boolean;
  /** Enable pan gesture */
  pan?: boolean;
  /** Enable zoom gesture */
  zoom?: boolean;
  /** Enable swipe gesture */
  swipe?: boolean;
  /** Minimum zoom scale */
  minZoom?: number;
  /** Maximum zoom scale */
  maxZoom?: number;
  /** Haptic feedback on touch */
  hapticFeedback?: boolean;
}

/**
 * Cell shape options
 */
export type CellShape = 'square' | 'circle' | 'rounded' | 'custom';

/**
 * Main props interface for the Heatmap component
 */
export interface HeatmapProps {
  /** Array of heatmap data points */
  data: HeatmapData[];

  /** Dimensions */
  /** Width of the heatmap (optional, defaults to container width) */
  width?: number;
  /** Height of the heatmap (optional, calculated based on layout) */
  height?: number;

  /** Cell configuration */
  /** Size of each cell in pixels */
  cellSize?: number;
  /** Spacing between cells */
  cellSpacing?: number;
  /** Shape of cells */
  cellShape?: CellShape;

  /** Layout and appearance */
  /** Layout type for the heatmap */
  layout?: LayoutType;
  /** Color scheme for visualization */
  colorScheme?: ColorScheme | string;
  /** Theme configuration */
  theme?: Partial<Theme>;
  /** Time-based layout configuration */
  timeLayoutConfig?: Partial<TimeLayoutConfig>;

  /** Date range */
  /** Start date for calendar layout */
  startDate?: Date;
  /** End date for calendar layout */
  endDate?: Date;
  /** Number of days to display (alternative to end date) */
  numDays?: number;

  /** Interaction handlers */
  /** Called when a cell is pressed */
  onCellPress?: (data: HeatmapData, index: number) => void;
  /** Called when a cell is long pressed */
  onCellLongPress?: (data: HeatmapData, index: number) => void;
  /** Called when a cell is pressed in */
  onCellPressIn?: (data: HeatmapData, index: number) => void;
  /** Called when a cell is pressed out */
  onCellPressOut?: (data: HeatmapData, index: number) => void;
  /** Called when a cell is double pressed */
  onCellDoublePress?: (data: HeatmapData, index: number) => void;

  /** Tooltip configuration */
  /** Tooltip settings */
  tooltip?: TooltipConfig;
  /** Legacy: show tooltip (use tooltip.enabled instead) */
  showTooltip?: boolean;
  /** Legacy: tooltip content (use tooltip.content instead) */
  tooltipContent?: (data: HeatmapData) => ReactNode;

  /** Animation */
  /** Enable animations */
  animated?: boolean;
  /** Animation configuration */
  animation?: Partial<AnimationConfig>;
  /** Legacy: animation duration (use animation.duration instead) */
  animationDuration?: number;

  /** Gesture configuration */
  gesture?: Partial<GestureConfig>;
  /** Enable pan gesture */
  panEnabled?: boolean;
  /** Enable zoom gesture */
  zoomEnabled?: boolean;
  /** Enable haptic feedback */
  hapticFeedback?: boolean;

  /** Accessibility */
  /** Accessibility configuration */
  accessibility?: AccessibilityProps;

  /** Advanced configuration */
  /** Show month labels (calendar layout) */
  showMonthLabels?: boolean;
  /** Show weekday labels (calendar layout) */
  showWeekdayLabels?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';

  /** Grid configuration (for grid layout) */
  /** Number of columns (grid layout) */
  columns?: number;
  /** Number of rows (grid layout) */
  rows?: number;

  /** Time-based layout configuration */
  /** Target date for daily/weekly layouts */
  targetDate?: Date;
  /** Time zone for time-based layouts */
  timeZone?: string;
  /** Hour format for daily layouts */
  hourFormat?: '12h' | '24h';
  /** Show time labels */
  showTimeLabels?: boolean;
  /** Scroll direction for timeline layouts */
  scrollDirection?: 'horizontal' | 'vertical';
  /** Real-time update interval (milliseconds) */
  updateInterval?: number;
  /** Custom range configuration */
  customRange?: {
    start: Date;
    end: Date;
    granularity: 'hour' | 'day' | 'week' | 'month';
  };

  /** Performance */
  /** Enable virtualization for large datasets */
  virtualized?: boolean;
  /** Render buffer size for virtualization */
  renderBuffer?: number;

  /** Style overrides */
  /** Custom styles for the container */
  style?: any;
  /** Custom styles for cells */
  cellStyle?: any;
  /** Custom styles for labels */
  labelStyle?: any;
}

/**
 * Internal cell data with calculated properties
 */
export interface ProcessedCellData extends HeatmapData {
  /** X position in the grid */
  x: number;
  /** Y position in the grid */
  y: number;
  /** Calculated color for the cell */
  color: string;
  /** Whether the cell is empty/has no data */
  isEmpty: boolean;
  /** Normalized value (0-1) for color calculation */
  normalizedValue: number;
  /** Week of year (for calendar layout) */
  week?: number;
  /** Day of week (0-6, for calendar layout) */
  dayOfWeek?: number;
}

/**
 * Calendar layout specific data
 */
export interface CalendarLayoutData {
  /** Weeks in the date range */
  weeks: number;
  /** Days data organized by week and day */
  weekData: ProcessedCellData[][];
  /** Month boundaries */
  monthBoundaries: Array<{
    month: string;
    x: number;
    width: number;
  }>;
}

/**
 * Time-based layout configurations
 */
export interface TimeLayoutConfig {
  /** Time zone for time-based layouts */
  timeZone?: string;
  /** Format for time labels */
  timeFormat?: '12h' | '24h';
  /** Show time labels */
  showTimeLabels?: boolean;
  /** Show date labels */
  showDateLabels?: boolean;
  /** Scroll direction for timeline layouts */
  scrollDirection?: 'horizontal' | 'vertical';
  /** Auto-scroll for real-time layouts */
  autoScroll?: boolean;
  /** Update interval for real-time layouts (in milliseconds) */
  updateInterval?: number;
}

/**
 * Daily layout specific data (24-hour grid)
 */
export interface DailyLayoutData {
  /** Hours in the day (0-23) */
  hours: number;
  /** Hour data organized by hour */
  hourData: ProcessedCellData[];
  /** Time boundaries */
  timeBoundaries: Array<{
    hour: string;
    x: number;
    width: number;
  }>;
}

/**
 * Weekly layout specific data (7-day activity)
 */
export interface WeeklyLayoutData {
  /** Days in the week (0-6) */
  days: number;
  /** Day data organized by day of week */
  dayData: ProcessedCellData[];
  /** Day boundaries */
  dayBoundaries: Array<{
    day: string;
    x: number;
    width: number;
  }>;
}

/**
 * Monthly layout specific data
 */
export interface MonthlyLayoutData {
  /** Days in the month */
  daysInMonth: number;
  /** Month data organized by day */
  monthData: ProcessedCellData[][];
  /** Week boundaries */
  weekBoundaries: Array<{
    week: number;
    x: number;
    width: number;
  }>;
}

/**
 * Yearly layout specific data
 */
export interface YearlyLayoutData {
  /** Months in the year */
  months: number;
  /** Year data organized by month */
  yearData: ProcessedCellData[][];
  /** Month boundaries */
  monthBoundaries: Array<{
    month: string;
    x: number;
    width: number;
  }>;
}

/**
 * Custom range layout specific data
 */
export interface CustomRangeLayoutData {
  /** Start date of the range */
  startDate: Date;
  /** End date of the range */
  endDate: Date;
  /** Range data organized by time period */
  rangeData: ProcessedCellData[];
  /** Time period boundaries */
  periodBoundaries: Array<{
    period: string;
    x: number;
    width: number;
  }>;
}

/**
 * Timeline scroll layout specific data
 */
export interface TimelineScrollLayoutData {
  /** Total scroll width/height */
  totalScrollSize: number;
  /** Timeline data organized by time chunks */
  timelineData: ProcessedCellData[][];
  /** Scroll position markers */
  scrollMarkers: Array<{
    timestamp: string;
    position: number;
    label: string;
  }>;
}

/**
 * Real-time layout specific data
 */
export interface RealTimeLayoutData {
  /** Current time window */
  currentWindow: {
    start: Date;
    end: Date;
  };
  /** Real-time data buffer */
  dataBuffer: ProcessedCellData[];
  /** Update queue for new data */
  updateQueue: ProcessedCellData[];
  /** Live indicators */
  liveIndicators: Array<{
    timestamp: Date;
    position: number;
    active: boolean;
  }>;
}

/**
 * CardLayout component interfaces
 */

/**
 * Badge component configuration
 */
export interface BadgeConfig {
  /** Badge text */
  text: string;
  /** Badge color */
  color?: string;
  /** Badge background color */
  backgroundColor?: string;
  /** Badge size */
  size?: 'small' | 'medium' | 'large';
  /** Badge style */
  style?: ViewStyle;
  /** Badge text style */
  textStyle?: TextStyle;
}

/**
 * Card section configuration
 */
export interface CardSectionConfig {
  /** Whether the section is visible */
  visible?: boolean;
  /** Section order/position */
  order?: number;
  /** Section style */
  style?: ViewStyle;
  /** Section padding */
  padding?: number;
  /** Section margin */
  margin?: number;
}

/**
 * Card layout configuration
 */
export interface CardLayoutConfig {
  /** Card width */
  width?: number;
  /** Card height */
  height?: number;
  /** Card background color */
  backgroundColor?: string;
  /** Card border color */
  borderColor?: string;
  /** Card border width */
  borderWidth?: number;
  /** Card border radius */
  borderRadius?: number;
  /** Card shadow */
  shadow?: boolean;
  /** Card elevation (Android) */
  elevation?: number;
  /** Card padding */
  padding?: number;
  /** Card margin */
  margin?: number;
  /** Card style */
  style?: ViewStyle;
}

/**
 * Card Layout component props
 */
export interface CardLayoutProps {
  /** Title - can be string or custom component */
  title?: string | ReactNode;
  /** Title style */
  titleStyle?: TextStyle;
  /** Title container style */
  titleContainerStyle?: ViewStyle;
  /** Title section configuration */
  titleSection?: CardSectionConfig;

  /** Description - can be string or custom component */
  description?: string | ReactNode;
  /** Description style */
  descriptionStyle?: TextStyle;
  /** Description container style */
  descriptionContainerStyle?: ViewStyle;
  /** Description section configuration */
  descriptionSection?: CardSectionConfig;

  /** Badges component - optional */
  badges?: ReactNode;
  /** Badges array for default badge renderer */
  badgesArray?: BadgeConfig[];
  /** Badges container style */
  badgesContainerStyle?: ViewStyle;
  /** Badges section configuration */
  badgesSection?: CardSectionConfig;

  /** Custom component - fully customizable area */
  customComponent?: ReactNode;
  /** Custom component container style */
  customComponentContainerStyle?: ViewStyle;
  /** Custom component section configuration */
  customComponentSection?: CardSectionConfig;

  /** Hitman (footer/action) - always rendered at the end */
  hitman?: ReactNode;
  /** Hitman container style */
  hitmanContainerStyle?: ViewStyle;
  /** Hitman section configuration */
  hitmanSection?: CardSectionConfig;

  /** Card layout configuration */
  cardLayout?: CardLayoutConfig;

  /** Accessibility */
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Accessibility role */
  accessibilityRole?: string;

  /** Interaction handlers */
  /** Called when card is pressed */
  onPress?: () => void;
  /** Called when card is long pressed */
  onLongPress?: () => void;

  /** Animation */
  /** Enable card animations */
  animated?: boolean;
  /** Animation duration */
  animationDuration?: number;
  /** Animation type */
  animationType?: 'fade' | 'scale' | 'slide';

  /** Theme */
  /** Theme mode */
  theme?: 'light' | 'dark' | 'auto';
  /** Custom theme colors */
  themeColors?: {
    background?: string;
    text?: string;
    border?: string;
    shadow?: string;
  };

  /** Children (alternative to sections) */
  children?: ReactNode;

  /** Container style */
  style?: ViewStyle;

  /** Test ID for testing */
  testID?: string;
}

/**
 * Default card layout configuration
 */
export const DEFAULT_CARD_LAYOUT: CardLayoutConfig = {
  backgroundColor: '#ffffff',
  borderColor: '#e1e4e8',
  borderWidth: 1,
  borderRadius: 8,
  shadow: true,
  elevation: 2,
  padding: 16,
  margin: 8,
};

/**
 * Default card section configuration
 */
export const DEFAULT_CARD_SECTION: CardSectionConfig = {
  visible: true,
  order: 0,
  padding: 8,
  margin: 4,
};

/**
 * Predefined color schemes
 */
export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  github: {
    name: 'github',
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    emptyColor: '#ebedf0',
  },
  githubDark: {
    name: 'githubDark',
    colors: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    emptyColor: '#161b22',
  },
  heat: {
    name: 'heat',
    colors: [
      '#ffffcc',
      '#ffeda0',
      '#fed976',
      '#feb24c',
      '#fd8d3c',
      '#fc4e2a',
      '#e31a1c',
      '#b10026',
    ],
    emptyColor: '#f0f0f0',
  },
  cool: {
    name: 'cool',
    colors: [
      '#f7fbff',
      '#deebf7',
      '#c6dbef',
      '#9ecae1',
      '#6baed6',
      '#4292c6',
      '#2171b5',
      '#084594',
    ],
    emptyColor: '#f7fbff',
  },
  purple: {
    name: 'purple',
    colors: [
      '#fcfbfd',
      '#efedf5',
      '#dadaeb',
      '#bcbddc',
      '#9e9ac8',
      '#807dba',
      '#6a51a3',
      '#4a1486',
    ],
    emptyColor: '#fcfbfd',
  },
  green: {
    name: 'green',
    colors: [
      '#f7fcf5',
      '#e5f5e0',
      '#c7e9c0',
      '#a1d99b',
      '#74c476',
      '#41ab5d',
      '#238b45',
      '#005a32',
    ],
    emptyColor: '#f7fcf5',
  },
  orange: {
    name: 'orange',
    colors: [
      '#fff5eb',
      '#fee6ce',
      '#fdd0a2',
      '#fdae6b',
      '#fd8d3c',
      '#f16913',
      '#d94801',
      '#8c2d04',
    ],
    emptyColor: '#fff5eb',
  },
  red: {
    name: 'red',
    colors: [
      '#fff5f0',
      '#fee0d2',
      '#fcbba1',
      '#fc9272',
      '#fb6a4a',
      '#ef3b2c',
      '#cb181d',
      '#99000d',
    ],
    emptyColor: '#fff5f0',
  },
  blue: {
    name: 'blue',
    colors: [
      '#f7fbff',
      '#deebf7',
      '#c6dbef',
      '#9ecae1',
      '#6baed6',
      '#4292c6',
      '#2171b5',
      '#084594',
    ],
    emptyColor: '#f7fbff',
  },
  grayscale: {
    name: 'grayscale',
    colors: [
      '#ffffff',
      '#f0f0f0',
      '#d9d9d9',
      '#bdbdbd',
      '#969696',
      '#737373',
      '#525252',
      '#252525',
    ],
    emptyColor: '#ffffff',
  },
  // New color schemes for v1.1.0
  gitlab: {
    name: 'gitlab',
    colors: ['#fdf2e9', '#fad5a5', '#ee8f00', '#d16000', '#a04100'],
    emptyColor: '#fdf2e9',
  },
  bitbucket: {
    name: 'bitbucket',
    colors: ['#e6f3ff', '#b3d9ff', '#4d94ff', '#0066cc', '#004d99'],
    emptyColor: '#e6f3ff',
  },
  accessible: {
    name: 'accessible',
    colors: ['#ffffff', '#ffcc00', '#ff9900', '#ff6600', '#cc0000'],
    emptyColor: '#ffffff',
  },
  neon: {
    name: 'neon',
    colors: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    emptyColor: '#0a0a0a',
  },
  sunset: {
    name: 'sunset',
    colors: ['#ffeaa7', '#fdcb6e', '#e17055', '#d63031', '#a29bfe'],
    emptyColor: '#ffeaa7',
  },
};

/**
 * Default theme configuration
 */
export const DEFAULT_THEME: Theme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    border: '#e1e4e8',
    tooltip: '#1b1f23',
    tooltipText: '#ffffff',
  },
  spacing: {
    cell: 2,
    margin: 10,
    padding: 5,
  },
  typography: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'System',
  },
};

/**
 * Default dark theme configuration
 */
export const DARK_THEME: Theme = {
  colors: {
    background: '#0d1117',
    text: '#f0f6fc',
    border: '#30363d',
    tooltip: '#f0f6fc',
    tooltipText: '#0d1117',
  },
  spacing: {
    cell: 2,
    margin: 10,
    padding: 5,
  },
  typography: {
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'System',
  },
};
