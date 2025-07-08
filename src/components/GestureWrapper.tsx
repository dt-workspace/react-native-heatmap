/**
 * Gesture Wrapper component for React Native Heatmap
 * Provides pan, zoom, and gesture handling when react-native-gesture-handler is available
 */

import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import type { GestureConfig } from '../types';
import { isGestureHandlerAvailable } from '../utils/gestures';

interface GestureWrapperProps {
  /** Child components */
  children: React.ReactNode;
  /** Gesture configuration */
  config: GestureConfig;
  /** Container style */
  style?: any;
  /** Content dimensions */
  contentSize?: { width: number; height: number };
  /** Container dimensions */
  containerSize?: { width: number; height: number };
  /** Gesture event callbacks */
  onPanGesture?: (event: any) => void;
  onZoomGesture?: (event: any) => void;
  onSwipeGesture?: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

/**
 * Gesture Wrapper Component
 * Conditionally renders with gesture support if react-native-gesture-handler is available
 */
const GestureWrapper: React.FC<GestureWrapperProps> = ({
  children,
  config,
  style,
  contentSize: _contentSize,
  containerSize: _containerSize,
  onPanGesture,
  onZoomGesture,
  onSwipeGesture,
}) => {
  const panRef = useRef(null);
  const pinchRef = useRef(null);

  // Check if gesture handler is available
  const gestureHandlerAvailable = isGestureHandlerAvailable();

  // If gestures are disabled or not available, render simple view
  if (!config.enabled || !gestureHandlerAvailable) {
    return <View style={style}>{children}</View>;
  }

  try {
    // Import gesture handler components
    const {
      GestureDetector,
      Gesture,
      GestureHandlerRootView,
    } = require('react-native-gesture-handler');

    // Pan gesture
    const panGesture = config.pan
      ? Gesture.Pan()
          .onUpdate((event: any) => {
            onPanGesture?.(event);
          })
          .withRef(panRef)
      : undefined;

    // Pinch gesture
    const pinchGesture = config.zoom
      ? Gesture.Pinch()
          .onUpdate((event: any) => {
            onZoomGesture?.(event);
          })
          .withRef(pinchRef)
      : undefined;

    // Fling gesture for swipe detection
    const flingGesture = config.swipe
      ? Gesture.Fling()
          .direction(
            Gesture.DIRECTIONS.UP |
              Gesture.DIRECTIONS.DOWN |
              Gesture.DIRECTIONS.LEFT |
              Gesture.DIRECTIONS.RIGHT
          )
          .onEnd((event: any) => {
            const { velocityX, velocityY } = event;

            // Determine swipe direction based on velocity
            if (Math.abs(velocityX) > Math.abs(velocityY)) {
              onSwipeGesture?.(velocityX > 0 ? 'right' : 'left');
            } else {
              onSwipeGesture?.(velocityY > 0 ? 'down' : 'up');
            }
          })
      : undefined;

    // Combine gestures
    const gestures = [panGesture, pinchGesture, flingGesture].filter(Boolean);

    if (gestures.length === 0) {
      return <View style={style}>{children}</View>;
    }

    // Create composed gesture
    let composedGesture = gestures[0];
    for (let i = 1; i < gestures.length; i++) {
      if (gestures[i]) {
        composedGesture = Gesture.Simultaneous(composedGesture!, gestures[i]!);
      }
    }

    return (
      <GestureHandlerRootView style={style}>
        <GestureDetector gesture={composedGesture!}>
          <View style={{ flex: 1 }}>{children}</View>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  } catch (error) {
    // Fallback if gesture handler import fails
    console.warn(
      'react-native-gesture-handler not available, gestures disabled'
    );
    return <View style={style}>{children}</View>;
  }
};

/**
 * Simple gesture wrapper for basic touch handling
 * Used when react-native-gesture-handler is not available
 */
const SimpleGestureWrapper: React.FC<GestureWrapperProps> = ({
  children,
  style,
  onPanGesture,
}) => {
  const handleTouchMove = useCallback(
    (event: any) => {
      if (onPanGesture) {
        // Simple pan gesture simulation
        const { locationX, locationY } = event.nativeEvent;
        onPanGesture({
          translationX: locationX,
          translationY: locationY,
        });
      }
    },
    [onPanGesture]
  );

  return (
    <View style={style} onTouchMove={handleTouchMove}>
      {children}
    </View>
  );
};

export default GestureWrapper;
export { SimpleGestureWrapper };
