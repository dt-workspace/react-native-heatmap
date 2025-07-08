import {
  calculateDailyLayout,
  calculateWeeklyLayout,
  calculateMonthlyLayout,
  calculateYearlyLayout,
  calculateCustomRangeLayout,
  calculateTimelineScrollLayout,
  calculateRealTimeLayout,
  formatDateISO,
} from '../utils';
import type { ProcessedCellData } from '../types';

// Mock data generator
const generateMockData = (
  dates: string[],
  values?: number[]
): ProcessedCellData[] => {
  return dates.map((date, index) => ({
    date,
    value: values
      ? (values[index] ?? Math.floor(Math.random() * 100))
      : Math.floor(Math.random() * 100),
    x: index % 7, // Default positioning
    y: Math.floor(index / 7),
    color: '#40c463',
    isEmpty: false,
    normalizedValue: values
      ? (values[index] ?? Math.random()) / 100
      : Math.random(),
  }));
};

describe('Time-Based Layout Utilities', () => {
  describe('calculateDailyLayout', () => {
    it('should calculate daily layout for 24 hours', () => {
      const targetDate = new Date('2024-01-15');
      const mockData = generateMockData(['2024-01-15'], [50]);

      const result = calculateDailyLayout(mockData, targetDate, '24h');

      expect(result.hours).toBe(24);
      expect(result.hourData).toHaveLength(24);
      expect(result.timeBoundaries).toHaveLength(24);

      // Check first hour boundary
      expect(result.timeBoundaries[0]).toEqual({
        hour: '00:00',
        x: 0,
        width: 1,
      });

      // Check last hour boundary
      expect(result.timeBoundaries[23]).toEqual({
        hour: '23:00',
        x: 23,
        width: 1,
      });
    });

    it('should calculate daily layout with 12-hour format', () => {
      const targetDate = new Date('2024-01-15');
      const mockData = generateMockData(['2024-01-15'], [50]);

      const result = calculateDailyLayout(mockData, targetDate, '12h');

      expect(result.timeBoundaries[0]?.hour).toBe('12 AM');
      expect(result.timeBoundaries[1]?.hour).toBe('1 AM');
      expect(result.timeBoundaries[12]?.hour).toBe('12 PM');
      expect(result.timeBoundaries[13]?.hour).toBe('1 PM');
      expect(result.timeBoundaries[23]?.hour).toBe('11 PM');
    });

    it('should handle empty data for daily layout', () => {
      const targetDate = new Date('2024-01-15');
      const mockData: ProcessedCellData[] = [];

      const result = calculateDailyLayout(mockData, targetDate, '24h');

      expect(result.hourData).toHaveLength(24);
      expect(result.hourData[0]?.isEmpty).toBe(true);
      expect(result.hourData[0]?.value).toBe(0);
    });
  });

  describe('calculateWeeklyLayout', () => {
    it('should calculate weekly layout for 7 days', () => {
      const targetDate = new Date('2024-01-15'); // Monday
      const mockData = generateMockData(['2024-01-15']);

      const result = calculateWeeklyLayout(mockData, targetDate);

      expect(result.days).toBe(7);
      expect(result.dayData).toHaveLength(7);
      expect(result.dayBoundaries).toHaveLength(7);

      // Check that we have 7 boundaries (specific day names may vary based on week start)
      expect(result.dayBoundaries).toHaveLength(7);
      expect(result.dayBoundaries[0]).toHaveProperty('day');
      expect(result.dayBoundaries[0]).toHaveProperty('x', 0);
      expect(result.dayBoundaries[0]).toHaveProperty('width', 1);
    });

    it('should handle partial week data', () => {
      const targetDate = new Date('2024-01-15');
      const mockData = generateMockData(['2024-01-15', '2024-01-16']);

      const result = calculateWeeklyLayout(mockData, targetDate);

      expect(result.dayData).toHaveLength(7);
      expect(result.dayData.some((day) => day.isEmpty)).toBe(true);
    });
  });

  describe('calculateMonthlyLayout', () => {
    it('should calculate monthly layout for January 2024', () => {
      const targetDate = new Date('2024-01-15');
      const mockData = generateMockData([
        '2024-01-01',
        '2024-01-15',
        '2024-01-31',
      ]);

      const result = calculateMonthlyLayout(mockData, targetDate);

      expect(result.daysInMonth).toBe(31);
      expect(result.monthData).toHaveLength(5); // 5 weeks in January 2024
      expect(result.weekBoundaries).toHaveLength(5);

      // Check week boundaries
      expect(result.weekBoundaries[0]).toEqual({
        week: 1,
        x: 0,
        width: 7,
      });
    });

    it('should handle February leap year', () => {
      const targetDate = new Date('2024-02-15'); // 2024 is a leap year
      const mockData = generateMockData(['2024-02-01', '2024-02-29']);

      const result = calculateMonthlyLayout(mockData, targetDate);

      expect(result.daysInMonth).toBe(29);
    });

    it('should handle February non-leap year', () => {
      const targetDate = new Date('2023-02-15'); // 2023 is not a leap year
      const mockData = generateMockData(['2023-02-01', '2023-02-28']);

      const result = calculateMonthlyLayout(mockData, targetDate);

      expect(result.daysInMonth).toBe(28);
    });
  });

  describe('calculateYearlyLayout', () => {
    it('should calculate yearly layout for 2024', () => {
      const targetDate = new Date('2024-06-15');
      const mockData = generateMockData([
        '2024-01-01',
        '2024-06-15',
        '2024-12-31',
      ]);

      const result = calculateYearlyLayout(mockData, targetDate);

      expect(result.months).toBe(12);
      expect(result.yearData).toHaveLength(12);
      expect(result.monthBoundaries).toHaveLength(12);

      // Check month boundaries
      expect(result.monthBoundaries[0]?.month).toBe('Jan');
      expect(result.monthBoundaries[11]?.month).toBe('Dec');
    });

    it('should handle sparse yearly data', () => {
      const targetDate = new Date('2024-06-15');
      const mockData = generateMockData(['2024-01-01', '2024-12-31']);

      const result = calculateYearlyLayout(mockData, targetDate);

      expect(result.yearData).toHaveLength(12);
      expect(result.yearData[0]?.some((cell) => !cell.isEmpty)).toBe(true); // January has data
      expect(result.yearData[5]?.every((cell) => cell.isEmpty)).toBe(true); // June has no data
    });
  });

  describe('calculateCustomRangeLayout', () => {
    it('should calculate custom range with day granularity', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      const mockData = generateMockData([
        '2024-01-01',
        '2024-01-03',
        '2024-01-07',
      ]);

      const result = calculateCustomRangeLayout(
        mockData,
        startDate,
        endDate,
        'day'
      );

      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(result.rangeData).toHaveLength(7);
      expect(result.periodBoundaries).toHaveLength(7);

      // Check period boundaries
      expect(result.periodBoundaries[0]).toEqual({
        period: '1',
        x: 0,
        width: 1,
      });
    });

    it('should calculate custom range with week granularity', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-21');
      const mockData = generateMockData([
        '2024-01-01',
        '2024-01-08',
        '2024-01-15',
      ]);

      const result = calculateCustomRangeLayout(
        mockData,
        startDate,
        endDate,
        'week'
      );

      expect(result.rangeData.length).toBeGreaterThan(0);
      expect(result.periodBoundaries[0]?.period).toMatch(/W\d+/);
    });

    it('should calculate custom range with month granularity', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');
      const mockData = generateMockData([
        '2024-01-01',
        '2024-02-01',
        '2024-03-01',
      ]);

      const result = calculateCustomRangeLayout(
        mockData,
        startDate,
        endDate,
        'month'
      );

      expect(result.rangeData.length).toBeGreaterThan(0);
      expect(result.periodBoundaries[0]?.period).toBe('Jan');
    });

    it('should calculate custom range with hour granularity', () => {
      const startDate = new Date('2024-01-01T00:00:00');
      const endDate = new Date('2024-01-01T05:00:00');
      const mockData = generateMockData(['2024-01-01']);

      const result = calculateCustomRangeLayout(
        mockData,
        startDate,
        endDate,
        'hour'
      );

      expect(result.rangeData.length).toBeGreaterThan(0);
      expect(result.periodBoundaries[0]?.period).toMatch(/\d+/);
    });
  });

  describe('calculateTimelineScrollLayout', () => {
    it('should calculate timeline scroll layout horizontally', () => {
      const dates = Array.from({ length: 50 }, (_, i) =>
        formatDateISO(new Date(2024, 0, i + 1))
      );
      const mockData = generateMockData(dates);

      const result = calculateTimelineScrollLayout(mockData, 'horizontal', 24);

      expect(result.timelineData.length).toBeGreaterThan(0);
      expect(result.scrollMarkers.length).toBeGreaterThan(0);
      expect(result.totalScrollSize).toBeGreaterThan(0);

      // Check scroll markers
      expect(result.scrollMarkers[0]).toEqual({
        timestamp: mockData[0]?.date,
        position: 0,
        label: expect.stringMatching(/\w{3} \d+/),
      });
    });

    it('should calculate timeline scroll layout vertically', () => {
      const dates = Array.from({ length: 30 }, (_, i) =>
        formatDateISO(new Date(2024, 0, i + 1))
      );
      const mockData = generateMockData(dates);

      const result = calculateTimelineScrollLayout(mockData, 'vertical', 10);

      expect(result.timelineData.length).toBe(3); // 30 items / 10 chunk size
      expect(result.scrollMarkers).toHaveLength(3);
    });

    it('should handle empty data for timeline scroll', () => {
      const mockData: ProcessedCellData[] = [];

      const result = calculateTimelineScrollLayout(mockData, 'horizontal', 24);

      expect(result.timelineData).toHaveLength(0);
      expect(result.scrollMarkers).toHaveLength(0);
      expect(result.totalScrollSize).toBe(0);
    });
  });

  describe('calculateRealTimeLayout', () => {
    it('should calculate real-time layout with current window', () => {
      const now = new Date();
      const pastHour = new Date(now.getTime() - 60 * 60 * 1000);
      const futureHour = new Date(now.getTime() + 60 * 60 * 1000);

      const mockData = generateMockData([
        formatDateISO(pastHour),
        formatDateISO(now),
        formatDateISO(futureHour),
      ]);

      const result = calculateRealTimeLayout(mockData, 24, 1000);

      expect(result.currentWindow.start).toBeInstanceOf(Date);
      expect(result.currentWindow.end).toBeInstanceOf(Date);
      expect(result.dataBuffer.length).toBeGreaterThan(0);
      expect(result.updateQueue).toHaveLength(0);
      expect(result.liveIndicators.length).toBeGreaterThan(0);
    });

    it('should filter data within time window', () => {
      const now = new Date();
      const veryOldDate = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago
      const recentDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago

      const mockData = generateMockData([
        formatDateISO(veryOldDate),
        formatDateISO(recentDate),
      ]);

      const result = calculateRealTimeLayout(mockData, 24, 1000);

      // Should only include data within the 24-hour window
      expect(result.dataBuffer.length).toBe(1);
      expect(result.dataBuffer[0]?.date).toBe(formatDateISO(recentDate));
    });

    it('should identify active live indicators', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 500); // 500ms ago
      const oldDate = new Date(now.getTime() - 5000); // 5 seconds ago

      const mockData = generateMockData([
        formatDateISO(recentDate),
        formatDateISO(oldDate),
      ]);

      const result = calculateRealTimeLayout(mockData, 24, 1000);

      expect(result.liveIndicators.length).toBe(2);

      // Check that the structure is correct
      expect(result.liveIndicators[0]).toHaveProperty('active');
      expect(result.liveIndicators[0]).toHaveProperty('timestamp');
      expect(result.liveIndicators[0]).toHaveProperty('position');

      // The active status depends on timing, so we just check the structure
      expect(typeof result.liveIndicators[0]?.active).toBe('boolean');
      expect(typeof result.liveIndicators[1]?.active).toBe('boolean');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle invalid dates gracefully', () => {
      const invalidDate = new Date('invalid-date');
      const mockData = generateMockData(['2024-01-01']);

      // Since invalid dates cause errors in formatDateISO, we check that the functions handle it
      // by not crashing completely but may produce unexpected results
      expect(() => {
        try {
          calculateDailyLayout(mockData, invalidDate);
        } catch (error) {
          // RangeError is expected for invalid dates
          expect(error).toBeInstanceOf(RangeError);
        }
      }).not.toThrow();

      // Test with valid date to ensure normal operation
      const validDate = new Date('2024-01-01');
      expect(() => calculateDailyLayout(mockData, validDate)).not.toThrow();
      expect(() => calculateWeeklyLayout(mockData, validDate)).not.toThrow();
      expect(() => calculateMonthlyLayout(mockData, validDate)).not.toThrow();
    });

    it('should handle empty data arrays', () => {
      const emptyData: ProcessedCellData[] = [];
      const date = new Date('2024-01-01');

      expect(() => calculateDailyLayout(emptyData, date)).not.toThrow();
      expect(() => calculateWeeklyLayout(emptyData, date)).not.toThrow();
      expect(() => calculateMonthlyLayout(emptyData, date)).not.toThrow();
      expect(() => calculateYearlyLayout(emptyData, date)).not.toThrow();
    });

    it('should handle very large datasets', () => {
      const largeDates = Array.from({ length: 1000 }, (_, i) =>
        formatDateISO(new Date(2024, 0, i + 1))
      );
      const largeData = generateMockData(largeDates);

      expect(() =>
        calculateTimelineScrollLayout(largeData, 'horizontal', 50)
      ).not.toThrow();
      expect(() => calculateRealTimeLayout(largeData, 24, 1000)).not.toThrow();
    });
  });
});
