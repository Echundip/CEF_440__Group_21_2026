import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius, shadow, spacing } from '../theme/typography';

interface StatTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  tint?: string;
  tintSoft?: string;
  style?: ViewStyle;
}

export function StatTile({ icon, value, label, tint = colors.navy, tintSoft = colors.surfaceAlt, style }: StatTileProps) {
  return (
    <View style={[styles.tile, style]}>
      <View style={[styles.iconWrap, { backgroundColor: tintSoft }]}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  value: { fontSize: 22, fontWeight: '800', color: colors.text },
  label: { fontSize: 12, fontWeight: '500', color: colors.textMuted, marginTop: 2 },
});
