import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/typography';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
  fullWidth = true,
}: AppButtonProps) {
  const isOutline = variant === 'outline' || variant === 'ghost';
  const textColor =
    variant === 'primary'
      ? colors.textInverse
      : variant === 'secondary'
      ? colors.navy
      : colors.navy;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.navy : colors.white} />
      ) : (
        <>
          {icon ? (
            <Ionicons name={icon} size={18} color={textColor} style={styles.icon} />
          ) : null}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  fullWidth: { alignSelf: 'stretch' },
  primary: { backgroundColor: colors.navy },
  secondary: { backgroundColor: colors.accentSoft },
  outline: { borderWidth: 1.5, borderColor: colors.navy, backgroundColor: 'transparent' },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  label: { fontSize: 15, fontWeight: '700' },
  icon: { marginRight: spacing.sm },
});
