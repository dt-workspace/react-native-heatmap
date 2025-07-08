/**
 * Utility functions for heatmap calculations and data processing
 */

import type {
  HeatmapData,
  ProcessedCellData,
  ColorScheme,
  CalendarLayoutData,
} from '../types';
import { COLOR_SCHEMES } from '../types';

/**
 * Generate date range between start and end dates
 */
export function generateDateRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(formatDateISO(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0] as string;
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z');
}

/**
 * Get week number of the year
 */
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Normalize value to 0-1 range based on min/max values
 */
export function normalizeValue(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) return value > 0 ? 1 : 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Calculate color based on normalized value and color scheme
 */
export function calculateColor(
  normalizedValue: number,
  colorScheme: ColorScheme,
  isEmpty: boolean = false
): string {
  if (isEmpty || normalizedValue === 0) {
    return colorScheme.emptyColor || colorScheme.colors[0] || '#f0f0f0';
  }

  const colors = colorScheme.colors;
  const levels = colorScheme.levels || colors.length;

  if (normalizedValue >= 1) {
    return colors[colors.length - 1] as string;
  }

  // Linear interpolation between colors
  const scaledValue = normalizedValue * (levels - 1);
  const lowerIndex = Math.floor(scaledValue);
  const upperIndex = Math.min(lowerIndex + 1, colors.length - 1);
  const factor = scaledValue - lowerIndex;

  if (factor === 0 || lowerIndex === upperIndex) {
    return colors[lowerIndex] as string;
  }

  // Simple color interpolation (you might want to use a more sophisticated color library)
  return interpolateColor(
    colors[lowerIndex] as string,
    colors[upperIndex] as string,
    factor
  );
}

/**
 * Simple linear interpolation between two hex colors
 */
function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Resolve color scheme from string or object
 */
export function resolveColorScheme(
  colorScheme: ColorScheme | string
): ColorScheme {
  if (typeof colorScheme === 'string') {
    const predefined = COLOR_SCHEMES[colorScheme];
    if (predefined) {
      return predefined;
    }
    // Fallback to github scheme if not found
    return COLOR_SCHEMES.github as ColorScheme;
  }
  return colorScheme;
}

/**
 * Process raw heatmap data into processed cell data
 */
export function processHeatmapData(
  data: HeatmapData[],
  startDate: Date,
  endDate: Date,
  colorScheme: ColorScheme | string,
  layout: 'calendar' | 'grid' | 'compact' | 'custom' = 'calendar'
): ProcessedCellData[] {
  const resolvedColorScheme = resolveColorScheme(colorScheme);
  const dateRange = generateDateRange(startDate, endDate);

  // Create a map for quick lookup
  const dataMap = new Map<string, HeatmapData>();
  data.forEach((item) => {
    dataMap.set(item.date, item);
  });

  // Find min/max values for normalization
  const values = data
    .map((item) => item.value)
    .filter((value) => value !== undefined && value !== null);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);

  // Process each date in the range
  const processedData: ProcessedCellData[] = dateRange.map(
    (dateString, index) => {
      const dataPoint = dataMap.get(dateString);
      const isEmpty =
        !dataPoint || dataPoint.value === undefined || dataPoint.value === null;
      const value = isEmpty ? 0 : dataPoint.value;
      const normalizedValue = normalizeValue(value, minValue, maxValue);
      const color = calculateColor(
        normalizedValue,
        resolvedColorScheme,
        isEmpty
      );

      const date = parseISODate(dateString);

      let x: number, y: number;

      if (layout === 'calendar') {
        // Calendar layout: arrange by weeks and days
        const daysSinceStart = Math.floor(
          (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
        );
        const weeksSinceStart = Math.floor(daysSinceStart / 7);
        x = weeksSinceStart;
        y = getDayOfWeek(date);
      } else if (layout === 'grid') {
        // Grid layout: simple row/column arrangement
        const columns = Math.ceil(Math.sqrt(dateRange.length));
        x = index % columns;
        y = Math.floor(index / columns);
      } else if (layout === 'compact') {
        // Compact layout: single row
        x = index;
        y = 0;
      } else {
        // Custom layout: fallback to grid
        const columns = Math.ceil(Math.sqrt(dateRange.length));
        x = index % columns;
        y = Math.floor(index / columns);
      }

      return {
        date: dateString,
        value,
        metadata: dataPoint?.metadata,
        x,
        y,
        color,
        isEmpty,
        normalizedValue,
        week: layout === 'calendar' ? getWeekNumber(date) : undefined,
        dayOfWeek: layout === 'calendar' ? getDayOfWeek(date) : undefined,
      };
    }
  );

  return processedData;
}

