/**
 * Main Heatmap component
 */

import React, { useMemo, useCallback, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';

import type {
  HeatmapProps,
  ProcessedCellData,
  Theme,
  AnimationConfig,
  GestureConfig,
  TooltipConfig,
} from '../types';
import { DEFAULT_THEME } from '../types';
import {
  processHeatmapData,
  calculateHeatmapDimensions,
  calculateCalendarLayout,
  DEFAULT_ANIMATION_CONFIG,
  mergeAnimationConfig,
  DEFAULT_GESTURE_CONFIG,
  mergeGestureConfig,
  isAnimationSupported,
  isGestureHandlerAvailable,
} from '../utils';
import Tooltip from './Tooltip';
import AnimatedCell from './AnimatedCell';

/**
 * Default props for the Heatmap component
 */
const defaultProps: Partial<HeatmapProps> = {
  cellSize: 12,
  cellSpacing: 2,
  layout: 'calendar',
  colorScheme: 'github',
  animated: true,
  showTooltip: false,
  showMonthLabels: true,
  showWeekdayLabels: true,
  showLegend: false,
  hapticFeedback: false,
  accessibility: {
    label: 'Heatmap visualization',
    role: 'grid',
  },
};

/**
 * Main Heatmap Component
 */
const Heatmap: React.FC<HeatmapProps> = (props) => {
  const {
    data,
    width,
    height,
    cellSize = defaultProps.cellSize!,
    cellSpacing = defaultProps.cellSpacing!,
    cellShape = 'square',
    layout = defaultProps.layout!,
    colorScheme = defaultProps.colorScheme!,
    theme = {},
    startDate,
    endDate,
    numDays,
    onCellPress,
    onCellLongPress,
    onCellPressIn,
    onCellPressOut,
    onCellDoublePress,
    tooltip,
    showTooltip = defaultProps.showTooltip!,
    tooltipContent,
    animated = defaultProps.animated!,
    animation,
    animationDuration = 300,
    gesture,
    panEnabled,
    zoomEnabled,
    hapticFeedback = defaultProps.hapticFeedback!,
    accessibility = defaultProps.accessibility!,
    showMonthLabels = defaultProps.showMonthLabels!,
    showWeekdayLabels = defaultProps.showWeekdayLabels!,
    // showLegend = defaultProps.showLegend!,
    // legendPosition = 'bottom',
    columns,
    rows,
    style,
    cellStyle,
    labelStyle,
  } = props;

  // State for tooltip
  const [tooltipData, setTooltipData] = useState<{
    data: ProcessedCellData;
    position: { x: number; y: number };
    visible: boolean;
  } | null>(null);

  // Container dimensions
  const [containerDimensions, setContainerDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  // Refs for gesture handling
  const gestureRef = useRef(null);

  // Merge theme with defaults
  const mergedTheme: Theme = useMemo(
    () => ({
      colors: { ...DEFAULT_THEME.colors, ...theme.colors },
      spacing: { ...DEFAULT_THEME.spacing, ...theme.spacing },
      typography: { ...DEFAULT_THEME.typography, ...theme.typography },
    }),
    [theme]
  );

  // Merge animation configuration
  const mergedAnimationConfig: AnimationConfig = useMemo(() => {
    const baseConfig = {
      ...DEFAULT_ANIMATION_CONFIG,
      enabled: animated && isAnimationSupported(),
      duration: animationDuration,
    };
    return mergeAnimationConfig(baseConfig, animation);
  }, [animated, animationDuration, animation]);

  // Merge gesture configuration
  const mergedGestureConfig: GestureConfig = useMemo(() => {
    const baseConfig = {
      ...DEFAULT_GESTURE_CONFIG,
      enabled: isGestureHandlerAvailable(),
      pan: panEnabled ?? DEFAULT_GESTURE_CONFIG.pan,
      zoom: zoomEnabled ?? DEFAULT_GESTURE_CONFIG.zoom,
      hapticFeedback,
    };
    return mergeGestureConfig(baseConfig, gesture);
  }, [panEnabled, zoomEnabled, hapticFeedback, gesture]);

  // Merge tooltip configuration
  const mergedTooltipConfig: TooltipConfig = useMemo(() => {
    const baseConfig = {
      enabled: showTooltip,
      content: tooltipContent,
      position: 'auto' as const,
      offset: 8,
      showArrow: true,
      backgroundColor: mergedTheme.colors.tooltip,
      textColor: mergedTheme.colors.tooltipText,
      fontSize: mergedTheme.typography.fontSize,
      padding: 8,
      borderRadius: 4,
      shadow: true,
    };
    return { ...baseConfig, ...tooltip };
  }, [showTooltip, tooltipContent, tooltip, mergedTheme]);

  // Calculate date range
  const dateRange = useMemo(() => {
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), 0, 1); // Start of current year
    const defaultEnd = new Date(now.getFullYear(), 11, 31); // End of current year

    let calculatedStart = startDate || defaultStart;
    let calculatedEnd = endDate || defaultEnd;

    if (numDays && !endDate) {
      calculatedEnd = new Date(calculatedStart);
      calculatedEnd.setDate(calculatedEnd.getDate() + numDays - 1);
    }

    return { start: calculatedStart, end: calculatedEnd };
  }, [startDate, endDate, numDays]);

  // Process heatmap data
  const processedData = useMemo(() => {
    return processHeatmapData(
      data,
      dateRange.start,
      dateRange.end,
      colorScheme,
      layout
    );
  }, [data, dateRange.start, dateRange.end, colorScheme, layout]);

  // Calculate calendar layout data
  const calendarLayout = useMemo(() => {
    if (layout === 'calendar') {
      return calculateCalendarLayout(processedData, dateRange.start);
    }
    return null;
  }, [processedData, dateRange.start, layout]);

  // Calculate dimensions
  const dimensions = useMemo(() => {
    const gridDims = columns && rows ? { columns, rows } : undefined;
    return calculateHeatmapDimensions(
      processedData,
      cellSize,
      cellSpacing,
      layout,
      gridDims
    );
  }, [processedData, cellSize, cellSpacing, layout, columns, rows]);

  // Calculate final dimensions
  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;

  // Resolve color scheme (not used directly in component but available for future features)
  // const resolvedColorScheme = useMemo(() => {
  //   return resolveColorScheme(colorScheme);
  // }, [colorScheme]);

  // Handle cell press
  const handleCellPress = useCallback(
    (cellData: ProcessedCellData, index: number) => {
      onCellPress?.(cellData, index);
      // Hide tooltip on press
      if (tooltipData?.visible) {
        setTooltipData(null);
      }
    },
    [onCellPress, tooltipData]
  );

  // Handle cell long press
  const handleCellLongPress = useCallback(
    (cellData: ProcessedCellData, index: number) => {
      onCellLongPress?.(cellData, index);
      // Show tooltip on long press if enabled
      if (mergedTooltipConfig.enabled) {
        const x = cellData.x * (cellSize + cellSpacing);
        const y = cellData.y * (cellSize + cellSpacing);
        setTooltipData({
          data: cellData,
          position: { x, y },
          visible: true,
        });
      }
    },
    [onCellLongPress, mergedTooltipConfig.enabled, cellSize, cellSpacing]
  );

  // Handle cell press in
  const handleCellPressIn = useCallback(
    (cellData: ProcessedCellData, index: number) => {
      onCellPressIn?.(cellData, index);
    },
    [onCellPressIn]
  );

  // Handle cell press out
  const handleCellPressOut = useCallback(
    (cellData: ProcessedCellData, index: number) => {
      onCellPressOut?.(cellData, index);
    },
    [onCellPressOut]
  );

  // Handle cell double press
  const handleCellDoublePress = useCallback(
    (cellData: ProcessedCellData, index: number) => {
      onCellDoublePress?.(cellData, index);
    },
    [onCellDoublePress]
  );

  // Handle container layout
  const handleContainerLayout = useCallback((event: any) => {
    const { width: layoutWidth, height: layoutHeight } =
      event.nativeEvent.layout;
    setContainerDimensions({ width: layoutWidth, height: layoutHeight });
  }, []);

  // Render cell based on animation support
  const renderCell = useCallback(
    (cellData: ProcessedCellData, index: number) => {
      // Use AnimatedCell if animations are enabled and supported
      if (mergedAnimationConfig.enabled && isAnimationSupported()) {
        return (
          <AnimatedCell
            key={`cell-${index}`}
            data={cellData}
            index={index}
            totalCells={processedData.length}
            cellSize={cellSize}
            cellSpacing={cellSpacing}
            cellShape={cellShape}
            animationConfig={mergedAnimationConfig}
            borderColor={mergedTheme.colors.border}
            borderWidth={0.5}
            cellStyle={cellStyle}
            onPress={handleCellPress}
            onLongPress={handleCellLongPress}
            onPressIn={handleCellPressIn}
            onPressOut={handleCellPressOut}
            onDoublePress={handleCellDoublePress}
            hapticFeedback={mergedGestureConfig.hapticFeedback}
            useSvg={true}
          />
        );
      }

      // Fallback to SVG rendering
      const x = cellData.x * (cellSize + cellSpacing);
      const y = cellData.y * (cellSize + cellSpacing);

      const cellProps = {
        x,
        y,
        width: cellSize,
        height: cellSize,
        fill: cellData.color,
        stroke: mergedTheme.colors.border,
        strokeWidth: 0.5,
        onPress: () => handleCellPress(cellData, index),
        onLongPress: () => handleCellLongPress(cellData, index),
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

      // Default square shape
      return <Rect key={`cell-${index}`} {...cellProps} />;
    },
    [
      cellSize,
      cellSpacing,
      cellShape,
      mergedTheme.colors.border,
      cellStyle,
      handleCellPress,
      handleCellLongPress,
      handleCellPressIn,
      handleCellPressOut,
      handleCellDoublePress,
      mergedAnimationConfig,
      mergedGestureConfig.hapticFeedback,
      processedData.length,
    ]
  );

  // Render month labels for calendar layout
  const renderMonthLabels = useCallback(() => {
    if (!showMonthLabels || layout !== 'calendar' || !calendarLayout) {
      return null;
    }

    return calendarLayout.monthBoundaries.map((month, index) => {
      const x = month.x * (cellSize + cellSpacing);
      const y = -mergedTheme.typography.fontSize - 5;

      return (
        <SvgText
          key={`month-${index}`}
          x={x}
          y={y}
          fontSize={mergedTheme.typography.fontSize}
          fontFamily={mergedTheme.typography.fontFamily}
          fontWeight={mergedTheme.typography.fontWeight}
          fill={mergedTheme.colors.text}
          {...labelStyle}
        >
          {month.month}
        </SvgText>
      );
    });
  }, [
    showMonthLabels,
    layout,
    calendarLayout,
    cellSize,
    cellSpacing,
    mergedTheme.typography,
    mergedTheme.colors.text,
    labelStyle,
  ]);

  // Render weekday labels for calendar layout
  const renderWeekdayLabels = useCallback(() => {
    if (!showWeekdayLabels || layout !== 'calendar') {
      return null;
    }

    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const x = -mergedTheme.typography.fontSize - 5;

    return weekdays.map((day, index) => {
      const y =
        index * (cellSize + cellSpacing) +
        cellSize / 2 +
        mergedTheme.typography.fontSize / 2;

      return (
        <SvgText
          key={`weekday-${index}`}
          x={x}
          y={y}
          fontSize={mergedTheme.typography.fontSize}
          fontFamily={mergedTheme.typography.fontFamily}
          fontWeight={mergedTheme.typography.fontWeight}
          fill={mergedTheme.colors.text}
          textAnchor="middle"
          {...labelStyle}
        >
          {day}
        </SvgText>
      );
    });
  }, [
    showWeekdayLabels,
    layout,
    cellSize,
    cellSpacing,
    mergedTheme.typography,
    mergedTheme.colors.text,
    labelStyle,
  ]);

  // Calculate SVG viewBox with padding for labels
  const viewBoxPadding = {
    left:
      showWeekdayLabels && layout === 'calendar'
        ? mergedTheme.typography.fontSize + 10
        : 0,
    top:
      showMonthLabels && layout === 'calendar'
        ? mergedTheme.typography.fontSize + 10
        : 0,
  };

  const viewBoxWidth = finalWidth + viewBoxPadding.left;
  const viewBoxHeight = finalHeight + viewBoxPadding.top;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: mergedTheme.colors.background },
        style,
      ]}
      accessible={true}
      accessibilityLabel={accessibility.label}
      accessibilityRole={accessibility.role as any}
      onLayout={handleContainerLayout}
    >
      <Svg
        ref={gestureRef}
        width={viewBoxWidth}
        height={viewBoxHeight}
        viewBox={`-${viewBoxPadding.left} -${viewBoxPadding.top} ${viewBoxWidth} ${viewBoxHeight}`}
      >
        <G>
          {renderMonthLabels()}
          {renderWeekdayLabels()}
          {processedData.map(renderCell)}
        </G>
      </Svg>

      {/* Tooltip */}
      {tooltipData && (
        <Tooltip
          data={tooltipData.data}
          cellPosition={tooltipData.position}
          cellSize={cellSize}
          config={mergedTooltipConfig}
          theme={mergedTheme}
          containerDimensions={containerDimensions}
          visible={tooltipData.visible}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});

export default Heatmap;
