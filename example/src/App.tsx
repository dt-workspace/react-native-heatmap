import { Text, View, StyleSheet, ScrollView } from 'react-native';
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
  const handleCellPress = (data: HeatmapData, index: number) => {
    console.log('Cell pressed:', data, index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>React Native Heatmap Demo</Text>

        <Text style={styles.sectionTitle}>GitHub Style (Default)</Text>
        <View style={styles.heatmapContainer}>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="github"
            onCellPress={handleCellPress}
            cellSize={12}
            showMonthLabels={true}
            showWeekdayLabels={true}
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

        <Text style={styles.sectionTitle}>Heat Colors</Text>
        <View style={styles.heatmapContainer}>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="heat"
            onCellPress={handleCellPress}
            cellSize={10}
            cellSpacing={1}
            showMonthLabels={true}
            showWeekdayLabels={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Rounded Cells</Text>
        <View style={styles.heatmapContainer}>
          <Heatmap
            data={sampleData}
            startDate={startDate}
            colorScheme="blue"
            cellShape="rounded"
            onCellPress={handleCellPress}
            cellSize={14}
            cellSpacing={3}
            showMonthLabels={true}
            showWeekdayLabels={true}
          />
        </View>

        <Text style={styles.info}>
          Tap on any cell to see interaction in console
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
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});
