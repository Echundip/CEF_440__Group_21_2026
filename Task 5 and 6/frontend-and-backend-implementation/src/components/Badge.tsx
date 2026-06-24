import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/typography';

interface BadgeProps {
  label: string;
  color?: string;
  background?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function Badge({ label, color = colors.navy, background = colors.surfaceAlt, icon }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      {icon ? <Ionicons name={icon} size={13} color={color} style={styles.icon} /> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  icon: { marginRight: 5 },
  label: { fontSize: 12, fontWeight: '700' },
});
