import { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { Heatmap } from '@dt-workspace/react-native-heatmap';
import type { HeatmapData } from '@dt-workspace/react-native-heatmap';

// Generate sample data for the last 365 days
const generateSampleData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  const today = new Date();

  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random value between 0-10 with some days having no data
    const value = Math.random() > 0.3 ? Math.floor(Math.random() * 10) : 0;

    data.push({
      date: date.toISOString().split('T')[0] as string,
      value,
      metadata: {
        commits: value,
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      },
    });
  }

  return data;
};

const sampleData = generateSampleData();
const startDate = new Date();
startDate.setDate(startDate.getDate() - 365);

export default function App() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(false);

  const handleCellPress = (data: HeatmapData, index: number) => {
    console.log('Cell pressed:', data, index);
    Alert.alert(
      'Cell Pressed',
      `Date: ${data.date}\nValue: ${data.value}\nCommits: ${data.metadata?.commits || 0}`
    );
  };

  const handleCellLongPress = (data: HeatmapData, index: number) => {
    console.log('Cell long pressed:', data, index);
    Alert.alert('Long Press', `Long pressed on ${data.date}`);
  };

  const handleCellDoublePress = (data: HeatmapData, index: number) => {
    console.log('Cell double pressed:', data, index);
    Alert.alert('Double Tap', `Double tapped on ${data.date}`);
  };

  const customTooltipContent = (data: HeatmapData) => (
    <View>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{data.date}</Text>
      <Text style={{ color: 'white' }}>Commits: {data.value}</Text>
      <Text style={{ color: 'white', fontSize: 12 }}>{data.metadata?.day}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>React Native Heatmap v1.1.0 Demo</Text>

        <View style={styles.controls}>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Animations</Text>
            <Switch
              value={animationsEnabled}
              onValueChange={setAnimationsEnabled}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Tooltips</Text>
            <Switch
              value={tooltipsEnabled}
              onValueChange={setTooltipsEnabled}
            />
          </View>
          <View style={styles.control}>
            <Text style={styles.controlLabel}>Haptic Feedback</Text>
            <Switch value={hapticEnabled} onValueChange={setHapticEnabled} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          GitHub Style with v1.1.0 Features
        </Text>
        <View style={styles.heatmapContainer}>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="github"
            onCellPress={handleCellPress}
            onCellLongPress={handleCellLongPress}
            onCellDoublePress={handleCellDoublePress}
            cellSize={12}
            showMonthLabels={true}
            showWeekdayLabels={true}
            animated={animationsEnabled}
            animation={{
              enabled: animationsEnabled,
              duration: 300,
              entryAnimation: 'scale',
              staggerDelay: 5,
            }}
            tooltip={{
              enabled: tooltipsEnabled,
              content: customTooltipContent,
              position: 'auto',
              showArrow: true,
              shadow: true,
            }}
            hapticFeedback={hapticEnabled}
          />
        </View>

        <Text style={styles.sectionTitle}>Dark Theme</Text>
        <View style={[styles.heatmapContainer, styles.darkContainer]}>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="githubDark"
            onCellPress={handleCellPress}
            cellSize={12}
            theme={{
              colors: {
                background: '#0d1117',
                text: '#f0f6fc',
                border: '#30363d',
                tooltip: '#f0f6fc',
                tooltipText: '#0d1117',
              },
            }}
            showMonthLabels={true}
            showWeekdayLabels={true}
          />
        </View>

        <Text style={styles.sectionTitle}>
          New Color Schemes (GitLab & Bitbucket)
        </Text>
        <View style={styles.heatmapContainer}>
          <Text style={styles.subTitle}>GitLab Style</Text>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="gitlab"
            onCellPress={handleCellPress}
            cellSize={10}
            cellSpacing={1}
            showMonthLabels={true}
            showWeekdayLabels={false}
            animated={animationsEnabled}
            animation={{
              entryAnimation: 'fade',
              duration: 200,
              staggerDelay: 3,
            }}
          />
        </View>

        <View style={styles.heatmapContainer}>
          <Text style={styles.subTitle}>Bitbucket Style</Text>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="bitbucket"
            onCellPress={handleCellPress}
            cellSize={10}
            cellSpacing={1}
            showMonthLabels={true}
            showWeekdayLabels={false}
            animated={animationsEnabled}
            animation={{
              entryAnimation: 'slide',
              duration: 250,
              staggerDelay: 2,
            }}
          />
        </View>

        <Text style={styles.sectionTitle}>Accessibility & Sunset Themes</Text>
        <View style={styles.heatmapContainer}>
          <Text style={styles.subTitle}>High Contrast (Accessible)</Text>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="accessible"
            cellShape="rounded"
            onCellPress={handleCellPress}
            cellSize={14}
            cellSpacing={3}
            showMonthLabels={true}
            showWeekdayLabels={true}
            animated={animationsEnabled}
            hapticFeedback={hapticEnabled}
          />
        </View>

        <View style={styles.heatmapContainer}>
          <Text style={styles.subTitle}>Sunset Theme</Text>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="sunset"
            cellShape="circle"
            onCellPress={handleCellPress}
            onCellLongPress={handleCellLongPress}
            cellSize={12}
            cellSpacing={2}
            showMonthLabels={true}
            showWeekdayLabels={true}
            animated={animationsEnabled}
            animation={{
              entryAnimation: 'scale',
              duration: 400,
              staggerDelay: 8,
            }}
            tooltip={{
              enabled: tooltipsEnabled,
              content: customTooltipContent,
              backgroundColor: '#ff6b6b',
              textColor: 'white',
            }}
          />
        </View>

        <Text style={styles.info}>
          v1.1.0 Features:\n • Tap: Shows alert with cell info\n • Long Press:
          Shows tooltip (if enabled)\n • Double Tap: Quick action\n •
          Animations: Entry animations with stagger\n • Haptic Feedback: Touch
          feedback on supported devices\n • New Color Schemes: GitLab,
          Bitbucket, Accessible, Sunset, Neon
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  heatmapContainer: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  darkContainer: {
    backgroundColor: '#0d1117',
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginTop: 30,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  control: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
    color: '#666',
  },
});
