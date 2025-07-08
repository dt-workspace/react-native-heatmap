/**
 * Gesture utilities for React Native Heatmap
 * Provides pan, zoom, and touch gesture handling
 */

import type { GestureConfig } from '../types';

/**
 * Default gesture configuration
 */
export const DEFAULT_GESTURE_CONFIG: GestureConfig = {
  enabled: true,
  pan: true,
  zoom: true,
  swipe: false,
  minZoom: 0.5,
  maxZoom: 3.0,
  hapticFeedback: true,
};

/**
 * Check if gesture handler is available
 */
export function isGestureHandlerAvailable(): boolean {
  try {
    require('react-native-gesture-handler');
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if haptic feedback is available
 */
export function isHapticFeedbackAvailable(): boolean {
  try {
    const { HapticFeedback } = require('react-native');
    return !!HapticFeedback;
  } catch {
    try {
      // Check for expo-haptics
      require('expo-haptics');
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Trigger haptic feedback
 */
export function triggerHapticFeedback(
  type: 'light' | 'medium' | 'heavy' | 'selection' = 'light'
): void {
  try {
    // Try React Native built-in haptic feedback
    const { HapticFeedback } = require('react-native');
    if (HapticFeedback) {
      HapticFeedback.trigger(type);
      return;
    }
  } catch {
    // Fallback to Expo haptics
    try {
      const { Haptics } = require('expo-haptics');
      const hapticMap = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
        selection: Haptics.NotificationFeedbackType.Success,
      };

      if (type === 'selection') {
        Haptics.notificationAsync(hapticMap[type]);
      } else {
        Haptics.impactAsync(hapticMap[type]);
      }
    } catch {
      // Silently fail if no haptic feedback available
    }
  }
}

/**
 * Calculate zoom bounds
 */
export function calculateZoomBounds(
  contentSize: { width: number; height: number },
  containerSize: { width: number; height: number },
  config: GestureConfig
): { minZoom: number; maxZoom: number } {
  const scaleX = containerSize.width / contentSize.width;
  const scaleY = containerSize.height / contentSize.height;
  const minFitScale = Math.min(scaleX, scaleY);

  return {
    minZoom: Math.max(config.minZoom || 0.5, minFitScale * 0.5),
    maxZoom: config.maxZoom || 3.0,
  };
}

/**
 * Calculate pan bounds to keep content within container
 */
export function calculatePanBounds(
  contentSize: { width: number; height: number },
  containerSize: { width: number; height: number },
  scale: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  const scaledWidth = contentSize.width * scale;
  const scaledHeight = contentSize.height * scale;

  const minX = Math.min(0, containerSize.width - scaledWidth);
  const maxX = Math.max(0, containerSize.width - scaledWidth);
  const minY = Math.min(0, containerSize.height - scaledHeight);
  const maxY = Math.max(0, containerSize.height - scaledHeight);

  return { minX, maxX, minY, maxY };
}

/**
 * Clamp value within bounds
 */
export function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate gesture transform
 */
export function calculateGestureTransform(
  translation: { x: number; y: number },
  scale: number,
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZoom: number;
    maxZoom: number;
  }
): { translateX: number; translateY: number; scale: number } {
  const clampedScale = clampValue(scale, bounds.minZoom, bounds.maxZoom);
  const clampedTranslateX = clampValue(translation.x, bounds.minX, bounds.maxX);
  const clampedTranslateY = clampValue(translation.y, bounds.minY, bounds.maxY);

  return {
    translateX: clampedTranslateX,
    translateY: clampedTranslateY,
    scale: clampedScale,
  };
}

/**
 * Merge gesture configurations
 */
export function mergeGestureConfig(
  defaultConfig: GestureConfig,
  userConfig?: Partial<GestureConfig>
): GestureConfig {
  return {
    ...defaultConfig,
    ...userConfig,
  };
}

/**
 * Detect double tap gesture
 */
export class DoubleTapDetector {
  private lastTap: number = 0;
  private readonly doubleTapDelay: number = 300;

  public detectDoubleTap(callback: () => void): boolean {
    const now = Date.now();
    const timeDiff = now - this.lastTap;

    if (timeDiff < this.doubleTapDelay) {
      callback();
      this.lastTap = 0;
      return true;
    }

    this.lastTap = now;
    return false;
  }

  public reset(): void {
    this.lastTap = 0;
  }
}

/**
 * Calculate optimal zoom level for content
 */
export function calculateOptimalZoom(
  contentSize: { width: number; height: number },
  containerSize: { width: number; height: number },
  zoomToFit: boolean = false
): number {
  if (zoomToFit) {
    const scaleX = containerSize.width / contentSize.width;
    const scaleY = containerSize.height / contentSize.height;
    return Math.min(scaleX, scaleY);
  }

  return 1.0;
}

/**
 * Get gesture event coordinates
 */
export function getGestureEventCoordinates(event: any): {
  x: number;
  y: number;
} {
  if (event.nativeEvent) {
    return {
      x: event.nativeEvent.locationX || event.nativeEvent.x || 0,
      y: event.nativeEvent.locationY || event.nativeEvent.y || 0,
    };
  }

  return { x: 0, y: 0 };
}
