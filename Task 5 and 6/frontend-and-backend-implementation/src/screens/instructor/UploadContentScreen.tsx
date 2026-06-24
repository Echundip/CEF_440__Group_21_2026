import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Card, TextField } from '../../components';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UploadContent'>;

type ContentType = 'Video' | 'Audio' | 'Notes' | 'Quiz';

const contentTypes: { type: ContentType; icon: keyof typeof Ionicons.glyphMap; hint: string }[] = [
  { type: 'Video', icon: 'videocam', hint: 'MP4 · auto-transcoded to HD/SD' },
  { type: 'Audio', icon: 'headset', hint: 'MP3 · low-data fallback' },
  { type: 'Notes', icon: 'document-text', hint: 'PDF / slides · offline ready' },
  { type: 'Quiz', icon: 'help-circle', hint: 'Multiple choice assessment' },
];

export function UploadContentScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<ContentType>('Video');
  const [title, setTitle] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>Upload content</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>Content type</Text>
          <View style={styles.typeGrid}>
            {contentTypes.map((c) => {
              const active = selected === c.type;
              return (
                <Pressable key={c.type} onPress={() => setSelected(c.type)} style={[styles.typeCard, active && styles.typeCardActive]}>
                  <Ionicons name={c.icon} size={24} color={active ? colors.white : colors.navy} />
                  <Text style={[styles.typeTitle, active && { color: colors.white }]}>{c.type}</Text>
                  <Text style={[styles.typeHint, active && { color: colors.accentSoft }]}>{c.hint}</Text>
                </Pressable>
              );
            })}
          </View>

          <TextField label="Title" icon="text-outline" placeholder={`${selected} title`} value={title} onChangeText={setTitle} />

          <Text style={styles.label}>Course</Text>
          <Card style={styles.selectRow}>
            <Ionicons name="albums-outline" size={18} color={colors.navy} />
            <Text style={styles.selectText}>Introduction to Mobile App Development</Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </Card>

          <Text style={styles.label}>File</Text>
          <Pressable style={styles.dropzone}>
            <Ionicons name="cloud-upload-outline" size={36} color={colors.navy} />
            <Text style={styles.dropTitle}>Tap to select a file</Text>
            <Text style={styles.dropHint}>or drag and drop here</Text>
          </Pressable>

          <View style={styles.adaptiveNote}>
            <Ionicons name="information-circle-outline" size={16} color={colors.navy} />
            <Text style={styles.adaptiveText}>
              Videos are automatically encoded into HD, SD and audio-only tracks so students on weak
              networks still receive your lesson.
            </Text>
          </View>

          <AppButton label="Upload content" icon="cloud-upload-outline" onPress={() => navigation.goBack()} style={{ marginTop: spacing.lg }} />
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
  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  typeCard: { width: '48%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  typeCardActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  typeTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  typeHint: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  selectRow: { flexDirection: 'row', alignItems: 'center' },
  selectText: { flex: 1, fontSize: 14, color: colors.text, marginHorizontal: spacing.md },
  dropzone: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface },
  dropTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  dropHint: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  adaptiveNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  adaptiveText: { flex: 1, fontSize: 12, color: colors.text, marginLeft: spacing.sm, lineHeight: 18 },
});
