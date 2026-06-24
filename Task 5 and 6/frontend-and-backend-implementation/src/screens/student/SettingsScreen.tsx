import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../../task 6/backend-implementation/supabase';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';

type SettingRow = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  type: 'toggle' | 'nav' | 'value';
  value?: string;
  defaultOn?: boolean;
};

type Section = {
  title: string;
  items: SettingRow[];
};

const sections: Section[] = [
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', type: 'toggle', defaultOn: true },
      { id: 'darkmode', label: 'Dark Mode', icon: 'moon-outline', type: 'toggle', defaultOn: false },
      { id: 'language', label: 'Language', icon: 'language-outline', type: 'value', value: 'English' },
    ],
  },
  {
    title: 'Learning',
    items: [
      { id: 'autoplay', label: 'Auto-play next lesson', icon: 'play-skip-forward-outline', type: 'toggle', defaultOn: true },
      { id: 'qoe', label: 'Adaptive Streaming (QoE)', icon: 'pulse-outline', type: 'toggle', defaultOn: true },
      { id: 'offline', label: 'Offline downloads', icon: 'cloud-download-outline', type: 'toggle', defaultOn: false },
      { id: 'quality', label: 'Video Quality', icon: 'videocam-outline', type: 'value', value: 'Auto' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'password', label: 'Change Password', icon: 'lock-closed-outline', type: 'nav' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'shield-outline', type: 'nav' },
      { id: 'about', label: 'About EduStream', icon: 'information-circle-outline', type: 'nav' },
    ],
  },
];

export function SettingsScreen() {
  const initialToggles: Record<string, boolean> = {};

  sections.forEach(section => {
    section.items.forEach(item => {
      if (item.type === 'toggle') {
        initialToggles[item.id] = item.defaultOn ?? false;
      }
    });
  });

  const [toggles, setToggles] = useState(initialToggles);

  const flip = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNav = (label: string) => {
    Alert.alert(label, 'This feature is coming soon.');
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your preferences</Text>
        </View>

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.row,
                    index !== section.items.length - 1 && styles.rowBorder,
                  ]}
                >
                  {/* LEFT SIDE */}
                  <View style={styles.rowLeft}>
                    <View style={styles.iconWrap}>
                      <Ionicons name={item.icon} size={18} color={colors.navy} />
                    </View>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                  </View>

                  {/* RIGHT SIDE */}
                  {item.type === 'toggle' && (
                    <Switch
                      value={toggles[item.id]}
                      onValueChange={() => flip(item.id)}
                      trackColor={{ false: colors.border, true: colors.navyLight }}
                      thumbColor={toggles[item.id] ? colors.white : colors.surface}
                    />
                  )}

                  {item.type === 'value' && (
                    <Text style={styles.valueText}>{item.value}</Text>
                  )}

                  {item.type === 'nav' && (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.textMuted}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* SIGN OUT BUTTON */}
        <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color={colors.poor} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <Text style={styles.version}>EduStream v1.0.0 · Group 21</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  header: { marginBottom: spacing.xl },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },

  section: { marginBottom: spacing.xl },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },

  valueText: {
    fontSize: 14,
    color: colors.textMuted,
  },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.poorSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.poor,
  },

  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
  },
});