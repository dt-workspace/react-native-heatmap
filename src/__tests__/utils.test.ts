import {
  generateDateRange,
  formatDateISO,
  parseISODate,
  getWeekNumber,
  getDayOfWeek,
  normalizeValue,
  calculateColor,
  resolveColorScheme,
  processHeatmapData,
  calculateCalendarLayout,
  calculateGridDimensions,
  calculateHeatmapDimensions,
} from '../utils';
import { COLOR_SCHEMES } from '../types';
import type { HeatmapData, ColorScheme } from '../types';

describe('Date Utilities', () => {
  describe('formatDateISO', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDateISO(date)).toBe('2024-01-15');
    });
  });

  describe('parseISODate', () => {
    it('parses ISO date string correctly', () => {
      const dateString = '2024-01-15';
      const parsed = parseISODate(dateString);
      expect(parsed.getFullYear()).toBe(2024);
      expect(parsed.getMonth()).toBe(0); // January is 0
      expect(parsed.getDate()).toBe(15);
    });
  });

  describe('generateDateRange', () => {
    it('generates correct date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      const range = generateDateRange(start, end);

      expect(range).toEqual([
        '2024-01-01',
        '2024-01-02',
        '2024-01-03',
        '2024-01-04',
        '2024-01-05',
      ]);
    });

    it('handles single day range', () => {
      const date = new Date('2024-01-01');
      const range = generateDateRange(date, date);
      expect(range).toEqual(['2024-01-01']);
    });
  });

  describe('getWeekNumber', () => {
    it('calculates week number correctly', () => {
      const date = new Date('2024-01-15');
      const weekNumber = getWeekNumber(date);
      expect(typeof weekNumber).toBe('number');
      expect(weekNumber).toBeGreaterThan(0);
    });
  });

  describe('getDayOfWeek', () => {
    it('returns correct day of week', () => {
      const sunday = new Date('2024-01-07'); // Known Sunday
      expect(getDayOfWeek(sunday)).toBe(0);

      const monday = new Date('2024-01-08'); // Known Monday
      expect(getDayOfWeek(monday)).toBe(1);
    });
  });
});

describe('Value Processing', () => {
  describe('normalizeValue', () => {
    it('normalizes values correctly', () => {
      expect(normalizeValue(5, 0, 10)).toBe(0.5);
      expect(normalizeValue(0, 0, 10)).toBe(0);
      expect(normalizeValue(10, 0, 10)).toBe(1);
    });

    it('handles edge cases', () => {
      expect(normalizeValue(5, 5, 5)).toBe(1); // Same min/max with positive value
      expect(normalizeValue(0, 5, 5)).toBe(0); // Same min/max with zero value
      expect(normalizeValue(-1, 0, 10)).toBe(0); // Below min
      expect(normalizeValue(15, 0, 10)).toBe(1); // Above max
    });
  });

  describe('calculateColor', () => {
    const testColorScheme: ColorScheme = {
      name: 'test',
      colors: ['#ffffff', '#000000'],
      emptyColor: '#f0f0f0',
    };

    it('returns empty color for empty cells', () => {
      const color = calculateColor(0.5, testColorScheme, true);
      expect(color).toBe('#f0f0f0');
    });

    it('returns correct color for zero value', () => {
      const color = calculateColor(0, testColorScheme, false);
      expect(color).toBe('#f0f0f0');
    });

    it('returns first color for minimum value', () => {
      const color = calculateColor(0.01, testColorScheme, false);
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/); // Should be a valid hex color
    });

    it('returns last color for maximum value', () => {
      const color = calculateColor(1, testColorScheme, false);
      expect(color).toBe('#000000');
    });
  });

  describe('resolveColorScheme', () => {
    it('resolves string color scheme', () => {
      const resolved = resolveColorScheme('github');
      expect(resolved.name).toBe('github');
      expect(Array.isArray(resolved.colors)).toBe(true);
    });

    it('returns object color scheme as is', () => {
      const customScheme: ColorScheme = {
        name: 'custom',
        colors: ['#fff', '#000'],
      };
      const resolved = resolveColorScheme(customScheme);
      expect(resolved).toBe(customScheme);
    });

    it('falls back to github scheme for unknown string', () => {
      const resolved = resolveColorScheme('unknown-scheme');
      expect(resolved.name).toBe('github');
    });
  });
});

