/**
 * Animated Cell component for React Native Heatmap
 * Provides smooth animations and enhanced touch handling
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { Rect } from 'react-native-svg';
import type { ProcessedCellData, AnimationConfig, CellShape } from '../types';
import {
  getEntryAnimationStyle,
  calculateStaggerDelay,
} from '../utils/animation';
import { triggerHapticFeedback, DoubleTapDetector } from '../utils/gestures';

interface AnimatedCellProps {
  /** Cell data */
  data: ProcessedCellData;
  /** Cell index */
  index: number;
  /** Total number of cells */
  totalCells: number;
  /** Cell size */
  cellSize: number;
  /** Cell spacing */
  cellSpacing: number;
  /** Cell shape */
  cellShape: CellShape;
  /** Animation configuration */
  animationConfig?: AnimationConfig;
  /** Border color */
  borderColor: string;
  /** Border width */
  borderWidth: number;
  /** Custom cell styles */
  cellStyle?: any;
  /** Touch handlers */
  onPress?: (data: ProcessedCellData, index: number) => void;
  onLongPress?: (data: ProcessedCellData, index: number) => void;
  onPressIn?: (data: ProcessedCellData, index: number) => void;
  onPressOut?: (data: ProcessedCellData, index: number) => void;
  onDoublePress?: (data: ProcessedCellData, index: number) => void;
  /** Haptic feedback enabled */
  hapticFeedback?: boolean;
  /** Whether to use SVG rendering */
  useSvg?: boolean;
}

/**
 * Animated Cell Component
 */
const AnimatedCell: React.FC<AnimatedCellProps> = ({
  data,
  index,
  totalCells,
  cellSize,
  cellSpacing,
  cellShape,
  animationConfig,
  borderColor,
  borderWidth,
  cellStyle,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  onDoublePress,
  hapticFeedback = false,
  useSvg = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const doubleTapDetector = useRef(new DoubleTapDetector()).current;

  // Calculate position
  const x = data.x * (cellSize + cellSpacing);
  const y = data.y * (cellSize + cellSpacing);

  // Entry animation
  useEffect(() => {
    if (!animationConfig?.enabled) {
      animatedValue.setValue(1);
      return;
    }

    const delay = calculateStaggerDelay(index, totalCells, animationConfig);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: animationConfig.duration,
      delay,
      useNativeDriver: animationConfig.useNativeDriver ?? true,
    }).start();
  }, [animatedValue, index, totalCells, animationConfig]);

  // Handle press with haptic feedback
  const handlePress = useCallback(() => {
    if (hapticFeedback) {
      triggerHapticFeedback('light');
    }

    // Check for double tap
    if (onDoublePress) {
      const isDoubleTap = doubleTapDetector.detectDoubleTap(() => {
        onDoublePress(data, index);
      });

      if (isDoubleTap) {
        return;
      }
    }

    // Single tap after delay
    setTimeout(
      () => {
        onPress?.(data, index);
      },
      onDoublePress ? 150 : 0
    );
  }, [data, index, onPress, onDoublePress, hapticFeedback, doubleTapDetector]);

  // Handle long press
  const handleLongPress = useCallback(() => {
    if (hapticFeedback) {
      triggerHapticFeedback('medium');
    }
    onLongPress?.(data, index);
  }, [data, index, onLongPress, hapticFeedback]);

  // Handle press in
  const handlePressIn = useCallback(() => {
    // Scale animation
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    onPressIn?.(data, index);
  }, [data, index, onPressIn, scaleValue]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    // Scale animation
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    onPressOut?.(data, index);
  }, [data, index, onPressOut, scaleValue]);

  // Get cell border radius
  const getBorderRadius = useCallback(() => {
    switch (cellShape) {
      case 'circle':
        return cellSize / 2;
      case 'rounded':
        return 2;
      default:
        return 0;
    }
  }, [cellShape, cellSize]);

  // Animation styles
  const animationStyles = animationConfig?.enabled
    ? getEntryAnimationStyle(
        animationConfig.entryAnimation,
        animatedValue as any
      )
    : {};

  if (useSvg) {
    // SVG rendering (for integration with existing SVG-based heatmap)
    const cellProps = {
      x,
      y,
      width: cellSize,
      height: cellSize,
      fill: data.color,
      stroke: borderColor,
      strokeWidth: borderWidth,
      onPress: handlePress,
      onLongPress: handleLongPress,
      ...cellStyle,
    };

    if (cellShape === 'circle') {
      return (
        <Rect
          key={`cell-${index}`}
          {...cellProps}
          rx={cellSize / 2}
          ry={cellSize / 2}
        />
      );
    }

    if (cellShape === 'rounded') {
      return <Rect key={`cell-${index}`} {...cellProps} rx={2} ry={2} />;
    }

    return <Rect key={`cell-${index}`} {...cellProps} />;
  }

  // React Native View rendering (for enhanced animations)
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: cellSize,
          height: cellSize,
          transform: [{ scale: scaleValue }],
        },
        animationStyles,
      ]}
    >
      <TouchableOpacity
        style={[
          {
            flex: 1,
            backgroundColor: data.color,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderRadius: getBorderRadius(),
          },
          cellStyle,
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={500}
        activeOpacity={0.8}
      />
    </Animated.View>
  );
};

export default AnimatedCell;
