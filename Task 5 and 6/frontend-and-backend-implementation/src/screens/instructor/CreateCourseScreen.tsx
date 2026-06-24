import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, TextField } from '../../components';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateCourse'>;

const categories = ['Computer Engineering', 'Telecommunications', 'Software Engineering', 'Mathematics'];

export function CreateCourseScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Create course</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.cover}>
            <Ionicons name="image-outline" size={32} color={colors.navy} />
            <Text style={styles.coverText}>Add course cover</Text>
          </View>

          <TextField label="Course name" icon="book-outline" placeholder="e.g. Intro to Mobile Dev" value={name} onChangeText={setName} />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            placeholder="What will students learn?"
            placeholderTextColor={colors.textMuted}
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {categories.map((c) => {
              const active = c === category;
              return (
                <Text key={c} onPress={() => setCategory(c)} style={[styles.chip, active && styles.chipActive]}>
                  {c}
                </Text>
              );
            })}
          </View>

          <AppButton label="Create course" icon="add-circle-outline" onPress={() => navigation.goBack()} style={{ marginTop: spacing.xl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  topTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  body: { paddingHorizontal: spacing.lg },
  cover: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, marginBottom: spacing.lg },
  coverText: { fontSize: 13, color: colors.textMuted, marginTop: spacing.sm },
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  textarea: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, minHeight: 100, textAlignVertical: 'top', fontSize: 15, color: colors.text, marginBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { fontSize: 13, fontWeight: '600', color: colors.textMuted, backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, marginRight: spacing.sm, marginBottom: spacing.sm, overflow: 'hidden' },
  chipActive: { backgroundColor: colors.navy, color: colors.white },
});
