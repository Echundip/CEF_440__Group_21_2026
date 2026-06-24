import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen, StatTile } from '../../components';
import { courses } from '../../data/mock';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';

const participation = [40, 65, 52, 78, 60, 85, 72];
const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];

const networkIssues = [
  { label: 'Audio fallback triggered', value: 0.42, color: colors.moderate },
  { label: 'Sessions interrupted', value: 0.18, color: colors.poor },
  { label: 'Smooth HD playback', value: 0.74, color: colors.good },
];

export function AnalyticsScreen() {
  const maxP = Math.max(...participation);

  return (
    <Screen>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Engagement, completion and network insights</Text>

      <View style={styles.stats}>
        <StatTile icon="trending-up-outline" value="68%" label="Avg. completion" tint={colors.good} tintSoft={colors.goodSoft} />
        <View style={{ width: spacing.md }} />
        <StatTile icon="pulse-outline" value="3.1k" label="Sessions" />
      </View>

      <Text style={styles.sectionTitle}>Student participation</Text>
      <Card>
        <View style={styles.chart}>
          {participation.map((v, i) => (
            <View key={i} style={styles.barCol}>
              <View style={[styles.bar, { height: 12 + (v / maxP) * 110 }]} />
              <Text style={styles.barLabel}>{weeks[i]}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Completion rates</Text>
      <Card>
        {courses.map((c, i, arr) => (
          <View key={c.id} style={[styles.completionRow, i < arr.length - 1 && styles.completionBorder]}>
            <Text style={styles.completionTitle} numberOfLines={1}>{c.title}</Text>
            <View style={styles.completionBarRow}>
              <ProgressBar progress={c.progress} color={c.color} />
              <Text style={styles.completionPct}>{Math.round(c.progress * 100)}%</Text>
            </View>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Network issues (QoE)</Text>
      <Card>
        {networkIssues.map((n, i, arr) => (
          <View key={n.label} style={[styles.issueRow, i < arr.length - 1 && styles.completionBorder]}>
            <View style={styles.issueHead}>
              <Text style={styles.issueLabel}>{n.label}</Text>
              <Text style={[styles.issuePct, { color: n.color }]}>{Math.round(n.value * 100)}%</Text>
            </View>
            <ProgressBar progress={n.value} color={n.color} />
          </View>
        ))}
        <View style={styles.insight}>
          <Ionicons name="bulb-outline" size={16} color={colors.navy} />
          <Text style={styles.insightText}>
            42% of sessions fell back to audio — consider uploading lighter SD encodes for module 2.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 18, borderRadius: 6, backgroundColor: colors.navy },
  barLabel: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm },
  completionRow: { paddingVertical: spacing.md },
  completionBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  completionTitle: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  completionBarRow: { flexDirection: 'row', alignItems: 'center' },
  completionPct: { fontSize: 12, fontWeight: '700', color: colors.text, marginLeft: spacing.md, width: 36, textAlign: 'right' },
  issueRow: { paddingVertical: spacing.md },
  issueHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  issueLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  issuePct: { fontSize: 13, fontWeight: '800' },
  insight: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  insightText: { flex: 1, fontSize: 12, color: colors.text, marginLeft: spacing.sm, lineHeight: 18 },
});
