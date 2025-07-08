/**
 * Utility functions for heatmap calculations and data processing
 */

import type {
  HeatmapData,
  ProcessedCellData,
  ColorScheme,
  CalendarLayoutData,
  DailyLayoutData,
  WeeklyLayoutData,
  MonthlyLayoutData,
  YearlyLayoutData,
  CustomRangeLayoutData,
  TimelineScrollLayoutData,
  RealTimeLayoutData,
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
  layout:
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
    | 'realTime' = 'calendar',
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

  if (layout === 'daily') {
    return {
      width: 24 * (cellSize + cellSpacing) - cellSpacing, // 24 hours
      height: cellSize,
    };
  }

  if (layout === 'weekly') {
    return {
      width: 7 * (cellSize + cellSpacing) - cellSpacing, // 7 days
      height: cellSize,
    };
  }

  if (layout === 'monthly') {
    return {
      width: 7 * (cellSize + cellSpacing) - cellSpacing, // 7 days per week
      height: 6 * (cellSize + cellSpacing) - cellSpacing, // Max 6 weeks per month
    };
  }

  if (layout === 'yearly') {
    return {
      width: 12 * 8 * (cellSize + cellSpacing) - cellSpacing, // 12 months, ~8 cells per month
      height: 7 * (cellSize + cellSpacing) - cellSpacing, // 7 days per week
    };
  }

  if (layout === 'customRange') {
    return {
      width: processedData.length * (cellSize + cellSpacing) - cellSpacing,
      height: cellSize,
    };
  }

  if (layout === 'timelineScroll') {
    // Calculate based on scroll direction
    const chunkSize = 24; // Default chunk size
    const chunks = Math.ceil(processedData.length / chunkSize);
    return {
      width: chunks * (cellSize + cellSpacing) - cellSpacing,
      height: chunkSize * (cellSize + cellSpacing) - cellSpacing,
    };
  }

  if (layout === 'realTime') {
    const windowSize = 24; // Default window size
    return {
      width: windowSize * (cellSize + cellSpacing) - cellSpacing,
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

/**
 * ===============================
 * TIME-BASED LAYOUT UTILITIES
 * ===============================
 */

/**
 * Calculate daily layout (24-hour grid)
 */
export function calculateDailyLayout(
  processedData: ProcessedCellData[],
  targetDate: Date,
  timeFormat: '12h' | '24h' = '24h'
): DailyLayoutData {
  const targetDateStr = formatDateISO(targetDate);

  // Filter data for the target date
  const dayData = processedData.filter((cell) => cell.date === targetDateStr);

  // Create hour boundaries
  const timeBoundaries = [];
  for (let hour = 0; hour < 24; hour++) {
    const hourStr =
      timeFormat === '12h' ? formatHour12(hour) : formatHour24(hour);

    timeBoundaries.push({
      hour: hourStr,
      x: hour,
      width: 1,
    });
  }

  // Organize data by hour
  const hourlyData = new Array(24).fill(null).map((_, hour) => {
    const hourData = dayData.find((cell) => {
      const cellDate = parseISODate(cell.date);
      return cellDate.getHours() === hour;
    });

    return (
      hourData ||
      ({
        date: `${targetDateStr}T${hour.toString().padStart(2, '0')}:00:00`,
        value: 0,
        x: hour,
        y: 0,
        color: '#f0f0f0',
        isEmpty: true,
        normalizedValue: 0,
      } as ProcessedCellData)
    );
  });

  return {
    hours: 24,
    hourData: hourlyData,
    timeBoundaries,
  };
}

/**
 * Calculate weekly layout (7-day activity)
 */
export function calculateWeeklyLayout(
  processedData: ProcessedCellData[],
  targetDate: Date
): WeeklyLayoutData {
  const startOfWeek = getStartOfWeek(targetDate);
  const weekDates = [];

  // Generate 7 days of the week
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDates.push(formatDateISO(day));
  }

  // Create day boundaries
  const dayBoundaries = weekDates.map((date, index) => ({
    day: getDayName(parseISODate(date)),
    x: index,
    width: 1,
  }));

  // Organize data by day of week
  const dayData = weekDates.map((date, index) => {
    const cellData = processedData.find((cell) => cell.date === date);

    return (
      cellData ||
      ({
        date,
        value: 0,
        x: index,
        y: 0,
        color: '#f0f0f0',
        isEmpty: true,
        normalizedValue: 0,
      } as ProcessedCellData)
    );
  });

  return {
    days: 7,
    dayData,
    dayBoundaries,
  };
}

/**
 * Calculate monthly layout
 */
export function calculateMonthlyLayout(
  processedData: ProcessedCellData[],
  targetDate: Date
): MonthlyLayoutData {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Create month grid (weeks x days)
  const weeks = Math.ceil((daysInMonth + startDayOfWeek) / 7);
  const monthData: ProcessedCellData[][] = [];

  for (let week = 0; week < weeks; week++) {
    const weekData: ProcessedCellData[] = [];

    for (let day = 0; day < 7; day++) {
      const dayNumber = week * 7 + day - startDayOfWeek + 1;

      if (dayNumber > 0 && dayNumber <= daysInMonth) {
        const date = new Date(year, month, dayNumber);
        const dateStr = formatDateISO(date);
        const cellData = processedData.find((cell) => cell.date === dateStr);

        weekData.push(
          cellData ||
            ({
              date: dateStr,
              value: 0,
              x: day,
              y: week,
              color: '#f0f0f0',
              isEmpty: true,
              normalizedValue: 0,
            } as ProcessedCellData)
        );
      } else {
        // Empty cell for padding
        weekData.push({
          date: '',
          value: 0,
          x: day,
          y: week,
          color: 'transparent',
          isEmpty: true,
          normalizedValue: 0,
        } as ProcessedCellData);
      }
    }

    monthData.push(weekData);
  }

  // Create week boundaries
  const weekBoundaries = Array.from({ length: weeks }, (_, index) => ({
    week: index + 1,
    x: 0,
    width: 7,
  }));

  return {
    daysInMonth,
    monthData,
    weekBoundaries,
  };
}

/**
 * Calculate yearly layout
 */
export function calculateYearlyLayout(
  processedData: ProcessedCellData[],
  targetDate: Date
): YearlyLayoutData {
  const year = targetDate.getFullYear();
  const yearData: ProcessedCellData[][] = [];

  // Process each month
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(year, month, 1);
    const monthLayout = calculateMonthlyLayout(processedData, monthDate);
    yearData.push(monthLayout.monthData.flat());
  }

  // Create month boundaries
  const monthBoundaries = Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(year, index, 1);
    return {
      month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
      x: index * 8, // Approximate spacing
      width: 7,
    };
  });

  return {
    months: 12,
    yearData,
    monthBoundaries,
  };
}

