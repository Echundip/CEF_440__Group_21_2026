import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  CardTitle,
  SectionLabel,
  MetricGrid,
} from '../../components/SharedComponents';
import { colors, radius } from '../../theme/theme';

const TOP_COURSES = [
  { emoji: '📱', name: 'Mobile Application Development', lecturer: 'Dr. Makane', enrolled: 155, rating: 4.9, top: true },
  { emoji: '💻', name: 'Intro to Machine Learning', lecturer: 'Dr. Fortunee', enrolled: 148, rating: 4.8 },
  { emoji: '⚗️', name: 'Organic Chemistry II', lecturer: 'Dr. Makane', enrolled: 137, rating: 4.5 },
  { emoji: '⚖️', name: 'Constitutional Law', lecturer: 'Dr. Fortunee', enrolled: 129, rating: 4.7 },
  { emoji: '📐', name: 'Advanced Calculus', lecturer: 'Dr. Makane', enrolled: 112, rating: 4.3 },
];

const FLAGGED = [
  {
    type: 'danger',
    msg: 'BIO 301 — Outdated content (2018 curriculum)',
    time: 'Flagged by AI Quality Check · 3 days ago',
  },
  {
    type: 'warn',
    msg: 'ENG 204 — Assessment plagiarism above threshold',
    time: 'Flagged by system · 1 day ago',
  },
];

const thumbBg: Record<string, string> = {
  '📱': colors.accentLight,
  '💻': colors.purpleLight,
  '⚗️': colors.cyanLight,
  '⚖️': colors.greenLight,
  '📐': colors.amberLight,
};

export default function CoursesScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionLabel text="Course Supervision" />

      <MetricGrid
        items={[
          { label: 'Total Courses', value: '847', valueColor: colors.accent, sub: 'All faculties' },
          { label: 'Under Review', value: '24', valueColor: colors.amber, sub: 'Pending approval', subType: 'dn' },
          { label: 'Published', value: '798', valueColor: colors.green, sub: 'Live', subType: 'up' },
          { label: 'Flagged', value: '5', valueColor: colors.red, sub: 'Quality issues', subType: 'dn' },
        ]}
      />

      <Card>
        <CardTitle title="Top Enrolled Courses" />
        {TOP_COURSES.map((c, i) => (
          <View key={i}>
            {c.top ? (
              <View style={styles.topCourse}>
                <Text style={styles.topBadge}>#1 Most Enrolled</Text>
                <View style={styles.crow}>
                  <View style={[styles.cthumb, { backgroundColor: thumbBg[c.emoji] }]}>
                    <Text style={styles.cthumEmoji}>{c.emoji}</Text>
                  </View>
                  <View style={styles.cinfo}>
                    <Text style={[styles.cname, { color: colors.accent }]}>{c.name}</Text>
                    <Text style={styles.cmeta}>{c.lecturer} · {c.enrolled} enrolled</Text>
                  </View>
                  <Text style={styles.rating}>★ {c.rating}</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.crow, i < TOP_COURSES.length - 1 && styles.crowBorder]}>
                <View style={[styles.cthumb, { backgroundColor: thumbBg[c.emoji] || colors.accentLight }]}>
                  <Text style={styles.cthumEmoji}>{c.emoji}</Text>
                </View>
                <View style={styles.cinfo}>
                  <Text style={styles.cname}>{c.name}</Text>
                  <Text style={styles.cmeta}>{c.lecturer} · {c.enrolled} enrolled</Text>
                </View>
                <Text style={styles.rating}>★ {c.rating}</Text>
              </View>
            )}
          </View>
        ))}
      </Card>

      <Card>
        <CardTitle title="Flagged for Review" />
        {FLAGGED.map((f, i) => (
          <View
            key={i}
            style={[styles.arow, i === FLAGGED.length - 1 && styles.arowLast]}
          >
            <View
              style={[
                styles.aicon,
                { backgroundColor: f.type === 'danger' ? colors.redLight : colors.amberLight },
              ]}
            >
              <Text style={{ fontSize: 12, color: f.type === 'danger' ? colors.red : colors.amber }}>
                {f.type === 'danger' ? '⊗' : '⚠'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.amsg}>{f.msg}</Text>
              <Text style={styles.atime}>{f.time}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 11, backgroundColor: colors.bg },
  topCourse: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: radius.md,
    padding: 8,
    marginBottom: 8,
    backgroundColor: colors.accentLight,
  },
  topBadge: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    color: '#fff',
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 4,
    overflow: 'hidden',
  },
  crow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
  },
  crowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cthumb: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cthumEmoji: { fontSize: 16 },
  cinfo: { flex: 1 },
  cname: { fontSize: 12, fontWeight: '500', color: colors.text },
  cmeta: { fontSize: 9, color: colors.text3, marginTop: 2 },
  rating: { fontSize: 10, color: colors.amber, fontWeight: '600' },
  arow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  arowLast: { borderBottomWidth: 0 },
  aicon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amsg: { fontSize: 11, color: colors.text, lineHeight: 16 },
  atime: { fontSize: 9, color: colors.text3, marginTop: 2 },
});
