import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';

type Assignment = {
  name: string;
  course: string;
  deadline: string;
  status: 'Pending' | 'Submitted' | 'Overdue';
};

const assignments: Assignment[] = [
  { name: 'Project 1', course: 'Mobile App Development', deadline: '15 Jun', status: 'Pending' },
  { name: 'Quiz 2', course: 'Database Systems', deadline: '18 Jun', status: 'Submitted' },
  { name: 'Lab Report', course: 'Networking', deadline: '10 Jun', status: 'Overdue' },
  { name: 'Assignment 3', course: 'Networks & QoE', deadline: '22 Jun', status: 'Pending' },
];

const statusConfig = {
  Pending:   { bg: colors.moderateSoft, color: colors.moderate, icon: 'time-outline'           as const },
  Submitted: { bg: colors.goodSoft,     color: colors.good,     icon: 'checkmark-circle-outline' as const },
  Overdue:   { bg: colors.poorSoft,     color: colors.poor,     icon: 'alert-circle-outline'   as const },
};

export function AssignmentsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Assignments</Text>
          <Text style={styles.subtitle}>{assignments.length} tasks</Text>
        </View>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          {(['Pending', 'Submitted', 'Overdue'] as const).map((s) => {
            const count = assignments.filter((a) => a.status === s).length;
            const cfg = statusConfig[s];
            return (
              <View key={s} style={[styles.summaryCard, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.summaryCount, { color: cfg.color }]}>{count}</Text>
                <Text style={[styles.summaryLabel, { color: cfg.color }]}>{s}</Text>
              </View>
            );
          })}
        </View>

        {/* Assignment list */}
        <Text style={styles.sectionLabel}>All assignments</Text>
        {assignments.map((item, i) => {
          const cfg = statusConfig[item.status];
          return (
            <View key={i} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={20} color={cfg.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.assignmentName}>{item.name}</Text>
                <Text style={styles.courseName}>{item.course}</Text>
              </View>
              <View style={styles.rightCol}>
                <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
                </View>
                <Text style={styles.deadline}>Due {item.deadline}</Text>
              </View>
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  header: { marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },

  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  summaryCard: {
    flex: 1, borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center',
  },
  summaryCount: { fontSize: 24, fontWeight: '800' },
  summaryLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: spacing.md,
  },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm,
    ...shadow,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardBody: { flex: 1 },
  assignmentName: { fontSize: 15, fontWeight: '700', color: colors.text },
  courseName: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  rightCol: { alignItems: 'flex-end', gap: 6 },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  statusText: { fontSize: 11, fontWeight: '700' },
  deadline: { fontSize: 11, color: colors.textMuted },
});