/**
 * Calculate custom range layout
 */
export function calculateCustomRangeLayout(
  processedData: ProcessedCellData[],
  startDate: Date,
  endDate: Date,
  granularity: 'hour' | 'day' | 'week' | 'month' = 'day'
): CustomRangeLayoutData {
  const rangeData: ProcessedCellData[] = [];
  const periodBoundaries: Array<{
    period: string;
    x: number;
    width: number;
  }> = [];

  let current = new Date(startDate);
  let position = 0;

  while (current <= endDate) {
    let periodEnd: Date;
    let periodLabel: string;

    switch (granularity) {
      case 'hour':
        periodEnd = new Date(current);
        periodEnd.setHours(current.getHours() + 1);
        periodLabel = current.toLocaleTimeString('en-US', { hour: 'numeric' });
        break;
      case 'day':
        periodEnd = new Date(current);
        periodEnd.setDate(current.getDate() + 1);
        periodLabel = current.toLocaleDateString('en-US', { day: 'numeric' });
        break;
      case 'week':
        periodEnd = new Date(current);
        periodEnd.setDate(current.getDate() + 7);
        periodLabel = `W${getWeekNumber(current)}`;
        break;
      case 'month':
        periodEnd = new Date(current);
        periodEnd.setMonth(current.getMonth() + 1);
        periodLabel = current.toLocaleDateString('en-US', { month: 'short' });
        break;
    }

    // Find data for this period
    const periodDataStr = formatDateISO(current);
    const cellData = processedData.find((cell) => cell.date === periodDataStr);

    rangeData.push(
      cellData ||
        ({
          date: periodDataStr,
          value: 0,
          x: position,
          y: 0,
          color: '#f0f0f0',
          isEmpty: true,
          normalizedValue: 0,
        } as ProcessedCellData)
    );

    periodBoundaries.push({
      period: periodLabel,
      x: position,
      width: 1,
    });

    current = periodEnd;
    position++;
  }

  return {
    startDate,
    endDate,
    rangeData,
    periodBoundaries,
  };
}

/**
 * Calculate timeline scroll layout
 */
export function calculateTimelineScrollLayout(
  processedData: ProcessedCellData[],
  scrollDirection: 'horizontal' | 'vertical' = 'horizontal',
  chunkSize: number = 24
): TimelineScrollLayoutData {
  const timelineData: ProcessedCellData[][] = [];
  const scrollMarkers: Array<{
    timestamp: string;
    position: number;
    label: string;
  }> = [];

  // Sort data by date
  const sortedData = [...processedData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group data into chunks
  for (let i = 0; i < sortedData.length; i += chunkSize) {
    const chunk = sortedData.slice(i, i + chunkSize);
    timelineData.push(chunk);

    // Add scroll marker for each chunk
    if (chunk.length > 0 && chunk[0]) {
      scrollMarkers.push({
        timestamp: chunk[0].date,
        position: i,
        label: new Date(chunk[0].date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      });
    }
  }

  const totalScrollSize =
    scrollDirection === 'horizontal'
      ? timelineData.length * chunkSize * 15 // Approximate cell width
      : timelineData.length * chunkSize * 15; // Approximate cell height

  return {
    totalScrollSize,
    timelineData,
    scrollMarkers,
  };
}

/**
 * Calculate real-time layout
 */
export function calculateRealTimeLayout(
  processedData: ProcessedCellData[],
  windowSize: number = 24, // Number of time units to show
  updateInterval: number = 1000 // Update interval in milliseconds
): RealTimeLayoutData {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSize * 60 * 60 * 1000); // windowSize hours ago

  // Filter data for current window
  const dataBuffer = processedData.filter((cell) => {
    const cellDate = parseISODate(cell.date);
    return cellDate >= windowStart && cellDate <= now;
  });

  // Create live indicators
  const liveIndicators = dataBuffer.map((cell, index) => {
    const cellDate = parseISODate(cell.date);
    const isRecent = now.getTime() - cellDate.getTime() < updateInterval * 2;

    return {
      timestamp: cellDate,
      position: index,
      active: isRecent,
    };
  });

  return {
    currentWindow: {
      start: windowStart,
      end: now,
    },
    dataBuffer,
    updateQueue: [], // Will be populated by real-time updates
    liveIndicators,
  };
}

/**
 * ===============================
 * HELPER FUNCTIONS
 * ===============================
 */

/**
 * Format hour in 12-hour format
 */
function formatHour12(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

/**
 * Format hour in 24-hour format
 */
function formatHour24(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

/**
 * Get start of week (Sunday)
 */
function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * Get day name
 */
function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// Export animation utilities
export * from './animation';

// Export gesture utilities
export * from './gestures';
