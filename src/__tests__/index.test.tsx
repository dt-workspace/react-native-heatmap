import { render } from '@testing-library/react-native';
import { Heatmap } from '../index';
import type { HeatmapData } from '../index';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockSvg = ({ children, ...props }: any) =>
    React.createElement(View, { testID: 'svg', ...props }, children);
  const MockRect = (props: any) =>
    React.createElement(View, { testID: 'rect', ...props });
  const MockText = (props: any) =>
    React.createElement(View, { testID: 'svg-text', ...props });
  const MockG = ({ children, ...props }: any) =>
    React.createElement(View, { testID: 'g', ...props }, children);

  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    Rect: MockRect,
    Text: MockText,
    G: MockG,
  };
});

const sampleData: HeatmapData[] = [
  { date: '2024-01-01', value: 3 },
  { date: '2024-01-02', value: 7 },
  { date: '2024-01-03', value: 1 },
  { date: '2024-01-04', value: 0 },
  { date: '2024-01-05', value: 5 },
];

describe('Heatmap Component', () => {
  it('renders without crashing', () => {
    const startDate = new Date('2024-01-01');

    const { getByTestId } = render(
      <Heatmap data={sampleData} startDate={startDate} colorScheme="github" />
    );

    expect(getByTestId('svg')).toBeTruthy();
  });

  it('renders with default props', () => {
    const { getByTestId } = render(<Heatmap data={sampleData} />);

    expect(getByTestId('svg')).toBeTruthy();
  });

  it('handles empty data array', () => {
    const { getByTestId } = render(<Heatmap data={[]} />);

    expect(getByTestId('svg')).toBeTruthy();
  });

  it('applies custom theme correctly', () => {
    const customTheme = {
      colors: {
        background: '#000000',
        text: '#ffffff',
        border: '#333333',
        tooltip: '#ffffff',
        tooltipText: '#000000',
      },
    };

    const { getByTestId } = render(
      <Heatmap data={sampleData} theme={customTheme} />
    );

    expect(getByTestId('svg')).toBeTruthy();
  });

  it('handles different color schemes', () => {
    const colorSchemes = ['github', 'heat', 'cool', 'purple'];

    colorSchemes.forEach((scheme) => {
      const { getByTestId } = render(
        <Heatmap data={sampleData} colorScheme={scheme} />
      );

      expect(getByTestId('svg')).toBeTruthy();
    });
  });

  it('handles different layouts', () => {
    const layouts: Array<'calendar' | 'grid' | 'compact'> = [
      'calendar',
      'grid',
      'compact',
    ];

    layouts.forEach((layout) => {
      const { getByTestId } = render(
        <Heatmap data={sampleData} layout={layout} />
      );

      expect(getByTestId('svg')).toBeTruthy();
    });
  });

  it('handles different cell shapes', () => {
    const shapes: Array<'square' | 'rounded' | 'circle'> = [
      'square',
      'rounded',
      'circle',
    ];

    shapes.forEach((shape) => {
      const { getByTestId } = render(
        <Heatmap data={sampleData} cellShape={shape} />
      );

      expect(getByTestId('svg')).toBeTruthy();
    });
  });

  it('accepts custom dimensions', () => {
    const { getByTestId } = render(
      <Heatmap
        data={sampleData}
        width={400}
        height={200}
        cellSize={15}
        cellSpacing={3}
      />
    );

    expect(getByTestId('svg')).toBeTruthy();
  });

  it('handles date range props', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');

    const { getByTestId } = render(
      <Heatmap data={sampleData} startDate={startDate} endDate={endDate} />
    );

    expect(getByTestId('svg')).toBeTruthy();
  });

  it('handles interaction callbacks', () => {
    const onCellPress = jest.fn();
    const onCellLongPress = jest.fn();

    const { getByTestId } = render(
      <Heatmap
        data={sampleData}
        onCellPress={onCellPress}
        onCellLongPress={onCellLongPress}
      />
    );

    expect(getByTestId('svg')).toBeTruthy();
  });
});

describe('Heatmap Accessibility', () => {
  it('applies accessibility props correctly', () => {
    const accessibilityProps = {
      label: 'Test heatmap',
      hint: 'Double tap for details',
      role: 'grid' as const,
    };

    const { getByLabelText } = render(
      <Heatmap data={sampleData} accessibility={accessibilityProps} />
    );

    expect(getByLabelText('Test heatmap')).toBeTruthy();
  });
});
