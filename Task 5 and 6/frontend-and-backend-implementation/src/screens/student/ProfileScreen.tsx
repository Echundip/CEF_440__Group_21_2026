import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen, SectionHeader } from '../../components';
import { courses } from '../../data/mock';
import { RootStackParamList, StudentTabParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

const stats = [
  { label: 'Courses',    value: '3'   },
  { label: 'Completed',  value: '1'   },
  { label: 'Downloads',  value: '4'   },
  { label: 'Streak',     value: '7d'  },
];

const infoRows: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string; value: string }> = [
  { icon: 'person-outline',     label: 'Full Name',  value: 'Precious Nkeng'           },
  { icon: 'school-outline',     label: 'Program',    value: 'Computer Engineering'     },
  { icon: 'mail-outline',       label: 'Email',      value: 'student@edustream.com'    },
  { icon: 'location-outline',   label: 'Campus',     value: 'University of Buea'       },
  { icon: 'checkmark-circle-outline', label: 'Status', value: 'Active Learner'         },
];

export function ProfileScreen({ navigation }: Props) {
  return (
    <Screen>
      {/* Avatar & name */}
      <View style={styles.heroSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>PN</Text>
        </View>
        <Text style={styles.name}>Precious Nkeng</Text>
        <Text style={styles.role}>Computer Engineering · Year 4</Text>
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active Learner</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Info */}
      <SectionHeader title="Profile information" />
      <View style={styles.infoCard}>
        {infoRows.map((row, i) => (
          <View key={row.label} style={[styles.infoRow, i < infoRows.length - 1 && styles.infoBorder]}>
            <View style={styles.infoIcon}>
              <Ionicons name={row.icon} size={16} color={colors.navy} />
            </View>
            <View>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Enrolled courses */}
      <SectionHeader title="Enrolled courses" actionLabel="See all" onAction={() => navigation.navigate('Courses')} />
      {courses.map((c) => (
        <Pressable
          key={c.id}
          style={styles.courseRow}
          onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })}
        >
          <View style={[styles.courseThumb, { backgroundColor: c.color }]}>
            <Ionicons name="book" size={16} color={colors.white} />
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={1}>{c.title}</Text>
            <Text style={styles.courseMeta}>{c.instructor}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${c.progress * 100}%` as any }]} />
            </View>
          </View>
          <Text style={styles.progressPct}>{Math.round(c.progress * 100)}%</Text>
        </Pressable>
      ))}

      {/* Settings shortcut */}
      <Pressable
        style={styles.settingsBtn}
        onPress={() => navigation.navigate('Settings' as any)}
      >
        <Ionicons name="settings-outline" size={18} color={colors.navy} />
        <Text style={styles.settingsBtnText}>Account Settings</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.navy, alignItems: 'center',
    justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 28 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  role: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.goodSoft, paddingHorizontal: spacing.md,
    paddingVertical: 4, borderRadius: radius.pill, marginTop: spacing.sm,
  },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.good },
  activeText: { fontSize: 12, fontWeight: '700', color: colors.good },

  statsRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: radius.md, ...shadow, marginBottom: spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.lg },
  statValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  infoCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    marginBottom: spacing.lg, ...shadow,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon: {
    width: 34, height: 34, borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  infoLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 1 },

  courseRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, ...shadow,
  },
  courseThumb: {
    width: 42, height: 42, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  courseMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginTop: 6 },
  progressFill: { height: 4, backgroundColor: colors.navy, borderRadius: 2 },
  progressPct: { fontSize: 13, fontWeight: '700', color: colors.navy, marginLeft: spacing.md },

  settingsBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, ...shadow, gap: spacing.md, marginTop: spacing.sm,
  },
  settingsBtnText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.navy },
});
