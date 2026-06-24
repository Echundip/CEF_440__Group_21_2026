import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Screen } from '../../components';
import { courses } from '../../data/mock';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { InstructorTabParamList, RootStackParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<InstructorTabParamList, 'ManageCourses'>,
  NativeStackScreenProps<RootStackParamList>
>;

const actions: { icon: keyof typeof Ionicons.glyphMap; label: string; tint: string }[] = [
  { icon: 'create-outline', label: 'Edit', tint: colors.navy },
  { icon: 'people-outline', label: 'Students', tint: colors.accent },
  { icon: 'trash-outline', label: 'Delete', tint: colors.poor },
];

export function ManageCoursesScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Manage courses</Text>
          <Text style={styles.subtitle}>Edit, view students, or remove courses</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={() => navigation.navigate('CreateCourse')}>
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>

      <View style={{ marginTop: spacing.lg }}>
        {courses.map((c) => (
          <Card key={c.id} style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.thumb, { backgroundColor: c.color }]}>
                <Ionicons name="book" size={20} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.courseTitle} numberOfLines={1}>{c.title}</Text>
                <Text style={styles.courseMeta}>{c.category} · {c.enrolledStudents} students</Text>
              </View>
            </View>
            <View style={styles.actions}>
              {actions.map((a, i) => (
                <Pressable key={a.label} style={[styles.action, i < actions.length - 1 && styles.actionBorder]} onPress={() => a.label === 'Edit' && navigation.navigate('UploadContent')}>
                  <Ionicons name={a.icon} size={18} color={a.tint} />
                  <Text style={[styles.actionText, { color: a.tint }]}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  courseTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  courseMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  actions: { flexDirection: 'row', marginTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm },
  actionBorder: { borderRightWidth: 1, borderRightColor: colors.border },
  actionText: { fontSize: 13, fontWeight: '600', marginLeft: 6 },
});
