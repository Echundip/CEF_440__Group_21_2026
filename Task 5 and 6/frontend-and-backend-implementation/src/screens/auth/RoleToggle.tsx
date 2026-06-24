import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Role } from '../../data/types';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';

interface RoleToggleProps {
  role: Role;
  onChange: (role: Role) => void;
}

export function RoleToggle({ role, onChange }: RoleToggleProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>I am a</Text>
      <View style={styles.toggle}>
        <Option label="Student" icon="book-outline" active={role === 'student'} onPress={() => onChange('student')} />
        <Option label="Instructor" icon="easel-outline" active={role === 'instructor'} onPress={() => onChange('instructor')} />
        <Option label="Admin" icon="easel-outline" active={role === 'admin'} onPress={() => onChange('admin')} />
      </View>
    </View>
  );
}

function Option({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.option, active && styles.optionActive]}>
      <Ionicons name={icon} size={16} color={active ? colors.white : colors.textMuted} />
      <Text style={[styles.optionText, active && styles.optionTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
  },
  optionActive: { backgroundColor: colors.navy },
  optionText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: colors.textMuted },
  optionTextActive: { color: colors.white },
});
