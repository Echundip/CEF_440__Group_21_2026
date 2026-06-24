import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Badge, Card, ProgressBar } from '../../components';
import { courses } from '../../data/mock';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';
import { ScrollView } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetails'>;

const tabs = ['Videos', 'Notes', 'Quizzes'] as const;

export function CourseDetailsScreen({ route, navigation }: Props) {
  const course = courses.find((c) => c.id === route.params.courseId) ?? courses[0];
  const [tab, setTab] = useState<(typeof tabs)[number]>('Videos');
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={[styles.hero, { backgroundColor: course.color }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Badge label={course.category} color={colors.white} background="rgba(255,255,255,0.2)" />
          <Text style={styles.heroTitle}>{course.title}</Text>
          <View style={styles.heroMeta}>
            <Ionicons name="person-circle-outline" size={16} color={colors.white} />
            <Text style={styles.heroMetaText}>{course.instructor}</Text>
            <Ionicons name="people-outline" size={16} color={colors.white} style={{ marginLeft: spacing.md }} />
            <Text style={styles.heroMetaText}>{course.enrolledStudents} enrolled</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Card>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your progress</Text>
              <Text style={styles.progressPct}>{Math.round(course.progress * 100)}%</Text>
            </View>
            <ProgressBar progress={course.progress} color={course.color} />
            <Text style={styles.progressMeta}>
              {Math.round(course.progress * totalLessons)} of {totalLessons} lessons completed
            </Text>
          </Card>

          <Text style={styles.sectionTitle}>About this course</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.tabBar}>
            {tabs.map((t) => (
              <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          {tab === 'Videos' ? (
            <View>
              {course.modules.map((m) => (
                <View key={m.id} style={styles.module}>
                  <Text style={styles.moduleTitle}>{m.title}</Text>
                  {m.lessons.map((l) => (
                    <Pressable
                      key={l.id}
                      style={styles.lesson}
                      onPress={() => navigation.navigate('Learning', { courseId: course.id })}
                    >
                      <Ionicons
                        name={l.completed ? 'checkmark-circle' : 'play-circle-outline'}
                        size={22}
                        color={l.completed ? colors.good : course.color}
                      />
                      <Text style={styles.lessonTitle} numberOfLines={1}>{l.title}</Text>
                      <Text style={styles.lessonDuration}>{l.durationMin}m</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </View>
          ) : null}

          {tab === 'Notes' ? (
            <Card>
              {['Lecture notes (PDF)', 'Summary slides', 'Reading list'].map((n, i, arr) => (
                <View key={n} style={[styles.resourceRow, i < arr.length - 1 && styles.resourceBorder]}>
                  <Ionicons name="document-text-outline" size={20} color={course.color} />
                  <Text style={styles.resourceText}>{n}</Text>
                  <Ionicons name="download-outline" size={20} color={colors.textMuted} />
                </View>
              ))}
            </Card>
          ) : null}

          {tab === 'Quizzes' ? (
            <Card>
              {['Module 1 Quiz', 'Module 2 Quiz'].map((q, i, arr) => (
                <View key={q} style={[styles.resourceRow, i < arr.length - 1 && styles.resourceBorder]}>
                  <Ionicons name="help-circle-outline" size={20} color={course.color} />
                  <Text style={styles.resourceText}>{q}</Text>
                  <Badge label={i === 0 ? 'Passed' : 'Not started'} color={i === 0 ? colors.good : colors.textMuted} background={i === 0 ? colors.goodSoft : colors.surfaceAlt} />
                </View>
              ))}
            </Card>
          ) : null}

          <AppButton
            label="Start learning"
            icon="play"
            onPress={() => navigation.navigate('Learning', { courseId: course.id })}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  back: { marginBottom: spacing.lg },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: '800', marginTop: spacing.md },
  heroMeta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  heroMetaText: { color: colors.white, fontSize: 13, marginLeft: 5, opacity: 0.95 },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  progressLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  progressPct: { fontSize: 14, fontWeight: '800', color: colors.navy },
  progressMeta: { fontSize: 12, color: colors.textMuted, marginTop: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  description: { fontSize: 14, color: colors.textMuted, lineHeight: 21 },
  tabBar: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: 4, marginTop: spacing.xl },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.sm },
  tabActive: { backgroundColor: colors.navy },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.white },
  module: { marginTop: spacing.lg },
  moduleTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  lesson: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  lessonTitle: { flex: 1, fontSize: 14, color: colors.text, marginLeft: spacing.md },
  lessonDuration: { fontSize: 12, color: colors.textMuted, marginLeft: spacing.sm },
  resourceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  resourceBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  resourceText: { flex: 1, fontSize: 14, color: colors.text, marginLeft: spacing.md },
});
