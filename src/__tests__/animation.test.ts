/**
 * Tests for animation utilities
 */

import {
  DEFAULT_ANIMATION_CONFIG,
  calculateStaggerDelay,
  getEntryAnimationStyle,
  createCellAnimationSequence,
  mergeAnimationConfig,
  isAnimationSupported,
  getOptimalAnimationDuration,
} from '../utils/animation';

describe('Animation Utilities', () => {
  describe('calculateStaggerDelay', () => {
    it('should return 0 for no stagger delay', () => {
      const config = { ...DEFAULT_ANIMATION_CONFIG, staggerDelay: 0 };
      const delay = calculateStaggerDelay(5, 100, config);
      expect(delay).toBe(0);
    });

    it('should calculate stagger delay correctly', () => {
      const config = { ...DEFAULT_ANIMATION_CONFIG, staggerDelay: 10 };
      const delay = calculateStaggerDelay(5, 100, config);
      expect(delay).toBe(50);
    });

    it('should limit maximum delay', () => {
      const config = { ...DEFAULT_ANIMATION_CONFIG, staggerDelay: 100 };
      const delay = calculateStaggerDelay(10, 100, config);
      expect(delay).toBeLessThanOrEqual(500);
    });

    it('should return 0 for none animation', () => {
      const config = {
        ...DEFAULT_ANIMATION_CONFIG,
        entryAnimation: 'none' as const,
      };
      const delay = calculateStaggerDelay(5, 100, config);
      expect(delay).toBe(0);
    });
  });

  describe('getEntryAnimationStyle', () => {
    it('should return fade animation style', () => {
      const style = getEntryAnimationStyle('fade', 0.5);
      expect(style).toEqual({ opacity: 0.5 });
    });

    it('should return scale animation style', () => {
      const style = getEntryAnimationStyle('scale', 0.5);
      expect(style.opacity).toBe(0.5);
      expect(style.transform).toHaveLength(1);
      expect(style.transform[0].scale).toBeCloseTo(0.65, 5);
    });

    it('should return slide animation style', () => {
      const style = getEntryAnimationStyle('slide', 0.5);
      expect(style).toEqual({
        opacity: 0.5,
        transform: [{ translateY: 10 }],
      });
    });

    it('should return default style for none animation', () => {
      const style = getEntryAnimationStyle('none', 0.5);
      expect(style).toEqual({ opacity: 1 });
    });
  });

  describe('createCellAnimationSequence', () => {
    it('should create animation sequence for cells', () => {
      const config = { ...DEFAULT_ANIMATION_CONFIG, staggerDelay: 10 };
      const sequence = createCellAnimationSequence(3, config);

      expect(sequence).toHaveLength(3);
      expect(sequence[0]).toEqual({ delay: 0, duration: 300 });
      expect(sequence[1]).toEqual({ delay: 10, duration: 300 });
      expect(sequence[2]).toEqual({ delay: 20, duration: 300 });
    });
  });

  describe('mergeAnimationConfig', () => {
    it('should merge animation configurations', () => {
      const userConfig = { duration: 500, entryAnimation: 'scale' as const };
      const merged = mergeAnimationConfig(DEFAULT_ANIMATION_CONFIG, userConfig);

      expect(merged.duration).toBe(500);
      expect(merged.entryAnimation).toBe('scale');
      expect(merged.enabled).toBe(DEFAULT_ANIMATION_CONFIG.enabled);
    });
  });

  describe('isAnimationSupported', () => {
    it('should return false when reanimated is not available', () => {
      // Mock require to throw error
      const originalRequire = require;
      (global as any).require = jest.fn().mockImplementation((module) => {
        if (module === 'react-native-reanimated') {
          throw new Error('Module not found');
        }
        return originalRequire(module);
      });

      const supported = isAnimationSupported();
      expect(supported).toBe(false);

      // Restore original require
      (global as any).require = originalRequire;
    });
  });

  describe('getOptimalAnimationDuration', () => {
    it('should return base duration for small datasets', () => {
      const duration = getOptimalAnimationDuration(100, 300);
      expect(duration).toBe(300);
    });

    it('should reduce duration for medium datasets', () => {
      const duration = getOptimalAnimationDuration(300, 300);
      expect(duration).toBe(210); // 300 * 0.7
    });

    it('should reduce duration for large datasets', () => {
      const duration = getOptimalAnimationDuration(600, 300);
      expect(duration).toBe(150); // 300 * 0.5
    });

    it('should respect minimum duration', () => {
      const duration = getOptimalAnimationDuration(1000, 100);
      expect(duration).toBe(150); // Minimum 150ms
    });
  });
});
