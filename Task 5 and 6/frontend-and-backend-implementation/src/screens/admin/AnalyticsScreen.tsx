/**
 * AnalyticsScreen
 *
 * For the DAU line chart you have two options:
 *   Option A (recommended): install react-native-chart-kit
 *     npm install react-native-chart-kit react-native-svg
 *   Option B: install victory-native
 *     npm install victory-native react-native-svg
 *
 * The chart section below uses react-native-chart-kit.
 * If you prefer a different library, swap out the <LineChart> block.
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import {
  Card,
  CardTitle,
  ProgressRow,
  SectionLabel,
  MetricGrid,
} from '../../components/SharedComponents';
import { colors } from '../../theme/theme';

import { LineChart } from 'react-native-chart-kit';

const SCREEN_W = Dimensions.get('window').width;
const CHART_W = SCREEN_W - 22 * 2 - 11 * 2 - 2; // account for padding + card border

const DAU_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ data: [980, 1050, 1180, 1090, 1340, 720, 640] }],
};

const FACULTY_STATS = [
  { label: 'Engineering', value: '84%', color: colors.green },
  { label: 'Medicine', value: '79%', color: colors.cyan },
  { label: 'Sciences', value: '73%', color: colors.purple },
  { label: 'Law', value: '61%', color: colors.amber },
  { label: 'Arts & Social Sci.', value: '47%', color: colors.red },
];

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionLabel text="Quality of Experience" />

      <MetricGrid
        items={[
          { label: 'Avg Session', value: '38m', valueColor: colors.cyan, sub: '↑ 6% this week', subType: 'up' },
          { label: 'Completion', value: '72%', valueColor: colors.green, sub: '↑ 4pts', subType: 'up' },
          { label: 'Satisfaction', value: '4.3/5', valueColor: colors.amber, sub: '12,041 ratings' },
          { label: 'Drop-off', value: '18%', valueColor: colors.red, sub: '↑ 2pts flagged', subType: 'dn' },
        ]}
      />

      {/* DAU Chart */}
      <Card>
        <CardTitle title="Daily Active Users (7 days)" />
       
        
        <LineChart
          data={DAU_DATA}
          width={CHART_W}
          height={120}
          chartConfig={{
            backgroundColor: colors.bgCard,
            backgroundGradientFrom: colors.bgCard,
            backgroundGradientTo: colors.bgCard,
            color: () => colors.cyan,
            labelColor: () => colors.text3,
            decimalPlaces: 0,
            propsForDots: { r: '3', strokeWidth: '2', stroke: colors.cyan },
          }}
          bezier
          withDots
          withInnerLines={false}
          withOuterLines={false}
          style={{ borderRadius: 8 }}
        />
       
        {/* ── Placeholder until chart lib is installed ──
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>
            📈 Install react-native-chart-kit + react-native-svg{'\n'}
            then uncomment the LineChart block above
          </Text>
        </View> */}
      </Card>

      {/* Platform breakdown */}
      <Card>
        <CardTitle title="Platform Access" />
        <ProgressRow label="Mobile App" right="54%" pct={54} fillColor={colors.accent} />
        <ProgressRow label="Web Browser" right="33%" pct={33} fillColor={colors.cyan} />
        <ProgressRow label="Desktop App" right="13%" pct={13} fillColor={colors.green} />
      </Card>

      {/* Faculty engagement */}
      <Card>
        <CardTitle title="Engagement by Faculty" />
        {FACULTY_STATS.map((f, i) => (
          <View
            key={i}
            style={[styles.statRow, i === FACULTY_STATS.length - 1 && styles.statRowLast]}
          >
            <Text style={styles.sk}>{f.label}</Text>
            <Text style={[styles.sv, { color: f.color }]}>{f.value}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 11, backgroundColor: colors.bg },
  chartPlaceholder: {
    height: 120,
    backgroundColor: colors.bg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    fontSize: 11,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 18,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statRowLast: { borderBottomWidth: 0 },
  sk: { fontSize: 11, color: colors.text2 },
  sv: { fontSize: 11, fontWeight: '600', fontFamily: 'monospace' },
});
