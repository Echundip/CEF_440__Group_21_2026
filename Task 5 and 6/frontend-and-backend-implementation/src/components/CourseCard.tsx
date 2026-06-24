import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Course } from '../data/types';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/typography';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface CourseCardProps {
  course: Course;
  onPress?: () => void;
}

export function CourseCard({ course, onPress }: CourseCardProps) {
  const pct = Math.round(course.progress * 100);
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.thumb, { backgroundColor: course.color }]}>
          <Ionicons name="play-circle" size={26} color={colors.white} />
        </View>
        <View style={styles.info}>
          <Text style={styles.category}>{course.category.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="person-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.meta}>{course.instructor}</Text>
          </View>
        </View>
      </View>
      <View style={styles.progressRow}>
        <ProgressBar progress={course.progress} color={course.color} />
        <Text style={styles.pct}>{pct}%</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row' },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1 },
  category: { fontSize: 10, fontWeight: '700', color: colors.accent, letterSpacing: 0.5 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  meta: { fontSize: 12, color: colors.textMuted, marginLeft: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  pct: { fontSize: 12, fontWeight: '700', color: colors.text, marginLeft: spacing.md, width: 36, textAlign: 'right' },
});
