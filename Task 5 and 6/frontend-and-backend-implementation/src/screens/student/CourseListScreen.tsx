import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CourseCard, Screen } from '../../components';
import { courses } from '../../data/mock';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { RootStackParamList, StudentTabParamList } from '../../navigation/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Courses'>,
  NativeStackScreenProps<RootStackParamList>
>;

const categories = ['All', 'Computer Engineering', 'Telecommunications', 'Software Engineering'];

export function CourseListScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = courses.filter((c) => {
    const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase());
    const matchesCat = category === 'All' || c.category === category;
    return matchesQuery && matchesCat;
  });

  return (
    <Screen>
      <Text style={styles.title}>Courses</Text>
      <Text style={styles.subtitle}>Browse and continue your enrolled courses</Text>

      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.chips}>
        {categories.map((cat) => {
          const active = cat === category;
          return (
            <Text
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, active && styles.chipActive]}
            >
              {cat === 'Computer Engineering' ? 'Comp. Eng.' : cat === 'Software Engineering' ? 'Soft. Eng.' : cat === 'Telecommunications' ? 'Telecom' : cat}
            </Text>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.md }}>
        {filtered.map((c) => (
          <CourseCard key={c.id} course={c} onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })} />
        ))}
        {filtered.length === 0 ? <Text style={styles.empty}>No courses found.</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  search: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, marginTop: spacing.lg,
  },
  searchInput: { flex: 1, paddingVertical: spacing.md, marginLeft: spacing.sm, fontSize: 15, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  chip: {
    fontSize: 13, fontWeight: '600', color: colors.textMuted,
    backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.md, paddingVertical: 7,
    borderRadius: radius.pill, marginRight: spacing.sm, marginBottom: spacing.sm, overflow: 'hidden',
  },
  chipActive: { backgroundColor: colors.navy, color: colors.white },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
});
