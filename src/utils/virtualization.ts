/**
 * Virtualization utilities for React Native Heatmap
 * Provides efficient rendering for large datasets
 */

import type { ProcessedCellData } from '../types';

/**
 * Virtualization configuration
 */
export interface VirtualizationConfig {
  /** Enable virtualization */
  enabled: boolean;
  /** Buffer size around visible area */
  bufferSize: number;
  /** Minimum number of items to trigger virtualization */
  threshold: number;
  /** Cell size for calculations */
  cellSize: number;
  /** Cell spacing for calculations */
  cellSpacing: number;
}

/**
 * Default virtualization configuration
 */
export const DEFAULT_VIRTUALIZATION_CONFIG: VirtualizationConfig = {
  enabled: false,
  bufferSize: 50,
  threshold: 500,
  cellSize: 12,
  cellSpacing: 2,
};

/**
 * Viewport information for virtualization
 */
export interface Viewport {
  /** Viewport width */
  width: number;
  /** Viewport height */
  height: number;
  /** Scroll offset X */
  offsetX: number;
  /** Scroll offset Y */
  offsetY: number;
  /** Scale factor for zoom */
  scale: number;
}

/**
 * Visible cell range
 */
export interface VisibleRange {
  /** Start index */
  startIndex: number;
  /** End index */
  endIndex: number;
  /** Visible cells */
  visibleCells: ProcessedCellData[];
}

/**
 * Calculate visible cell range based on viewport
 */
export function calculateVisibleRange(
  cells: ProcessedCellData[],
  viewport: Viewport,
  config: VirtualizationConfig
): VisibleRange {
  if (!config.enabled || cells.length < config.threshold) {
    return {
      startIndex: 0,
      endIndex: cells.length - 1,
      visibleCells: cells,
    };
  }

  const cellWidth = config.cellSize + config.cellSpacing;
  const cellHeight = config.cellSize + config.cellSpacing;

  // Calculate visible bounds with buffer
  const visibleLeft = Math.max(
    0,
    viewport.offsetX - config.bufferSize * cellWidth
  );
  const visibleRight =
    viewport.offsetX + viewport.width + config.bufferSize * cellWidth;
  const visibleTop = Math.max(
    0,
    viewport.offsetY - config.bufferSize * cellHeight
  );
  const visibleBottom =
    viewport.offsetY + viewport.height + config.bufferSize * cellHeight;

  // Filter cells within visible bounds
  const visibleCells = cells.filter((cell) => {
    const cellLeft = cell.x * cellWidth;
    const cellRight = cellLeft + cellWidth;
    const cellTop = cell.y * cellHeight;
    const cellBottom = cellTop + cellHeight;

    return (
      cellRight >= visibleLeft &&
      cellLeft <= visibleRight &&
      cellBottom >= visibleTop &&
      cellTop <= visibleBottom
    );
  });

  // Find start and end indices
  const startIndex = cells.findIndex((cell) => visibleCells.includes(cell));
  const endIndex = startIndex + visibleCells.length - 1;

  return {
    startIndex: Math.max(0, startIndex),
    endIndex: Math.min(cells.length - 1, endIndex),
    visibleCells,
  };
}

/**
 * Calculate optimal virtualization settings based on dataset size
 */
export function calculateOptimalVirtualization(
  dataLength: number,
  cellSize: number,
  cellSpacing: number,
  _containerSize: { width: number; height: number }
): VirtualizationConfig {
  const baseConfig = { ...DEFAULT_VIRTUALIZATION_CONFIG };

  // Enable virtualization for large datasets
  if (dataLength > 1000) {
    baseConfig.enabled = true;
    baseConfig.threshold = 500;
    baseConfig.bufferSize = 100;
  } else if (dataLength > 500) {
    baseConfig.enabled = true;
    baseConfig.threshold = 300;
    baseConfig.bufferSize = 50;
  } else {
    baseConfig.enabled = false;
  }

  baseConfig.cellSize = cellSize;
  baseConfig.cellSpacing = cellSpacing;

  return baseConfig;
}

/**
 * Lazy loading utility for progressive data loading
 */
export class LazyLoader<T> {
  private data: T[];
  private loadedChunks: Set<number> = new Set();
  private chunkSize: number;
  private loader: (startIndex: number, endIndex: number) => Promise<T[]>;

  constructor(
    initialData: T[],
    chunkSize: number = 100,
    loader?: (startIndex: number, endIndex: number) => Promise<T[]>
  ) {
    this.data = initialData;
    this.chunkSize = chunkSize;
    this.loader = loader || this.defaultLoader;
  }

  private defaultLoader = async (
    _startIndex: number,
    _endIndex: number
  ): Promise<T[]> => {
    // Default implementation returns empty array
    return [];
  };

