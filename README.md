# @dt-workspace/react-native-heatmap

[![npm version](https://badge.fury.io/js/@dt-workspace%2Freact-native-heatmap.svg)](https://badge.fury.io/js/@dt-workspace%2Freact-native-heatmap)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, highly customizable React Native heatmap component library inspired by GitHub's contribution calendar. Perfect for visualizing activity data, progress tracking, and creating beautiful data representations in your React Native applications.

## ✨ Features

- 🎨 **Multiple Color Schemes**: GitHub, GitLab, Heat, Cool, Purple, and more
- 📱 **React Native Optimized**: Built specifically for mobile performance
- 🎯 **TypeScript First**: Complete type safety and IntelliSense support
- 📊 **Flexible Layouts**: Calendar, Grid, and Compact arrangements
- 🎪 **Interactive**: Touch handlers for cell interactions
- 🌗 **Theme Support**: Light and dark mode compatible
- ♿ **Accessible**: Built-in accessibility features
- 🔧 **Highly Customizable**: Extensive styling and configuration options
- 📦 **Lightweight**: Minimal dependencies and optimized bundle size

## 📸 Preview

*GitHub-style contribution calendar with multiple color schemes and layouts*

## 🚀 Installation

```bash
# Using npm
npm install @dt-workspace/react-native-heatmap react-native-svg

# Using yarn
yarn add @dt-workspace/react-native-heatmap react-native-svg

# Using pnpm
pnpm add @dt-workspace/react-native-heatmap react-native-svg
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

## 🎨 Color Schemes

Choose from 10 predefined color schemes or create your own:

```tsx
// GitHub style (default)
<Heatmap data={data} colorScheme="github" />

// Dark theme
<Heatmap data={data} colorScheme="githubDark" />

// Heat colors
<Heatmap data={data} colorScheme="heat" />

// Cool colors
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

Available schemes: `github`, `githubDark`, `heat`, `cool`, `purple`, `green`, `orange`, `red`, `blue`, `grayscale`

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

## 🎯 Interactions

Handle user interactions with your heatmap:

```tsx
<Heatmap
  data={data}
  onCellPress={(data, index) => {
    console.log('Cell pressed:', data.date, data.value);
  }}
  onCellLongPress={(data, index) => {
    console.log('Cell long pressed:', data);
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

### Performance Options

```tsx
<Heatmap
  data={largeDataset}
  virtualized={true}
  renderBuffer={50}
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

### GitHub Contribution Calendar

```tsx
import { Heatmap, generateDateRange } from '@dt-workspace/react-native-heatmap';

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
      onCellPress={(data) => {
        showContributionDetails(data);
      }}
    />
  );
};
```

### Fitness Activity Tracker

```tsx
const FitnessHeatmap = ({ workoutData }) => (
  <Heatmap
    data={workoutData}
    colorScheme="heat"
    cellShape="circle"
    onCellPress={(data) => {
      navigation.navigate('WorkoutDetails', { date: data.date });
    }}
    theme={{
      colors: {
        background: '#f8f9fa',
        text: '#495057',
      }
    }}
  />
);
```

### Habit Tracker

```tsx
const HabitTracker = ({ habitData }) => (
  <Heatmap
    data={habitData}
    layout="grid"
    columns={7}
    colorScheme="green"
    cellSize={18}
    cellSpacing={4}
    onCellLongPress={(data) => {
      editHabitEntry(data);
    }}
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
| `layout` | `'calendar' \| 'grid' \| 'compact'` | `'calendar'` | Layout type |
| `cellSize` | `number` | `12` | Size of each cell in pixels |
| `cellSpacing` | `number` | `2` | Spacing between cells |
| `cellShape` | `'square' \| 'rounded' \| 'circle'` | `'square'` | Shape of cells |
| `onCellPress` | `(data, index) => void` | `undefined` | Cell press handler |
| `onCellLongPress` | `(data, index) => void` | `undefined` | Cell long press handler |
| `theme` | `Partial<Theme>` | `DEFAULT_THEME` | Theme configuration |
| `showMonthLabels` | `boolean` | `true` | Show month labels (calendar layout) |
| `showWeekdayLabels` | `boolean` | `true` | Show weekday labels (calendar layout) |

### Types

```typescript
interface HeatmapData {
  date: string; // ISO date string (YYYY-MM-DD)
  value: number;
  metadata?: Record<string, any>;
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

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 🔗 Related Projects

- [react-calendar-heatmap](https://github.com/kevinsqi/react-calendar-heatmap) - Web version
- [react-native-svg](https://github.com/software-mansion/react-native-svg) - SVG library
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) - Chart components

## 📄 License

MIT © [Deepak Tiwari](https://github.com/deepaktiwari3020)

## ❤️ Support

If this library helps you, please consider:

- ⭐ Starring the repo
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Contributing code or documentation

---

**Built with ❤️ using TypeScript and React Native**