/**
 * Calculate calendar layout data with month boundaries
 */
export function calculateCalendarLayout(
  processedData: ProcessedCellData[],
  startDate: Date
): CalendarLayoutData {
  // Group data by weeks
  const weekData: ProcessedCellData[][] = [];
  const maxWeek = Math.max(...processedData.map((d) => d.x));

  for (let week = 0; week <= maxWeek; week++) {
    const weekCells = processedData.filter((d) => d.x === week);
    // Ensure we have 7 days in each week (fill missing days with empty cells)
    const fullWeek: ProcessedCellData[] = Array(7)
      .fill(null)
      .map((_, dayIndex) => {
        const existingCell = weekCells.find((d) => d.y === dayIndex);
        if (existingCell) return existingCell;

        // Create empty cell for missing days
        const cellDate = new Date(startDate);
        cellDate.setDate(cellDate.getDate() + week * 7 + dayIndex);

        return {
          date: formatDateISO(cellDate),
          value: 0,
          x: week,
          y: dayIndex,
          color: '#f0f0f0',
          isEmpty: true,
          normalizedValue: 0,
          week: getWeekNumber(cellDate),
          dayOfWeek: dayIndex,
        };
      });
    weekData.push(fullWeek);
  }

  // Calculate month boundaries
  const monthBoundaries: Array<{ month: string; x: number; width: number }> =
    [];
  let currentMonth = startDate.getMonth();
  let monthStart = 0;

  for (let week = 0; week <= maxWeek; week++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + week * 7);

    if (weekStart.getMonth() !== currentMonth || week === maxWeek) {
      if (monthBoundaries.length > 0 || week > 0) {
        const monthName = new Date(
          startDate.getFullYear(),
          currentMonth
        ).toLocaleDateString('en-US', { month: 'short' });
        monthBoundaries.push({
          month: monthName,
          x: monthStart,
          width: week - monthStart,
        });
      }
      currentMonth = weekStart.getMonth();
      monthStart = week;
    }
  }

  return {
    weeks: maxWeek + 1,
    weekData,
    monthBoundaries,
  };
}

/**
 * Calculate grid dimensions for layout
 */
export function calculateGridDimensions(
  dataLength: number,
  preferredColumns?: number,
  preferredRows?: number
): { columns: number; rows: number } {
  if (preferredColumns && preferredRows) {
    return { columns: preferredColumns, rows: preferredRows };
  }

  if (preferredColumns) {
    return {
      columns: preferredColumns,
      rows: Math.ceil(dataLength / preferredColumns),
    };
  }

  if (preferredRows) {
    return {
      columns: Math.ceil(dataLength / preferredRows),
      rows: preferredRows,
    };
  }

  // Default: try to make it roughly square
  const columns = Math.ceil(Math.sqrt(dataLength));
  const rows = Math.ceil(dataLength / columns);

  return { columns, rows };
}

/**
 * Calculate heatmap dimensions based on cell size and data
 */
export function calculateHeatmapDimensions(
  processedData: ProcessedCellData[],
  cellSize: number,
  cellSpacing: number,
  layout: 'calendar' | 'grid' | 'compact' | 'custom' = 'calendar',
  gridDimensions?: { columns: number; rows: number }
): { width: number; height: number } {
  if (layout === 'calendar') {
    const maxWeek = Math.max(...processedData.map((d) => d.x));
    const weeks = maxWeek + 1;
    const days = 7; // Always 7 days in calendar layout

    return {
      width: weeks * (cellSize + cellSpacing) - cellSpacing,
      height: days * (cellSize + cellSpacing) - cellSpacing,
    };
  }

  if (layout === 'compact') {
    return {
      width: processedData.length * (cellSize + cellSpacing) - cellSpacing,
      height: cellSize,
    };
  }

  // Grid layout or custom (fallback to grid)
  const { columns, rows } =
    gridDimensions || calculateGridDimensions(processedData.length);

  return {
    width: columns * (cellSize + cellSpacing) - cellSpacing,
    height: rows * (cellSize + cellSpacing) - cellSpacing,
  };
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export animation utilities
export * from './animation';

// Export gesture utilities
export * from './gestures';