describe('Data Processing', () => {
  const sampleData: HeatmapData[] = [
    { date: '2024-01-01', value: 3 },
    { date: '2024-01-02', value: 7 },
    { date: '2024-01-03', value: 1 },
  ];

  describe('processHeatmapData', () => {
    it('processes calendar layout correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');

      const processed = processHeatmapData(
        sampleData,
        startDate,
        endDate,
        'github',
        'calendar'
      );

      expect(processed).toHaveLength(3);
      expect(processed[0]?.date).toBe('2024-01-01');
      expect(processed[0]?.value).toBe(3);
      expect(processed[0]?.x).toBe(0); // First week
      expect(typeof processed[0]?.color).toBe('string');
    });

    it('processes grid layout correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');

      const processed = processHeatmapData(
        sampleData,
        startDate,
        endDate,
        'github',
        'grid'
      );

      expect(processed).toHaveLength(3);
      expect(processed[0]?.x).toBe(0);
      expect(processed[0]?.y).toBe(0);
      expect(processed[1]?.x).toBe(1);
      expect(processed[1]?.y).toBe(0);
    });

    it('processes compact layout correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');

      const processed = processHeatmapData(
        sampleData,
        startDate,
        endDate,
        'github',
        'compact'
      );

      expect(processed).toHaveLength(3);
      expect(processed[0]?.y).toBe(0);
      expect(processed[1]?.y).toBe(0);
      expect(processed[2]?.y).toBe(0);
    });

    it('handles missing data points', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-05');

      const processed = processHeatmapData(
        sampleData,
        startDate,
        endDate,
        'github'
      );

      expect(processed).toHaveLength(5);
      expect(processed[3]?.isEmpty).toBe(true);
      expect(processed[4]?.isEmpty).toBe(true);
    });
  });

  describe('calculateCalendarLayout', () => {
    it('calculates calendar layout correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-14');

      const processed = processHeatmapData(
        sampleData,
        startDate,
        endDate,
        'github',
        'calendar'
      );

      const layout = calculateCalendarLayout(processed, startDate);

      expect(layout.weeks).toBeGreaterThan(0);
      expect(Array.isArray(layout.weekData)).toBe(true);
      expect(Array.isArray(layout.monthBoundaries)).toBe(true);
    });
  });
});

describe('Dimension Calculations', () => {
  describe('calculateGridDimensions', () => {
    it('calculates square grid for unspecified dimensions', () => {
      const { columns, rows } = calculateGridDimensions(9);
      expect(columns * rows).toBeGreaterThanOrEqual(9);
    });

    it('uses preferred columns', () => {
      const { columns, rows } = calculateGridDimensions(10, 5);
      expect(columns).toBe(5);
      expect(rows).toBe(2);
    });

    it('uses preferred rows', () => {
      const { columns, rows } = calculateGridDimensions(10, undefined, 2);
      expect(rows).toBe(2);
      expect(columns).toBe(5);
    });

    it('uses both preferred dimensions', () => {
      const { columns, rows } = calculateGridDimensions(10, 4, 3);
      expect(columns).toBe(4);
      expect(rows).toBe(3);
    });
  });

  describe('calculateHeatmapDimensions', () => {
    const sampleProcessedData = [
      {
        date: '2024-01-01',
        value: 1,
        x: 0,
        y: 0,
        color: '#fff',
        isEmpty: false,
        normalizedValue: 1,
      },
      {
        date: '2024-01-02',
        value: 2,
        x: 0,
        y: 1,
        color: '#fff',
        isEmpty: false,
        normalizedValue: 1,
      },
    ];

    it('calculates calendar dimensions', () => {
      const dimensions = calculateHeatmapDimensions(
        sampleProcessedData,
        12,
        2,
        'calendar'
      );

      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
    });

    it('calculates grid dimensions', () => {
      const dimensions = calculateHeatmapDimensions(
        sampleProcessedData,
        12,
        2,
        'grid'
      );

      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBeGreaterThan(0);
    });

    it('calculates compact dimensions', () => {
      const dimensions = calculateHeatmapDimensions(
        sampleProcessedData,
        12,
        2,
        'compact'
      );

      expect(dimensions.width).toBeGreaterThan(0);
      expect(dimensions.height).toBe(12); // Cell size for compact layout
    });
  });
});

describe('Color Schemes', () => {
  it('has all expected color schemes', () => {
    const expectedSchemes = [
      'github',
      'githubDark',
      'heat',
      'cool',
      'purple',
      'green',
      'orange',
      'red',
      'blue',
      'grayscale',
    ];

    expectedSchemes.forEach((scheme) => {
      expect(COLOR_SCHEMES[scheme]).toBeDefined();
      expect(Array.isArray(COLOR_SCHEMES[scheme]?.colors)).toBe(true);
    });
  });

  it('validates color scheme structure', () => {
    Object.values(COLOR_SCHEMES).forEach((scheme) => {
      expect(scheme.name).toBeDefined();
      expect(Array.isArray(scheme.colors)).toBe(true);
      expect(scheme.colors.length).toBeGreaterThan(0);

      // Check that colors are valid hex strings
      scheme.colors.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });
});
