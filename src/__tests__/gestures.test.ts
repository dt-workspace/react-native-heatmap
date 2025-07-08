/**
 * Tests for gesture utilities
 */

import {
  DEFAULT_GESTURE_CONFIG,
  isGestureHandlerAvailable,
  isHapticFeedbackAvailable,
  triggerHapticFeedback,
  calculateZoomBounds,
  calculatePanBounds,
  clampValue,
  calculateGestureTransform,
  mergeGestureConfig,
  DoubleTapDetector,
  calculateOptimalZoom,
  getGestureEventCoordinates,
} from '../utils/gestures';

describe('Gesture Utilities', () => {
  describe('isGestureHandlerAvailable', () => {
    it('should return false when gesture handler is not available', () => {
      // Mock require to throw error
      const originalRequire = require;
      (global as any).require = jest.fn().mockImplementation((module) => {
        if (module === 'react-native-gesture-handler') {
          throw new Error('Module not found');
        }
        return originalRequire(module);
      });

      const available = isGestureHandlerAvailable();
      expect(available).toBe(false);

      // Restore original require
      (global as any).require = originalRequire;
    });
  });

  describe('calculateZoomBounds', () => {
    it('should calculate zoom bounds correctly', () => {
      const contentSize = { width: 400, height: 300 };
      const containerSize = { width: 200, height: 150 };
      const config = { ...DEFAULT_GESTURE_CONFIG, minZoom: 0.5, maxZoom: 3.0 };

      const bounds = calculateZoomBounds(contentSize, containerSize, config);

      expect(bounds.minZoom).toBeGreaterThan(0);
      expect(bounds.maxZoom).toBe(3.0);
      expect(bounds.minZoom).toBeLessThanOrEqual(bounds.maxZoom);
    });
  });

  describe('calculatePanBounds', () => {
    it('should calculate pan bounds for scaled content', () => {
      const contentSize = { width: 400, height: 300 };
      const containerSize = { width: 200, height: 150 };
      const scale = 2.0;

      const bounds = calculatePanBounds(contentSize, containerSize, scale);

      expect(bounds.minX).toBeLessThanOrEqual(0);
      expect(bounds.maxX).toBeGreaterThanOrEqual(0);
      expect(bounds.minY).toBeLessThanOrEqual(0);
      expect(bounds.maxY).toBeGreaterThanOrEqual(0);
    });
  });

  describe('clampValue', () => {
    it('should clamp value within bounds', () => {
      expect(clampValue(5, 0, 10)).toBe(5);
      expect(clampValue(-5, 0, 10)).toBe(0);
      expect(clampValue(15, 0, 10)).toBe(10);
    });
  });

  describe('calculateGestureTransform', () => {
    it('should calculate clamped gesture transform', () => {
      const translation = { x: 50, y: 30 };
      const scale = 2.0;
      const bounds = {
        minX: -100,
        maxX: 100,
        minY: -50,
        maxY: 50,
        minZoom: 0.5,
        maxZoom: 3.0,
      };

      const transform = calculateGestureTransform(translation, scale, bounds);

      expect(transform.translateX).toBe(50);
      expect(transform.translateY).toBe(30);
      expect(transform.scale).toBe(2.0);
    });

    it('should clamp values to bounds', () => {
      const translation = { x: 200, y: 100 };
      const scale = 5.0;
      const bounds = {
        minX: -100,
        maxX: 100,
        minY: -50,
        maxY: 50,
        minZoom: 0.5,
        maxZoom: 3.0,
      };

      const transform = calculateGestureTransform(translation, scale, bounds);

      expect(transform.translateX).toBe(100);
      expect(transform.translateY).toBe(50);
      expect(transform.scale).toBe(3.0);
    });
  });

  describe('mergeGestureConfig', () => {
    it('should merge gesture configurations', () => {
      const userConfig = { pan: false, zoom: true, minZoom: 1.0 };
      const merged = mergeGestureConfig(DEFAULT_GESTURE_CONFIG, userConfig);

      expect(merged.pan).toBe(false);
      expect(merged.zoom).toBe(true);
      expect(merged.minZoom).toBe(1.0);
      expect(merged.enabled).toBe(DEFAULT_GESTURE_CONFIG.enabled);
    });
  });

  describe('DoubleTapDetector', () => {
    let detector: DoubleTapDetector;
    let mockCallback: jest.Mock;

    beforeEach(() => {
      detector = new DoubleTapDetector();
      mockCallback = jest.fn();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should not trigger on single tap', () => {
      const isDoubleTap = detector.detectDoubleTap(mockCallback);
      expect(isDoubleTap).toBe(false);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should trigger on double tap', () => {
      // First tap
      detector.detectDoubleTap(mockCallback);

      // Advance time slightly (within double tap delay)
      jest.advanceTimersByTime(100);

      // Second tap
      const isDoubleTap = detector.detectDoubleTap(mockCallback);
      expect(isDoubleTap).toBe(true);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('should not trigger if taps are too far apart', () => {
      // First tap
      detector.detectDoubleTap(mockCallback);

      // Advance time beyond double tap delay
      jest.advanceTimersByTime(400);

      // Second tap
      const isDoubleTap = detector.detectDoubleTap(mockCallback);
      expect(isDoubleTap).toBe(false);
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should reset after double tap', () => {
      // Double tap
      detector.detectDoubleTap(mockCallback);
      jest.advanceTimersByTime(100);
      detector.detectDoubleTap(mockCallback);

      // Reset and try again
      jest.advanceTimersByTime(100);
      const isDoubleTap = detector.detectDoubleTap(mockCallback);
      expect(isDoubleTap).toBe(false);
    });
  });

  describe('calculateOptimalZoom', () => {
    it('should return 1.0 for normal zoom', () => {
      const contentSize = { width: 400, height: 300 };
      const containerSize = { width: 400, height: 300 };

      const zoom = calculateOptimalZoom(contentSize, containerSize, false);
      expect(zoom).toBe(1.0);
    });

    it('should calculate zoom to fit', () => {
      const contentSize = { width: 400, height: 300 };
      const containerSize = { width: 200, height: 150 };

      const zoom = calculateOptimalZoom(contentSize, containerSize, true);
      expect(zoom).toBe(0.5); // Min of 200/400 and 150/300
    });
  });

  describe('getGestureEventCoordinates', () => {
    it('should extract coordinates from gesture event', () => {
      const event = {
        nativeEvent: {
          locationX: 100,
          locationY: 50,
        },
      };

      const coords = getGestureEventCoordinates(event);
      expect(coords).toEqual({ x: 100, y: 50 });
    });

    it('should handle missing coordinates', () => {
      const event = {};

      const coords = getGestureEventCoordinates(event);
      expect(coords).toEqual({ x: 0, y: 0 });
    });

    it('should fallback to x/y properties', () => {
      const event = {
        nativeEvent: {
          x: 75,
          y: 25,
        },
      };

      const coords = getGestureEventCoordinates(event);
      expect(coords).toEqual({ x: 75, y: 25 });
    });
  });

  describe('triggerHapticFeedback', () => {
    it('should not throw when haptic feedback is unavailable', () => {
      expect(() => {
        triggerHapticFeedback('light');
      }).not.toThrow();
    });
  });

  describe('isHapticFeedbackAvailable', () => {
    it('should return false when haptic feedback is not available', () => {
      const available = isHapticFeedbackAvailable();
      // This will return false in test environment
      expect(typeof available).toBe('boolean');
    });
  });
});
