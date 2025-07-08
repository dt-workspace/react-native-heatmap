/**
 * Animation utilities for React Native Heatmap
 * Provides smooth entry animations and transitions
 */

import type { AnimationConfig } from '../types';

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enabled: true,
  duration: 300,
  easing: 'ease-out',
  staggerDelay: 10,
  entryAnimation: 'fade',
  useNativeDriver: true,
};

/**
 * Animation timing function mapping
 */
export const ANIMATION_EASING = {
  'linear': 'linear',
  'ease': 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
} as const;

/**
 * Calculate staggered delay for cell animations
 */
export function calculateStaggerDelay(
  index: number,
  _totalCells: number,
  config: AnimationConfig
): number {
  const { staggerDelay = 0, entryAnimation = 'fade' } = config;

  if (entryAnimation === 'none' || staggerDelay === 0) {
    return 0;
  }

  // For large datasets, limit stagger to avoid long delays
  const maxDelay = Math.min(staggerDelay * 50, 500);
  const delay = (index * staggerDelay) % maxDelay;

  return delay;
}

/**
 * Get animation style for entry animation
 */
export function getEntryAnimationStyle(
  entryAnimation: AnimationConfig['entryAnimation'],
  progress: number
): Record<string, any> {
  switch (entryAnimation) {
    case 'fade':
      return {
        opacity: progress,
      };

    case 'scale':
      return {
        opacity: progress,
        transform: [{ scale: 0.3 + progress * 0.7 }],
      };

    case 'slide':
      return {
        opacity: progress,
        transform: [{ translateY: (1 - progress) * 20 }],
      };

    case 'none':
    default:
      return {
        opacity: 1,
      };
  }
}

/**
 * Create animation sequence for multiple cells
 */
export function createCellAnimationSequence(
  cellCount: number,
  config: AnimationConfig
): Array<{ delay: number; duration: number }> {
  const animations = [];

  for (let i = 0; i < cellCount; i++) {
    const delay = calculateStaggerDelay(i, cellCount, config);
    animations.push({
      delay,
      duration: config.duration,
    });
  }

  return animations;
}

/**
 * Merge animation configurations
 */
export function mergeAnimationConfig(
  defaultConfig: AnimationConfig,
  userConfig?: Partial<AnimationConfig>
): AnimationConfig {
  return {
    ...defaultConfig,
    ...userConfig,
  };
}

/**
 * Check if animations are supported
 */
export function isAnimationSupported(): boolean {
  try {
    // Check if reanimated is available
    require('react-native-reanimated');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get optimal animation duration based on dataset size
 */
export function getOptimalAnimationDuration(
  cellCount: number,
  baseDuration: number = 300
): number {
  // For large datasets, reduce animation duration to improve performance
  if (cellCount > 500) {
    return Math.max(baseDuration * 0.5, 150);
  }

  if (cellCount > 200) {
    return Math.max(baseDuration * 0.7, 200);
  }

  return baseDuration;
}
