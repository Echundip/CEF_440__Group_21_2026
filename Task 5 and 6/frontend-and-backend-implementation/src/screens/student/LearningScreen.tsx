import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, QoEStatusCard } from '../../components';
import { useQoE } from '../../context/QoEContext';
import { courses } from '../../data/mock';
import { recommendedMode } from '../../data/qoe';
import { DeliveryMode, NetworkQuality } from '../../data/types';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Learning'>;

const modeOptions: { mode: DeliveryMode; icon: keyof typeof Ionicons.glyphMap }[] = [
  { mode: 'video-hd', icon: 'videocam' },
  { mode: 'video-sd', icon: 'videocam-outline' },
  { mode: 'audio', icon: 'headset' },
  { mode: 'text', icon: 'document-text' },
];

const networkOptions: { quality: NetworkQuality; label: string }[] = [
  { quality: 'good', label: 'Good' },
  { quality: 'moderate', label: 'Moderate' },
  { quality: 'poor', label: 'Poor' },
];

export function LearningScreen({ route, navigation }: Props) {
  const course = courses.find((c) => c.id === route.params.courseId) ?? courses[0];
  const { metrics, setQuality } = useQoE();
  const [auto, setAuto] = useState(true);
  const [manualMode, setManualMode] = useState<DeliveryMode>('video-sd');

  const recommended = recommendedMode(metrics.quality);
  const currentMode = auto ? recommended : manualMode;

  const selectMode = (mode: DeliveryMode) => {
    setAuto(false);
    setManualMode(mode);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={styles.topTitle} numberOfLines={1}>{course.title}</Text>
          <Pressable onPress={() => navigation.navigate('QoEMonitoring')} hitSlop={10}>
            <Ionicons name="pulse" size={22} color={colors.white} />
          </Pressable>
        </View>

        <Player mode={currentMode} />

        <View style={styles.body}>
          <View style={styles.lessonHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonLabel}>Module 1 · Lesson 3</Text>
              <Text style={styles.lessonTitle}>Your first screen</Text>
            </View>
            <View style={[styles.autoPill, auto ? styles.autoOn : styles.autoOff]}>
              <Ionicons name="flash" size={13} color={auto ? colors.white : colors.textMuted} />
              <Text style={[styles.autoText, { color: auto ? colors.white : colors.textMuted }]}>Auto</Text>
            </View>
          </View>

          <Text style={styles.controlLabel}>Delivery mode</Text>
          <View style={styles.modeRow}>
            <Pressable
              onPress={() => setAuto(true)}
              style={[styles.modeChip, auto && styles.modeChipActive]}
            >
              <Ionicons name="sparkles" size={16} color={auto ? colors.white : colors.navy} />
              <Text style={[styles.modeChipText, auto && styles.modeChipTextActive]}>Auto</Text>
            </Pressable>
            {modeOptions.map((opt) => {
              const active = !auto && manualMode === opt.mode;
              return (
                <Pressable
                  key={opt.mode}
                  onPress={() => selectMode(opt.mode)}
                  style={[styles.modeChip, active && styles.modeChipActive]}
                >
                  <Ionicons name={opt.icon} size={16} color={active ? colors.white : colors.navy} />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.qoeWrap}>
            <QoEStatusCard metrics={metrics} currentMode={currentMode} recommendedMode={recommended} />
          </View>

          <Text style={styles.controlLabel}>Simulate network (demo)</Text>
          <View style={styles.networkRow}>
            {networkOptions.map((n) => {
              const active = metrics.quality === n.quality;
              return (
                <Pressable
                  key={n.quality}
                  onPress={() => setQuality(n.quality)}
                  style={[styles.networkChip, active && styles.networkChipActive]}
                >
                  <Text style={[styles.networkText, active && styles.networkTextActive]}>{n.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.notesTitle}>Course notes</Text>
          <Text style={styles.notes}>
            A screen is the basic building block of a mobile app. In this lesson we create our first
            screen, lay out a heading and body text, and preview it live. As your network changes, this
            lecture automatically switches between HD video, SD video, audio-only, and text notes to keep
            you learning without wasting data.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Player({ mode }: { mode: DeliveryMode }) {
  if (mode === 'audio') {
    return (
      <View style={[styles.player, styles.playerAudio]}>
        <View style={styles.audioIcon}>
          <Ionicons name="headset" size={34} color={colors.white} />
        </View>
        <Text style={styles.playerHeading}>Audio Mode Active</Text>
        <Text style={styles.playerSub}>Video disabled · Reason: poor connectivity</Text>
        <View style={styles.waveform}>
          {[14, 26, 18, 32, 22, 38, 20, 30, 16, 28, 24, 34].map((h, i) => (
            <View key={i} style={[styles.wavebar, { height: h }]} />
          ))}
        </View>
        <View style={styles.audioControls}>
          <Ionicons name="play-skip-back" size={22} color={colors.white} />
          <View style={styles.playBtn}>
            <Ionicons name="pause" size={24} color={colors.navy} />
          </View>
          <Ionicons name="play-skip-forward" size={22} color={colors.white} />
        </View>
      </View>
    );
  }

  if (mode === 'text') {
    return (
      <View style={[styles.player, styles.playerText]}>
        <Ionicons name="document-text" size={34} color={colors.navy} />
        <Text style={[styles.playerHeading, { color: colors.navy }]}>Text / Notes Mode</Text>
        <Text style={[styles.playerSub, { color: colors.textMuted }]}>
          Network extremely poor · showing data-free notes
        </Text>
        <View style={styles.textActions}>
          <AppButton label="Download PDF" icon="download-outline" variant="outline" fullWidth={false} style={styles.textBtn} />
          <AppButton label="View slides" icon="albums-outline" variant="outline" fullWidth={false} style={styles.textBtn} />
        </View>
      </View>
    );
  }

  // video-hd or video-sd
  const isHd = mode === 'video-hd';
  return (
    <View style={[styles.player, styles.playerVideo]}>
      <View style={styles.qualityBadge}>
        <Text style={styles.qualityBadgeText}>{isHd ? 'HD 720p' : 'SD 360p'}</Text>
      </View>
      <View style={styles.playBtnLarge}>
        <Ionicons name="play" size={30} color={colors.navy} />
      </View>
      <View style={styles.scrubber}>
        <View style={styles.scrubFill} />
        <View style={styles.scrubKnob} />
      </View>
      <View style={styles.videoTimeRow}>
        <Text style={styles.videoTime}>04:12</Text>
        <Text style={styles.videoTime}>17:00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
  },
  topTitle: { flex: 1, color: colors.white, fontSize: 15, fontWeight: '700', marginHorizontal: spacing.md, textAlign: 'center' },

  player: { minHeight: 210, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  playerVideo: { backgroundColor: colors.navyDark },
  playerAudio: { backgroundColor: colors.navyLight },
  playerText: { backgroundColor: colors.surfaceAlt },
  playerHeading: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: spacing.md },
  playerSub: { color: colors.accentSoft, fontSize: 12, marginTop: 4 },

  qualityBadge: { position: 'absolute', top: spacing.md, right: spacing.md, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.sm },
  qualityBadgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  playBtnLarge: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  scrubber: { height: 4, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 2, width: '100%', marginTop: spacing.xl },
  scrubFill: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%', backgroundColor: colors.accentSoft, borderRadius: 2 },
  scrubKnob: { position: 'absolute', left: '35%', top: -4, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.white },
  videoTimeRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: spacing.sm },
  videoTime: { color: colors.accentSoft, fontSize: 11 },

  audioIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  waveform: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, height: 40 },
  wavebar: { width: 4, marginHorizontal: 2, borderRadius: 2, backgroundColor: colors.accentSoft },
  audioControls: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, width: 180, justifyContent: 'space-between' },
  playBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },

  textActions: { flexDirection: 'row', marginTop: spacing.lg },
  textBtn: { marginHorizontal: spacing.xs },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  lessonHeader: { flexDirection: 'row', alignItems: 'center' },
  lessonLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  lessonTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 2 },
  autoPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill },
  autoOn: { backgroundColor: colors.good },
  autoOff: { backgroundColor: colors.surfaceAlt },
  autoText: { fontSize: 12, fontWeight: '700', marginLeft: 4 },

  controlLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  modeRow: { flexDirection: 'row', alignItems: 'center' },
  modeChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    marginRight: spacing.sm, minWidth: 46,
  },
  modeChipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  modeChipText: { fontSize: 13, fontWeight: '700', color: colors.navy, marginLeft: 6 },
  modeChipTextActive: { color: colors.white },

  qoeWrap: { marginTop: spacing.lg },

  networkRow: { flexDirection: 'row' },
  networkChip: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, marginRight: spacing.sm,
  },
  networkChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  networkText: { fontSize: 13, fontWeight: '700', color: colors.navy },
  networkTextActive: { color: colors.white },

  notesTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  notes: { fontSize: 14, color: colors.textMuted, lineHeight: 22 },
});
