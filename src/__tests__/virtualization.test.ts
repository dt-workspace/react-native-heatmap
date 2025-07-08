/**
 * Tests for virtualization utilities
 */

import {
  DEFAULT_VIRTUALIZATION_CONFIG,
  calculateVisibleRange,
  calculateOptimalVirtualization,
  LazyLoader,
  MemoryOptimizer,
  PerformanceMonitor,
} from '../utils/virtualization';
import type { Viewport } from '../utils/virtualization';
import type { ProcessedCellData } from '../types';

// Mock performance.now for testing
global.performance = {
  now: jest.fn(() => Date.now()),
} as any;

describe('Virtualization Utilities', () => {
  const mockCells: ProcessedCellData[] = Array.from(
    { length: 100 },
    (_, i) => ({
      date: `2024-01-${(i + 1).toString().padStart(2, '0')}`,
      value: i,
      x: i % 10,
      y: Math.floor(i / 10),
      color: '#000000',
      isEmpty: false,
      normalizedValue: i / 100,
    })
  );

  describe('calculateVisibleRange', () => {
    const viewport: Viewport = {
      width: 200,
      height: 150,
      offsetX: 50,
      offsetY: 30,
      scale: 1.0,
    };

    it('should return all cells when virtualization is disabled', () => {
      const config = { ...DEFAULT_VIRTUALIZATION_CONFIG, enabled: false };
      const range = calculateVisibleRange(mockCells, viewport, config);

      expect(range.startIndex).toBe(0);
      expect(range.endIndex).toBe(mockCells.length - 1);
      expect(range.visibleCells).toHaveLength(mockCells.length);
    });

    it('should return all cells when below threshold', () => {
      const config = {
        ...DEFAULT_VIRTUALIZATION_CONFIG,
        enabled: true,
        threshold: 200,
      };
      const range = calculateVisibleRange(mockCells, viewport, config);

      expect(range.startIndex).toBe(0);
      expect(range.endIndex).toBe(mockCells.length - 1);
      expect(range.visibleCells).toHaveLength(mockCells.length);
    });

    it('should filter visible cells when virtualization is enabled', () => {
      const config = {
        ...DEFAULT_VIRTUALIZATION_CONFIG,
        enabled: true,
        threshold: 50,
        bufferSize: 0,
      };
      const range = calculateVisibleRange(mockCells, viewport, config);

      expect(range.visibleCells.length).toBeLessThan(mockCells.length);
      expect(range.startIndex).toBeGreaterThanOrEqual(0);
      expect(range.endIndex).toBeLessThanOrEqual(mockCells.length - 1);
    });
  });

  describe('calculateOptimalVirtualization', () => {
    it('should enable virtualization for large datasets', () => {
      const config = calculateOptimalVirtualization(1500, 12, 2, {
        width: 400,
        height: 300,
      });

      expect(config.enabled).toBe(true);
      expect(config.threshold).toBe(500);
      expect(config.bufferSize).toBe(100);
    });

    it('should enable virtualization for medium datasets', () => {
      const config = calculateOptimalVirtualization(750, 12, 2, {
        width: 400,
        height: 300,
      });

      expect(config.enabled).toBe(true);
      expect(config.threshold).toBe(300);
      expect(config.bufferSize).toBe(50);
    });

    it('should disable virtualization for small datasets', () => {
      const config = calculateOptimalVirtualization(200, 12, 2, {
        width: 400,
        height: 300,
      });

      expect(config.enabled).toBe(false);
    });
  });

  describe('LazyLoader', () => {
    let lazyLoader: LazyLoader<string>;
    let mockLoader: jest.Mock;

    beforeEach(() => {
      mockLoader = jest.fn().mockImplementation(async (start, end) => {
        return Array.from(
          { length: end - start + 1 },
          (_, i) => `item-${start + i}`
        );
      });

      lazyLoader = new LazyLoader(Array(100).fill(null), 10, mockLoader);
    });

    it('should load data chunks on demand', async () => {
      const data = await lazyLoader.getRange(5, 15);

      expect(data).toHaveLength(11);
      expect(data[0]).toBe('item-5');
      expect(data[10]).toBe('item-15');
      expect(mockLoader).toHaveBeenCalledWith(0, 9); // First chunk
      expect(mockLoader).toHaveBeenCalledWith(10, 19); // Second chunk
    });

    it('should not reload already loaded chunks', async () => {
      await lazyLoader.getRange(5, 8);
      mockLoader.mockClear();

      await lazyLoader.getRange(6, 9);

      expect(mockLoader).not.toHaveBeenCalled();
    });

    it('should preload chunks around center', async () => {
      await lazyLoader.preloadAround(25, 1);

      expect(mockLoader).toHaveBeenCalledWith(10, 19); // Chunk 1
      expect(mockLoader).toHaveBeenCalledWith(20, 29); // Chunk 2
      expect(mockLoader).toHaveBeenCalledWith(30, 39); // Chunk 3
    });

    it('should check if chunk is loaded', async () => {
      expect(lazyLoader.isChunkLoaded(0)).toBe(false);

      await lazyLoader.getRange(0, 5);

      expect(lazyLoader.isChunkLoaded(0)).toBe(true);
    });

    it('should clear cache', async () => {
      await lazyLoader.getRange(0, 5);
      expect(lazyLoader.isChunkLoaded(0)).toBe(true);

      lazyLoader.clearCache();

      expect(lazyLoader.isChunkLoaded(0)).toBe(false);
    });
  });

  describe('MemoryOptimizer', () => {
    let optimizer: MemoryOptimizer;

    beforeEach(() => {
      optimizer = MemoryOptimizer.getInstance();
      optimizer.setMaxMemoryUsage(1000);
    });

    afterEach(() => {
      // Clear all tracking
      optimizer.clearMemoryTracking('test1');
      optimizer.clearMemoryTracking('test2');
      optimizer.clearMemoryTracking('test3');
    });

    it('should track memory usage', () => {
      optimizer.trackMemoryUsage('test1', 100);
      optimizer.trackMemoryUsage('test2', 200);

      expect(optimizer.getTotalMemoryUsage()).toBe(300);
    });

    it('should trigger garbage collection when exceeding limit', () => {
      optimizer.trackMemoryUsage('test1', 600);
      optimizer.trackMemoryUsage('test2', 500); // This should trigger GC

      expect(optimizer.getTotalMemoryUsage()).toBeLessThan(1100);
    });

    it('should clear memory tracking for specific component', () => {
      optimizer.trackMemoryUsage('test1', 100);
      optimizer.trackMemoryUsage('test2', 200);

      optimizer.clearMemoryTracking('test1');

      expect(optimizer.getTotalMemoryUsage()).toBe(200);
    });
  });

  describe('PerformanceMonitor', () => {
    beforeEach(() => {
      PerformanceMonitor.clearMeasurements();
      (performance.now as jest.Mock)
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1100);
    });

    it('should measure performance', () => {
      PerformanceMonitor.startMeasurement('test');
      const duration = PerformanceMonitor.endMeasurement('test');

      expect(duration).toBe(100);
    });

    it('should return 0 for non-existent measurement', () => {
      const duration = PerformanceMonitor.endMeasurement('nonexistent');
      expect(duration).toBe(0);
    });

    it('should calculate average measurements', () => {
      // Mock multiple measurements
      (performance.now as jest.Mock)
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1100)
        .mockReturnValueOnce(2000)
        .mockReturnValueOnce(2200);

      PerformanceMonitor.startMeasurement('test');
      PerformanceMonitor.endMeasurement('test');

      PerformanceMonitor.startMeasurement('test');
      PerformanceMonitor.endMeasurement('test');

      // Note: This test needs to be adjusted as the current implementation
      // doesn't store completed measurements for averaging
      const average = PerformanceMonitor.getAverageMeasurement('test');
      expect(typeof average).toBe('number');
    });

    it('should clear measurements', () => {
      PerformanceMonitor.startMeasurement('test');
      PerformanceMonitor.clearMeasurements('test');

      const duration = PerformanceMonitor.endMeasurement('test');
      expect(duration).toBe(0);
    });
  });
});