  /**
   * Get data for a specific range, loading if necessary
   */
  async getRange(startIndex: number, endIndex: number): Promise<T[]> {
    const result: T[] = [];

    for (let i = startIndex; i <= endIndex; i++) {
      const chunkIndex = Math.floor(i / this.chunkSize);

      if (!this.loadedChunks.has(chunkIndex)) {
        await this.loadChunk(chunkIndex);
      }

      const item = this.data[i];
      if (item !== null && item !== undefined) {
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Load a specific chunk of data
   */
  private async loadChunk(chunkIndex: number): Promise<void> {
    if (this.loadedChunks.has(chunkIndex)) {
      return;
    }

    const startIndex = chunkIndex * this.chunkSize;
    const endIndex = Math.min(
      startIndex + this.chunkSize - 1,
      this.data.length - 1
    );

    try {
      const chunkData = await this.loader(startIndex, endIndex);

      // Insert chunk data into the main array
      for (let i = 0; i < chunkData.length; i++) {
        const dataIndex = startIndex + i;
        const chunkItem = chunkData[i];
        if (dataIndex < this.data.length && chunkItem !== undefined) {
          this.data[dataIndex] = chunkItem;
        }
      }

      this.loadedChunks.add(chunkIndex);
    } catch (error) {
      console.warn(`Failed to load chunk ${chunkIndex}:`, error);
    }
  }

  /**
   * Preload chunks around a specific range
   */
  async preloadAround(centerIndex: number, radius: number = 2): Promise<void> {
    const centerChunk = Math.floor(centerIndex / this.chunkSize);
    const startChunk = Math.max(0, centerChunk - radius);
    const endChunk = Math.min(
      Math.floor(this.data.length / this.chunkSize),
      centerChunk + radius
    );

    const loadPromises: Promise<void>[] = [];
    for (let chunkIndex = startChunk; chunkIndex <= endChunk; chunkIndex++) {
      loadPromises.push(this.loadChunk(chunkIndex));
    }

    await Promise.all(loadPromises);
  }

  /**
   * Get total data length
   */
  get length(): number {
    return this.data.length;
  }

  /**
   * Check if a chunk is loaded
   */
  isChunkLoaded(chunkIndex: number): boolean {
    return this.loadedChunks.has(chunkIndex);
  }

  /**
   * Clear loaded chunks to free memory
   */
  clearCache(): void {
    this.loadedChunks.clear();
  }
}

/**
 * Memory optimization utilities
 */
export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private memoryUsage: Map<string, number> = new Map();
  private maxMemoryUsage: number = 50 * 1024 * 1024; // 50MB default

  static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  /**
   * Track memory usage for a component
   */
  trackMemoryUsage(componentId: string, bytes: number): void {
    this.memoryUsage.set(componentId, bytes);

    if (this.getTotalMemoryUsage() > this.maxMemoryUsage) {
      this.triggerGarbageCollection();
    }
  }

  /**
   * Get total memory usage
   */
  getTotalMemoryUsage(): number {
    return Array.from(this.memoryUsage.values()).reduce(
      (sum, usage) => sum + usage,
      0
    );
  }

  /**
   * Trigger garbage collection for least recently used items
   */
  private triggerGarbageCollection(): void {
    // Simple LRU implementation - remove oldest entries
    const entries = Array.from(this.memoryUsage.entries());
    const toRemove = Math.ceil(entries.length * 0.3); // Remove 30% of entries

    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i];
      if (entry) {
        this.memoryUsage.delete(entry[0]);
      }
    }
  }

  /**
   * Clear memory tracking for a component
   */
  clearMemoryTracking(componentId: string): void {
    this.memoryUsage.delete(componentId);
  }

  /**
   * Set maximum memory usage threshold
   */
  setMaxMemoryUsage(bytes: number): void {
    this.maxMemoryUsage = bytes;
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static measurements: Map<string, number[]> = new Map();

  /**
   * Start performance measurement
   */
  static startMeasurement(key: string): void {
    const startTime = performance.now();
    const measurements = this.measurements.get(key) || [];
    measurements.push(startTime);
    this.measurements.set(key, measurements);
  }

  /**
   * End performance measurement and return duration
   */
  static endMeasurement(key: string): number {
    const measurements = this.measurements.get(key) || [];
    if (measurements.length === 0) {
      return 0;
    }

    const startTime = measurements.pop()!;
    const duration = performance.now() - startTime;

    return duration;
  }

  /**
   * Get average measurement for a key
   */
  static getAverageMeasurement(key: string): number {
    const measurements = this.measurements.get(key) || [];
    if (measurements.length === 0) {
      return 0;
    }

    const sum = measurements.reduce((acc, val) => acc + val, 0);
    return sum / measurements.length;
  }

  /**
   * Clear measurements
   */
  static clearMeasurements(key?: string): void {
    if (key) {
      this.measurements.delete(key);
    } else {
      this.measurements.clear();
    }
  }
}
