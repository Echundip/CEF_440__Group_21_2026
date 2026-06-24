import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';

type EventType = 'deadline' | 'class' | 'exam';

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  day: number;
  month: string;
  type: EventType;
  time?: string;
};

const events: CalendarEvent[] = [
  { id: '1', title: 'Assignment Deadline – Project 1', date: 'June 15', day: 15, month: 'JUN', type: 'deadline', time: '11:59 PM' },
  { id: '2', title: 'Live Class – Networks & QoE', date: 'June 18', day: 18, month: 'JUN', type: 'class', time: '2:00 PM' },
  { id: '3', title: 'Lab Report Due', date: 'June 20', day: 20, month: 'JUN', type: 'deadline', time: '5:00 PM' },
  { id: '4', title: 'Exam Week Begins', date: 'June 25', day: 25, month: 'JUN', type: 'exam' },
  { id: '5', title: 'Database Systems Quiz', date: 'June 27', day: 27, month: 'JUN', type: 'exam', time: '10:00 AM' },
];

const eventConfig: Record<EventType, { icon: keyof typeof Ionicons.glyphMap; bg: string; color: string; label: string }> = {
  deadline: { icon: 'time-outline',       bg: colors.moderateSoft, color: colors.moderate, label: 'Deadline' },
  class:    { icon: 'videocam-outline',   bg: colors.surfaceAlt,   color: colors.navy,     label: 'Live Class' },
  exam:     { icon: 'document-text-outline', bg: colors.poorSoft,  color: colors.poor,     label: 'Exam' },
};

const FILTERS: Array<EventType | 'all'> = ['all', 'deadline', 'class', 'exam'];

export function CalendarScreen() {
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  const visible = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>June 2026</Text>
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[styles.chip, filter === f && styles.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                {f === 'all' ? 'All' : eventConfig[f].label + 's'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          {(['deadline', 'class', 'exam'] as EventType[]).map((t) => {
            const cfg = eventConfig[t];
            const count = events.filter((e) => e.type === t).length;
            return (
              <View key={t} style={[styles.summaryCard, { backgroundColor: cfg.bg }]}>
                <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                <Text style={[styles.summaryCount, { color: cfg.color }]}>{count}</Text>
                <Text style={[styles.summaryLabel, { color: cfg.color }]}>{cfg.label}s</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Upcoming events</Text>

        {visible.map((event) => {
          const cfg = eventConfig[event.type];
          return (
            <View key={event.id} style={styles.card}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateDay}>{event.day}</Text>
                <Text style={styles.dateMonth}>{event.month}</Text>
              </View>
              <View style={[styles.typeDot, { backgroundColor: cfg.color }]} />
              <View style={styles.cardBody}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <View style={[styles.typePill, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.typeLabel, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                  {event.time && (
                    <View style={styles.timeRow}>
                      <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                      <Text style={styles.timeText}>{event.time}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {visible.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color={colors.border} />
            <Text style={styles.emptyText}>No events in this category</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  header: { marginBottom: spacing.md },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },

  filterRow: { marginBottom: spacing.lg },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill, backgroundColor: colors.surface,
    marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: colors.white },

  summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  summaryCard: {
    flex: 1, borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center', gap: 4,
  },
  summaryCount: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 11, fontWeight: '600' },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.md,
  },

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadow,
  },
  dateBadge: {
    width: 46, height: 46, borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  dateDay: { fontSize: 18, fontWeight: '800', color: colors.text, lineHeight: 20 },
  dateMonth: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  typeDot: { width: 4, height: '100%', borderRadius: 2, marginRight: spacing.md, minHeight: 40 },
  cardBody: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  typePill: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill },
  typeLabel: { fontSize: 11, fontWeight: '700' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  timeText: { fontSize: 12, color: colors.textMuted },

  empty: { alignItems: 'center', marginTop: spacing.xxl, gap: spacing.md },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
