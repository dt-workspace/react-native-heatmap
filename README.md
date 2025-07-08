# @dt-workspace/react-native-heatmap

[![npm version](https://badge.fury.io/js/@dt-workspace%2Freact-native-heatmap.svg)](https://badge.fury.io/js/@dt-workspace%2Freact-native-heatmap)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, highly customizable React Native heatmap component library inspired by GitHub's contribution calendar. Perfect for visualizing activity data, progress tracking, and creating beautiful data representations in your React Native applications.

## ✨ Features

### Core Features
- 🎨 **Multiple Color Schemes**: GitHub, GitLab, Bitbucket, Heat, Cool, Purple, and more
- 📱 **React Native Optimized**: Built specifically for mobile performance
- 🎯 **TypeScript First**: Complete type safety and IntelliSense support
- 📊 **Flexible Layouts**: Calendar, Grid, and Compact arrangements
- 🎪 **Interactive**: Enhanced touch handlers for rich interactions
- 🌗 **Theme Support**: Light and dark mode compatible
- ♿ **Accessible**: Built-in accessibility features with WCAG compliance
- 🔧 **Highly Customizable**: Extensive styling and configuration options
- 📦 **Lightweight**: Minimal dependencies and optimized bundle size

### 🆕 New in v1.1.0
- 🎬 **Advanced Animation System**: Entry animations (fade, scale, slide) with stagger effects
- 📱 **Enhanced Gesture Support**: Pan, zoom, swipe with react-native-gesture-handler
- 💬 **Tooltip System**: Configurable tooltips with auto-positioning and custom content
- 🔄 **Extended Touch Handlers**: onLongPress, onPressIn, onPressOut, onDoublePress
- 🎨 **New Color Schemes**: GitLab, Bitbucket, Accessible, Sunset, Neon themes
- ⚡ **Performance Optimizations**: Virtualization, lazy loading, memory management
- 🤏 **Haptic Feedback**: Native haptic feedback integration
- 🎯 **Better TypeScript**: Enhanced type definitions for all new features

### 🆕 New in v1.2.0
- 🕒 **Time-Based Layouts**: 7 new layout types (daily, weekly, monthly, yearly, custom range, timeline scroll, real-time)
- 🎴 **CardLayout Component**: Flexible card-based layout system with configurable sections
- 📊 **Enhanced Data Visualization**: Support for different time granularities and ranges
- 🎭 **Advanced Theming**: Light/dark themes with custom color support
- 🔧 **Better Configuration**: Comprehensive layout and section configuration options

## 📸 Preview

*GitHub-style contribution calendar with advanced animations, gestures, and tooltips*

## 🚀 Installation

```bash
# Using npm
npm install @dt-workspace/react-native-heatmap react-native-svg

# Using yarn
yarn add @dt-workspace/react-native-heatmap react-native-svg

# Using pnpm
pnpm add @dt-workspace/react-native-heatmap react-native-svg
```

### Optional Dependencies (for v1.1.0+ features)

For advanced animations and gestures, install these optional peer dependencies:

```bash
# For animations (optional)
npm install react-native-reanimated

# For gestures (optional) 
npm install react-native-gesture-handler

# Or with yarn
yarn add react-native-reanimated react-native-gesture-handler
```

### Platform Setup

**iOS**: `cd ios && pod install`

**Android**: No additional setup required

**Expo**: Compatible with Expo SDK 48+

## 📖 Quick Start

```tsx
import React from 'react';
import { View } from 'react-native';
import { Heatmap } from '@dt-workspace/react-native-heatmap';
import type { HeatmapData } from '@dt-workspace/react-native-heatmap';

const data: HeatmapData[] = [
  { date: '2024-01-01', value: 3 },
  { date: '2024-01-02', value: 7 },
  { date: '2024-01-03', value: 1 },
  // ... more data
];

const App = () => {
  const startDate = new Date('2024-01-01');
  
  return (
    <View style={{ padding: 20 }}>
      <Heatmap
        data={data}
        startDate={startDate}
        colorScheme="github"
        onCellPress={(data, index) => {
          console.log('Pressed:', data);
        }}
      />
    </View>
  );
};

export default App;
```

## 🎬 Animations (v1.1.0+)

Create smooth, eye-catching animations for your heatmaps:

```tsx
<Heatmap
  data={data}
  animated={true}
  animation={{
    enabled: true,
    duration: 300,
    entryAnimation: 'scale', // 'fade', 'scale', 'slide'
    staggerDelay: 10,
    useNativeDriver: true,
  }}
/>
```

### Animation Types

- **Fade**: Cells fade in smoothly
- **Scale**: Cells scale up from small to full size
- **Slide**: Cells slide in from above

## 🤏 Enhanced Touch & Gestures (v1.1.0+)

Rich interaction support with haptic feedback:

```tsx
<Heatmap
  data={data}
  // Basic touches
  onCellPress={(data, index) => console.log('Tap:', data)}
  onCellLongPress={(data, index) => console.log('Long press:', data)}
  onCellDoublePress={(data, index) => console.log('Double tap:', data)}
  onCellPressIn={(data, index) => console.log('Press in:', data)}
  onCellPressOut={(data, index) => console.log('Press out:', data)}
  
  // Haptic feedback
  hapticFeedback={true}
  
  // Gesture support (requires react-native-gesture-handler)
  gesture={{
    enabled: true,
    pan: true,
    zoom: true,
    minZoom: 0.5,
    maxZoom: 3.0,
  }}
/>
```

## 💬 Tooltips (v1.1.0+)

Beautiful, configurable tooltips with smart positioning:

```tsx
<Heatmap
  data={data}
  tooltip={{
    enabled: true,
    position: 'auto', // 'top', 'bottom', 'left', 'right', 'auto'
    showArrow: true,
    backgroundColor: '#333',
    textColor: '#fff',
    content: (data) => (
      <View>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {data.date}
        </Text>
        <Text style={{ color: 'white' }}>
          Value: {data.value}
        </Text>
      </View>
    ),
  }}
/>
```

## 🎨 Color Schemes

Choose from expanded color schemes including new v1.1.0 additions:

```tsx
// GitHub style (default)
<Heatmap data={data} colorScheme="github" />

// New in v1.1.0
<Heatmap data={data} colorScheme="gitlab" />
<Heatmap data={data} colorScheme="bitbucket" />
<Heatmap data={data} colorScheme="accessible" />
<Heatmap data={data} colorScheme="sunset" />
<Heatmap data={data} colorScheme="neon" />

// Classic schemes
<Heatmap data={data} colorScheme="heat" />
<Heatmap data={data} colorScheme="cool" />

// Custom color scheme
<Heatmap 
  data={data} 
  colorScheme={{
    name: 'custom',
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    emptyColor: '#ebedf0'
  }} 
/>
```

**Available schemes**: `github`, `githubDark`, `gitlab`, `bitbucket`, `accessible`, `sunset`, `neon`, `heat`, `cool`, `purple`, `green`, `orange`, `red`, `blue`, `grayscale`

## 📐 Layouts

### Calendar Layout (Default)
Perfect for contribution calendars and date-based visualizations:

```tsx
<Heatmap
  data={data}
  layout="calendar"
  showMonthLabels={true}
  showWeekdayLabels={true}
  startDate={new Date('2024-01-01')}
  endDate={new Date('2024-12-31')}
/>
```

### Grid Layout
Ideal for non-date based data:

```tsx
<Heatmap
  data={data}
  layout="grid"
  columns={7}
  rows={5}
/>
```

### Compact Layout
Single row visualization:

```tsx
<Heatmap
  data={data}
  layout="compact"
/>
```

## 🎭 Cell Shapes

Customize the appearance of your heatmap cells:

```tsx
// Square cells (default)
<Heatmap data={data} cellShape="square" />

// Rounded corners
<Heatmap data={data} cellShape="rounded" />

// Circular cells
<Heatmap data={data} cellShape="circle" />
```

## ⚡ Performance Optimization (v1.1.0+)

Handle large datasets efficiently with virtualization:

```tsx
<Heatmap
  data={largeDataset} // 1000+ items
  virtualized={true}
  renderBuffer={50}
  
  // Performance monitoring
  onPerformanceUpdate={(metrics) => {
    console.log('Render time:', metrics.renderTime);
  }}
/>
```

## 🌗 Theming

Create consistent themes across light and dark modes:

```tsx
<Heatmap
  data={data}
  theme={{
    colors: {
      background: '#0d1117',
      text: '#f0f6fc',
      border: '#30363d',
      tooltip: '#f0f6fc',
      tooltipText: '#0d1117',
    },
    spacing: {
      cell: 3,
      margin: 15,
      padding: 10,
    },
    typography: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'System',
    },
  }}
/>
```

## 📊 Advanced Configuration

### Size and Spacing

```tsx
<Heatmap
  data={data}
  cellSize={15}
  cellSpacing={3}
  width={350}
  height={200}
/>
```

### Accessibility

```tsx
<Heatmap
  data={data}
  accessibility={{
    label: "Activity heatmap",
    hint: "Double tap to view details",
    role: "grid",
  }}
/>
```

## 📱 Real-World Examples

### GitHub Contribution Calendar with v1.1.0 Features

```tsx
import { Heatmap } from '@dt-workspace/react-native-heatmap';

const GitHubContributions = ({ contributionData }) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);

  return (
    <Heatmap
      data={contributionData}
      startDate={startDate}
      colorScheme="github"
      layout="calendar"
      showMonthLabels={true}
      showWeekdayLabels={true}
      
      // v1.1.0 features
      animated={true}
      animation={{
        entryAnimation: 'scale',
        staggerDelay: 5,
        duration: 200,
      }}
      
      tooltip={{
        enabled: true,
        content: (data) => (
          <View>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {data.date}
            </Text>
            <Text style={{ color: 'white' }}>
              {data.value} contributions
            </Text>
            <Text style={{ color: 'white', fontSize: 12 }}>
              {data.metadata?.commits || 0} commits
            </Text>
          </View>
        ),
      }}
      
      onCellPress={(data) => showContributionDetails(data)}
      onCellLongPress={(data) => showQuickActions(data)}
      hapticFeedback={true}
    />
  );
};
```

### Fitness Activity Tracker

```tsx
const FitnessHeatmap = ({ workoutData }) => (
  <Heatmap
    data={workoutData}
    colorScheme="sunset"
    cellShape="circle"
    
    // Smooth animations
    animated={true}
    animation={{
      entryAnimation: 'fade',
      duration: 400,
      staggerDelay: 8,
    }}
    
    // Interactive features
    onCellPress={(data) => {
      navigation.navigate('WorkoutDetails', { date: data.date });
    }}
    onCellDoublePress={(data) => {
      quickAddWorkout(data.date);
    }}
    
    hapticFeedback={true}
    theme={{
      colors: {
        background: '#f8f9fa',
        text: '#495057',
      }
    }}
  />
);
```

## 🕒 Time-Based Layouts (v1.2.0)

The library now supports 7 different time-based layout types for various data visualization needs:

### Daily Layout (24-hour grid)
Perfect for showing hourly activity patterns throughout a day.

```tsx
import { Heatmap } from '@dt-workspace/react-native-heatmap';

const DailyActivity = ({ hourlyData }) => (
  <Heatmap
    data={hourlyData}
    layout="daily"
    targetDate={new Date('2024-01-15')}
    hourFormat="24h"
    showTimeLabels={true}
    colorScheme="heat"
    cellSize={20}
    cellSpacing={3}
    onCellPress={(data) => {
      console.log('Hour:', data.date, 'Activity:', data.value);
    }}
  />
);
```

### Weekly Layout (7-day activity)
Ideal for weekly activity tracking and habit visualization.

```tsx
const WeeklyTracker = ({ weeklyData }) => (
  <Heatmap
    data={weeklyData}
    layout="weekly"
    targetDate={new Date('2024-01-15')}
    showTimeLabels={true}
    colorScheme="github"
    cellSize={30}
    cellSpacing={4}
  />
);
```

### Monthly Layout
Perfect for monthly overviews and calendar-style visualizations.

```tsx
const MonthlyOverview = ({ monthlyData }) => (
  <Heatmap
    data={monthlyData}
    layout="monthly"
    targetDate={new Date('2024-01-01')}
    showTimeLabels={true}
    colorScheme="cool"
    cellSize={15}
    cellSpacing={2}
  />
);
```

### Yearly Layout
Great for showing annual patterns and long-term trends.

```tsx
const YearlyReport = ({ yearlyData }) => (
  <Heatmap
    data={yearlyData}
    layout="yearly"
    targetDate={new Date('2024-01-01')}
    showTimeLabels={true}
    colorScheme="purple"
    cellSize={8}
    cellSpacing={1}
  />
);
```

### Custom Range Layout
Flexible layout for custom date ranges with configurable granularity.

```tsx
const CustomRangeView = ({ rangeData }) => (
  <Heatmap
    data={rangeData}
    layout="customRange"
    customRange={{
      start: new Date('2024-01-01'),
      end: new Date('2024-03-31'),
      granularity: 'week' // 'hour' | 'day' | 'week' | 'month'
    }}
    showTimeLabels={true}
    colorScheme="green"
    cellSize={25}
    cellSpacing={3}
  />
);
```

### Timeline Scroll Layout
Horizontal scrollable timeline for large datasets.

```tsx
const TimelineView = ({ timelineData }) => (
  <Heatmap
    data={timelineData}
    layout="timelineScroll"
    scrollDirection="horizontal"
    showTimeLabels={true}
    colorScheme="blue"
    cellSize={12}
    cellSpacing={2}
  />
);
```

### Real-Time Layout
Live updating layout for real-time data visualization.

```tsx
const RealTimeMonitor = ({ liveData }) => (
  <Heatmap
    data={liveData}
    layout="realTime"
    updateInterval={1000}
    showTimeLabels={true}
    colorScheme="neon"
    cellSize={15}
    cellSpacing={2}
    animated={true}
  />
);
```

## 🎴 CardLayout Component (v1.2.0)

A flexible card-based layout system for composing complex UI components with configurable sections.

### Basic CardLayout Usage

```tsx
import { CardLayout } from '@dt-workspace/react-native-heatmap';

const BasicCard = () => (
  <CardLayout
    title="Analytics Dashboard"
    description="Monthly performance overview"
    customComponent={
      <Heatmap
        data={analyticsData}
        layout="monthly"
        colorScheme="github"
        cellSize={12}
      />
    }
    hitman={
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button title="View Details" />
        <Button title="Export" />
      </View>
    }
  />
);
```

### Advanced CardLayout with Badges

```tsx
const AdvancedCard = () => (
  <CardLayout
    title="Project Activity"
    description="Team collaboration metrics"
    
    // Badges for status indicators
    badgesArray={[
      { text: 'Active', backgroundColor: '#28a745', color: '#fff' },
      { text: 'High Priority', backgroundColor: '#dc3545', color: '#fff' },
      { text: 'Team: 5', backgroundColor: '#6c757d', color: '#fff' }
    ]}
    
    // Custom content area
    customComponent={
      <View>
        <Heatmap
          data={projectData}
          layout="weekly"
          colorScheme="gitlab"
          cellSize={15}
          cellSpacing={2}
        />
        <Text style={{ textAlign: 'center', marginTop: 10 }}>
          Last 7 days activity
        </Text>
      </View>
    }
    
    // Footer actions
    hitman={
      <View style={{ flexDirection: 'row' }}>
        <Button title="Settings" />
        <Button title="Share" />
      </View>
    }
    
    // Configuration
    cardLayout={{
      borderRadius: 12,
      shadow: true,
      backgroundColor: '#f8f9fa'
    }}
    
    // Theme
    theme="light"
    
    // Animations
    animated={true}
    animationType="fade"
    animationDuration={300}
    
    // Interactions
    onPress={() => console.log('Card pressed')}
    onLongPress={() => console.log('Card long pressed')}
  />
);
```

### CardLayout with Custom Sections

```tsx
const CustomSectionCard = () => (
  <CardLayout
    title="Custom Layout"
    titleSection={{ order: 0, visible: true, padding: 16 }}
    
    description="Sections can be reordered and configured"
    descriptionSection={{ order: 2, visible: true, padding: 12 }}
    
    customComponent={<MyCustomComponent />}
    customComponentSection={{ order: 1, visible: true, padding: 8 }}
    
    hitman={<MyFooterComponent />}
    hitmanSection={{ order: 3, visible: true, padding: 16 }}
    
    // Individual section styling
    titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
    descriptionStyle={{ fontSize: 14, color: '#666' }}
    titleContainerStyle={{ backgroundColor: '#f0f0f0' }}
  />
);
```

## 🔧 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `HeatmapData[]` | **Required** | Array of data points with date and value |
| `startDate` | `Date` | Current year start | Start date for the heatmap |
| `endDate` | `Date` | Current year end | End date for the heatmap |
| `colorScheme` | `string \| ColorScheme` | `'github'` | Color scheme name or custom scheme |
| `layout` | `LayoutType` | `'calendar'` | Layout type (`'calendar' \| 'grid' \| 'compact' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly' \| 'customRange' \| 'timelineScroll' \| 'realTime'`) |
| `cellSize` | `number` | `12` | Size of each cell in pixels |
| `cellSpacing` | `number` | `2` | Spacing between cells |
| `cellShape` | `'square' \| 'rounded' \| 'circle'` | `'square'` | Shape of cells |
| `onCellPress` | `(data, index) => void` | `undefined` | Cell press handler |
| `onCellLongPress` | `(data, index) => void` | `undefined` | Cell long press handler |
| **New in v1.1.0** |
| `onCellDoublePress` | `(data, index) => void` | `undefined` | Cell double press handler |
| `onCellPressIn` | `(data, index) => void` | `undefined` | Cell press in handler |
| `onCellPressOut` | `(data, index) => void` | `undefined` | Cell press out handler |
| `animated` | `boolean` | `true` | Enable animations |
| `animation` | `AnimationConfig` | `undefined` | Animation configuration |
| `tooltip` | `TooltipConfig` | `undefined` | Tooltip configuration |
| `gesture` | `GestureConfig` | `undefined` | Gesture configuration |
| `hapticFeedback` | `boolean` | `false` | Enable haptic feedback |
| `virtualized` | `boolean` | `false` | Enable virtualization for large datasets |
| `theme` | `Partial<Theme>` | `DEFAULT_THEME` | Theme configuration |
| `showMonthLabels` | `boolean` | `true` | Show month labels (calendar layout) |
| `showWeekdayLabels` | `boolean` | `true` | Show weekday labels (calendar layout) |
| **New in v1.2.0** |
| `targetDate` | `Date` | `undefined` | Target date for time-based layouts |
| `hourFormat` | `'12h' \| '24h'` | `'24h'` | Hour format for daily layouts |
| `showTimeLabels` | `boolean` | `false` | Show time labels for time-based layouts |
| `scrollDirection` | `'horizontal' \| 'vertical'` | `'horizontal'` | Scroll direction for timeline layouts |
| `updateInterval` | `number` | `1000` | Update interval for real-time layouts (ms) |
| `customRange` | `CustomRangeConfig` | `undefined` | Custom range configuration |

### CardLayout Props (v1.2.0)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string \| ReactNode` | `undefined` | Card title (string or custom component) |
| `description` | `string \| ReactNode` | `undefined` | Card description (string or custom component) |
| `badges` | `ReactNode` | `undefined` | Custom badges component |
| `badgesArray` | `BadgeConfig[]` | `undefined` | Array of badge configurations |
| `customComponent` | `ReactNode` | `undefined` | Custom content component |
| `hitman` | `ReactNode` | `undefined` | Footer/action component (always rendered last) |
| `cardLayout` | `CardLayoutConfig` | `DEFAULT_CARD_LAYOUT` | Card layout configuration |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Theme mode |
| `themeColors` | `ThemeColors` | `undefined` | Custom theme colors |
| `animated` | `boolean` | `false` | Enable animations |
| `animationType` | `'fade' \| 'scale' \| 'slide'` | `'fade'` | Animation type |
| `animationDuration` | `number` | `300` | Animation duration (ms) |
| `onPress` | `() => void` | `undefined` | Card press handler |
| `onLongPress` | `() => void` | `undefined` | Card long press handler |
| `accessibilityLabel` | `string` | `undefined` | Accessibility label |
| `accessibilityRole` | `string` | `undefined` | Accessibility role |
| `testID` | `string` | `undefined` | Test identifier |

### Types

```typescript
interface HeatmapData {
  date: string; // ISO date string (YYYY-MM-DD)
  value: number;
  metadata?: Record<string, any>;
}

interface AnimationConfig {
  enabled: boolean;
  duration: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  staggerDelay?: number;
  entryAnimation?: 'fade' | 'scale' | 'slide' | 'none';
  useNativeDriver?: boolean;
}

interface TooltipConfig {
  enabled: boolean;
  content?: (data: HeatmapData) => ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
  showArrow?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  padding?: number;
  borderRadius?: number;
  shadow?: boolean;
}

interface GestureConfig {
  enabled: boolean;
  pan?: boolean;
  zoom?: boolean;
  swipe?: boolean;
  minZoom?: number;
  maxZoom?: number;
  hapticFeedback?: boolean;
}

interface ColorScheme {
  name: string;
  colors: string[];
  levels?: number;
  emptyColor?: string;
}

interface Theme {
  colors: {
    background: string;
    text: string;
    border: string;
    tooltip: string;
    tooltipText: string;
  };
  spacing: {
    cell: number;
    margin: number;
    padding: number;
  };
  typography: {
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
  };
}

// Time-based layout types (v1.2.0)
type LayoutType = 
  | 'calendar' 
  | 'grid' 
  | 'compact' 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'customRange'
  | 'timelineScroll'
  | 'realTime';

interface CustomRangeConfig {
  start: Date;
  end: Date;
  granularity: 'hour' | 'day' | 'week' | 'month';
}

// CardLayout types (v1.2.0)
interface BadgeConfig {
  text: string;
  color?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface CardLayoutConfig {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: boolean;
  elevation?: number;
  padding?: number;
  margin?: number;
  style?: ViewStyle;
}

interface CardSectionConfig {
  visible?: boolean;
  order?: number;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
}
```

## 🛠️ Utilities

The library includes helpful utility functions:

```tsx
import {
  generateDateRange,
  formatDateISO,
  processHeatmapData,
  COLOR_SCHEMES,
  DEFAULT_THEME,
  DARK_THEME
} from '@dt-workspace/react-native-heatmap';

// Generate date range
const dates = generateDateRange(
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

// Access predefined schemes
console.log(COLOR_SCHEMES.github);
console.log(COLOR_SCHEMES.gitlab); // New in v1.1.0
```

## 📈 Migration from v0.1.0 to v1.1.0

v1.1.0 is fully backward compatible. To use new features:

```tsx
// Before (v0.1.0) - still works
<Heatmap
  data={data}
  colorScheme="github"
  onCellPress={handlePress}
/>

// After (v1.1.0) - enhanced with new features
<Heatmap
  data={data}
  colorScheme="github"
  onCellPress={handlePress}
  
  // New features
  animated={true}
  animation={{ entryAnimation: 'scale', staggerDelay: 10 }}
  tooltip={{ enabled: true, position: 'auto' }}
  onCellDoublePress={handleDoublePress}
  hapticFeedback={true}
/>
```

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test --coverage

# Run type checking
yarn typecheck

# Run linting
yarn lint
```

## 📱 Example App

Run the example app to see all features in action:

```bash
# Install dependencies
yarn

# Run on iOS
yarn example ios

# Run on Android
yarn example android

# Run on Web
yarn example web
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/dt-workspace/react-native-heatmap.git

# Install dependencies
yarn

# Start the example app
yarn example ios
```

## 📝 Changelog

See [version.md](version.md) for a detailed history of changes.

### Recent Updates

- **v1.1.0** (2025-01-08): Advanced animations, gestures, tooltips, performance optimizations
- **v0.1.0** (2025-01-08): Initial release with core heatmap functionality

## 🔗 Related Projects

- [react-calendar-heatmap](https://github.com/kevinsqi/react-calendar-heatmap) - Web version
- [react-native-svg](https://github.com/software-mansion/react-native-svg) - SVG library
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler) - Gesture support
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) - Animation library

## 📄 License

MIT © [Deepak Tiwari](https://github.com/deepaktiwari09)

## ❤️ Support

If this library helps you, please consider:

- ⭐ Starring the repo
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Contributing code or documentation

---

**Built with ❤️ using TypeScript and React Native**