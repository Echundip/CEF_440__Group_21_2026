import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';


const infoRows: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string; value: string }> = [
  { icon: 'person-outline',         label: 'Full Name',    value: 'System Administrator'     },
  { icon: 'shield-checkmark-outline', label: 'Role',       value: 'Super Admin'              },
  { icon: 'mail-outline',           label: 'Email',        value: 'admin@edustream.com'      },
  { icon: 'business-outline',       label: 'Department',   value: 'IT & Platform Management' },
  { icon: 'time-outline',           label: 'Last Login',   value: 'Today, 9:42 AM'           },
];

const statCards = [
  { label: 'Total Users',   value: '248', icon: 'people-outline'    as const },
  { label: 'Total Courses', value: '34',  icon: 'book-outline'      as const },
  { label: 'Active Now',    value: '17',  icon: 'radio-button-on'   as const },
  { label: 'Alerts',        value: '3',   icon: 'warning-outline'   as const },
];

const quickLinks: Array<{ icon: keyof typeof Ionicons.glyphMap; label: string; tab: string }> = [
  { icon: 'people-outline',    label: 'Manage Users',    tab: 'Users'     },
  { icon: 'pulse-outline',     label: 'System Health',   tab: 'Health'    },
  { icon: 'bar-chart-outline', label: 'Analytics',       tab: 'Analytics' },
  { icon: 'book-outline',      label: 'Courses',         tab: 'Courses'   },
];

type Props = NativeStackScreenProps<RootStackParamList, 'AdminProfile'>;

export function AdminProfileScreen({ navigation }: Props) {
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={styles.backText}>Dashboard</Text>
        </Pressable>

        {/* Avatar hero */}
        <View style={styles.hero}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <Text style={styles.name}>System Administrator</Text>
          <Text style={styles.role}>Super Admin · EduStream</Text>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Online</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {statCards.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Ionicons name={s.icon} size={18} color={colors.navy} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Info rows */}
        <Text style={styles.sectionLabel}>Account Details</Text>
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

        {/* Quick links */}
        <Text style={styles.sectionLabel}>Quick Navigation</Text>
        <View style={styles.quickGrid}>
          {quickLinks.map((link) => (
            <Pressable
              key={link.label}
              style={styles.quickCard}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.quickIcon}>
                <Ionicons name={link.icon} size={20} color={colors.navy} />
              </View>
              <Text style={styles.quickLabel}>{link.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.poor} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  backText: { fontSize: 15, fontWeight: '600', color: colors.text },

  hero: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: colors.navy, alignItems: 'center',
    justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 30 },
  name:        { fontSize: 22, fontWeight: '800', color: colors.text },
  role:        { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  activeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.goodSoft, paddingHorizontal: spacing.md,
    paddingVertical: 4, borderRadius: radius.pill, marginTop: spacing.sm,
  },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.good },
  activeText: { fontSize: 12, fontWeight: '700', color: colors.good },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  statCard: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },

  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: spacing.sm, marginTop: spacing.sm,
  },

  infoCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    marginBottom: spacing.xl, ...shadow,
  },
  infoRow:   { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  infoBorder:{ borderBottomWidth: 1, borderBottomColor: colors.border },
  infoIcon:  {
    width: 34, height: 34, borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt, alignItems: 'center',
    justifyContent: 'center', marginRight: spacing.md,
  },
  infoLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 1 },

  quickGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl,
  },
  quickCard: {
    width: '47%', backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', gap: spacing.sm, ...shadow,
  },
  quickIcon: {
    width: 44, height: 44, borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontSize: 13, fontWeight: '600', color: colors.text },

  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.poorSoft,
    borderRadius: radius.md, padding: spacing.md,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: colors.poor },
});
