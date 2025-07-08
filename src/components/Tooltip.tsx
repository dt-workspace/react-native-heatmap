/**
 * Tooltip component for React Native Heatmap
 * Provides configurable tooltips with custom positioning
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { HeatmapData, TooltipConfig, Theme } from '../types';

interface TooltipProps {
  /** The data for the cell being hovered */
  data: HeatmapData;
  /** Position of the cell */
  cellPosition: { x: number; y: number };
  /** Cell size */
  cellSize: number;
  /** Tooltip configuration */
  config: TooltipConfig;
  /** Theme configuration */
  theme: Theme;
  /** Container dimensions */
  containerDimensions: { width: number; height: number };
  /** Whether tooltip is visible */
  visible: boolean;
}

// Note: screenWidth and screenHeight available if needed for future features
// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Default tooltip renderer
 */
const DefaultTooltipContent: React.FC<{ data: HeatmapData; theme: Theme }> = ({
  data,
  theme,
}) => (
  <View
    style={[styles.defaultContent, { backgroundColor: theme.colors.tooltip }]}
  >
    <Text style={[styles.defaultText, { color: theme.colors.tooltipText }]}>
      {data.date}
    </Text>
    <Text style={[styles.defaultText, { color: theme.colors.tooltipText }]}>
      Value: {data.value}
    </Text>
  </View>
);

/**
 * Calculate tooltip position to avoid screen edges
 */
function calculateTooltipPosition(
  cellPosition: { x: number; y: number },
  cellSize: number,
  tooltipSize: { width: number; height: number },
  containerDimensions: { width: number; height: number },
  preferredPosition: TooltipConfig['position'],
  offset: number
): { x: number; y: number; position: string } {
  const cellCenterX = cellPosition.x + cellSize / 2;
  const cellCenterY = cellPosition.y + cellSize / 2;

  const tooltipWidth = tooltipSize.width;
  const tooltipHeight = tooltipSize.height;

  // Calculate positions for each direction
  const positions = {
    top: {
      x: cellCenterX - tooltipWidth / 2,
      y: cellPosition.y - tooltipHeight - offset,
      position: 'top',
    },
    bottom: {
      x: cellCenterX - tooltipWidth / 2,
      y: cellPosition.y + cellSize + offset,
      position: 'bottom',
    },
    left: {
      x: cellPosition.x - tooltipWidth - offset,
      y: cellCenterY - tooltipHeight / 2,
      position: 'left',
    },
    right: {
      x: cellPosition.x + cellSize + offset,
      y: cellCenterY - tooltipHeight / 2,
      position: 'right',
    },
  };

  // Check if preferred position fits
  if (preferredPosition && preferredPosition !== 'auto') {
    const pos = positions[preferredPosition];
    if (
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x + tooltipWidth <= containerDimensions.width &&
      pos.y + tooltipHeight <= containerDimensions.height
    ) {
      return pos;
    }
  }

  // Auto-position: find the best fit
  const positionOrder = ['top', 'bottom', 'right', 'left'] as const;

  for (const posKey of positionOrder) {
    const pos = positions[posKey];
    if (
      pos.x >= 0 &&
      pos.y >= 0 &&
      pos.x + tooltipWidth <= containerDimensions.width &&
      pos.y + tooltipHeight <= containerDimensions.height
    ) {
      return pos;
    }
  }

  // If no position fits perfectly, use top and clamp to screen
  const fallbackPos = positions.top;
  return {
    x: Math.max(
      0,
      Math.min(fallbackPos.x, containerDimensions.width - tooltipWidth)
    ),
    y: Math.max(
      0,
      Math.min(fallbackPos.y, containerDimensions.height - tooltipHeight)
    ),
    position: 'top',
  };
}

/**
 * Tooltip component
 */
const Tooltip: React.FC<TooltipProps> = ({
  data,
  cellPosition,
  cellSize,
  config,
  theme,
  containerDimensions,
  visible,
}) => {
  const tooltipStyle = useMemo(() => {
    const baseStyle = {
      backgroundColor: config.backgroundColor || theme.colors.tooltip,
      maxWidth: 200,
      ...styles.tooltip,
      ...(config.borderRadius && { borderRadius: config.borderRadius }),
      ...(config.padding && { padding: config.padding }),
    };

    if (config.shadow) {
      return {
        ...baseStyle,
        ...styles.shadow,
      };
    }

    return baseStyle;
  }, [config, theme]);

  const position = useMemo(() => {
    // Estimate tooltip size (this is approximate)
    const estimatedSize = { width: 120, height: 60 };

    return calculateTooltipPosition(
      cellPosition,
      cellSize,
      estimatedSize,
      containerDimensions,
      config.position,
      config.offset || 8
    );
  }, [
    cellPosition,
    cellSize,
    containerDimensions,
    config.position,
    config.offset,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        tooltipStyle,
        {
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex: 1000,
        },
      ]}
      pointerEvents="none"
    >
      {config.content ? (
        config.content(data)
      ) : (
        <DefaultTooltipContent data={data} theme={theme} />
      )}

      {config.showArrow && (
        <View
          style={[
            styles.arrow,
            getArrowStyle(position.position),
            {
              backgroundColor: config.backgroundColor || theme.colors.tooltip,
            },
          ]}
        />
      )}
    </View>
  );
};

/**
 * Get arrow style based on tooltip position
 */
function getArrowStyle(position: string): any {
  const arrowSize = 6;

  switch (position) {
    case 'top':
      return {
        bottom: -arrowSize,
        left: '50%',
        marginLeft: -arrowSize / 2,
        borderLeftWidth: arrowSize,
        borderRightWidth: arrowSize,
        borderTopWidth: arrowSize,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      };

    case 'bottom':
      return {
        top: -arrowSize,
        left: '50%',
        marginLeft: -arrowSize / 2,
        borderLeftWidth: arrowSize,
        borderRightWidth: arrowSize,
        borderBottomWidth: arrowSize,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      };

    case 'left':
      return {
        right: -arrowSize,
        top: '50%',
        marginTop: -arrowSize / 2,
        borderTopWidth: arrowSize,
        borderBottomWidth: arrowSize,
        borderLeftWidth: arrowSize,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      };

    case 'right':
      return {
        left: -arrowSize,
        top: '50%',
        marginTop: -arrowSize / 2,
        borderTopWidth: arrowSize,
        borderBottomWidth: arrowSize,
        borderRightWidth: arrowSize,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
      };

    default:
      return {};
  }
}

const styles = StyleSheet.create({
  tooltip: {
    borderRadius: 4,
    padding: 8,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  defaultContent: {
    padding: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '500',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});

export default Tooltip;
