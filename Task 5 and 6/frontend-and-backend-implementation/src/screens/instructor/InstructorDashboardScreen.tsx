import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, ProgressBar, Screen, SectionHeader, StatTile } from '../../components';
import { courses } from '../../data/mock';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { InstructorTabParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<InstructorTabParamList, 'InstructorHome'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function InstructorDashboardScreen({ navigation }: Props) {
  const totalStudents = courses.reduce((n, c) => n + c.enrolledStudents, 0);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Instructor</Text>
          <Text style={styles.name}>Dr. A. Mbarga</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AM</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <StatTile icon="albums-outline" value={`${courses.length}`} label="Courses" />
        <View style={{ width: spacing.md }} />
        <StatTile icon="people-outline" value={`${totalStudents}`} label="Students" tint={colors.good} tintSoft={colors.goodSoft} />
        <View style={{ width: spacing.md }} />
        <StatTile icon="cloud-upload-outline" value="14" label="Uploads" tint={colors.moderate} tintSoft={colors.moderateSoft} />
      </View>

      <View style={styles.ctaRow}>
        <Pressable style={styles.cta} onPress={() => navigation.navigate('CreateCourse')}>
          <Ionicons name="add-circle" size={24} color={colors.white} />
          <Text style={styles.ctaText}>Create course</Text>
        </Pressable>
        <Pressable style={[styles.cta, styles.ctaAlt]} onPress={() => navigation.navigate('UploadContent')}>
          <Ionicons name="cloud-upload" size={24} color={colors.navy} />
          <Text style={[styles.ctaText, { color: colors.navy }]}>Upload content</Text>
        </Pressable>
      </View>

      <SectionHeader title="Courses managed" actionLabel="Manage" onAction={() => navigation.navigate('ManageCourses')} />
      {courses.map((c) => (
        <Card key={c.id} style={styles.courseCard}>
          <View style={styles.courseRow}>
            <View style={[styles.thumb, { backgroundColor: c.color }]}>
              <Ionicons name="book" size={20} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.courseTitle} numberOfLines={1}>{c.title}</Text>
              <Text style={styles.courseMeta}>{c.enrolledStudents} students enrolled</Text>
            </View>
          </View>
          <View style={styles.completionRow}>
            <ProgressBar progress={c.progress} color={c.color} />
            <Text style={styles.completionPct}>{Math.round(c.progress * 100)}%</Text>
          </View>
        </Card>
      ))}

      <SectionHeader title="Recent uploads" />
      <Card>
        {[
          { icon: 'videocam-outline', text: 'Lesson 3 - Your first screen', time: '1h ago' },
          { icon: 'document-text-outline', text: 'Networks slides (PDF)', time: 'Yesterday' },
          { icon: 'help-circle-outline', text: 'Module 1 Quiz', time: '3 days ago' },
        ].map((item, i, arr) => (
          <View key={item.text} style={[styles.uploadRow, i < arr.length - 1 && styles.uploadBorder]}>
            <View style={styles.uploadIcon}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={16} color={colors.navy} />
            </View>
            <Text style={styles.uploadText} numberOfLines={1}>{item.text}</Text>
            <Text style={styles.uploadTime}>{item.time}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 14, color: colors.textMuted },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.navyLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  stats: { flexDirection: 'row', marginTop: spacing.lg },
  ctaRow: { flexDirection: 'row', marginTop: spacing.lg },
  cta: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy, paddingVertical: spacing.lg, borderRadius: radius.md, marginRight: spacing.md },
  ctaAlt: { backgroundColor: colors.surfaceAlt, marginRight: 0 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 14, marginLeft: spacing.sm },
  courseCard: { marginBottom: spacing.md },
  courseRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  courseTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  courseMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  completionRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  completionPct: { fontSize: 12, fontWeight: '700', color: colors.text, marginLeft: spacing.md, width: 36, textAlign: 'right' },
  uploadRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  uploadBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  uploadIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  uploadText: { flex: 1, fontSize: 13, color: colors.text },
  uploadTime: { fontSize: 11, color: colors.textMuted, marginLeft: spacing.sm },
});
