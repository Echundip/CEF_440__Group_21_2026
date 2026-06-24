import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/typography';

type LiveClass = {
  id: string;
  course: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  isLive: boolean;
};

const classes: LiveClass[] = [
  { id: '1', course: 'Mobile App Development', instructor: 'Dr. A. Mbarga', date: 'Today', time: '10:00 AM', duration: '90 min', isLive: true },
  { id: '2', course: 'Networks & QoE', instructor: 'Prof. N. Foncha', date: 'June 18', time: '2:00 PM', duration: '60 min', isLive: false },
  { id: '3', course: 'Database Systems', instructor: 'Dr. E. Tabe', date: 'June 20', time: '9:00 AM', duration: '75 min', isLive: false },
];

export function LiveClassesScreen() {
  const [joining, setJoining] = useState<string | null>(null);

  const handleJoin = (cls: LiveClass) => {
    setJoining(cls.id);
    setTimeout(() => {
      setJoining(null);
      Alert.alert('Joining class', `Connecting to ${cls.course}…`);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Live Classes</Text>
          <Text style={styles.subtitle}>Upcoming & active sessions</Text>
        </View>

        {/* Live now banner */}
        {classes.some((c) => c.isLive) && (
          <View style={styles.liveBanner}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBannerText}>1 class is live right now</Text>
          </View>
        )}

        {classes.map((cls) => (
          <View key={cls.id} style={[styles.card, cls.isLive && styles.cardLive]}>
            {cls.isLive && (
              <View style={styles.liveTag}>
                <View style={styles.liveDotSmall} />
                <Text style={styles.liveTagText}>LIVE</Text>
              </View>
            )}

            <View style={styles.cardTop}>
              <View style={[styles.iconCircle, { backgroundColor: cls.isLive ? colors.navy : colors.surfaceAlt }]}>
                <Ionicons name="videocam" size={20} color={cls.isLive ? colors.white : colors.navy} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.courseName}>{cls.course}</Text>
                <Text style={styles.instructorName}>{cls.instructor}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{cls.date}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{cls.time}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="hourglass-outline" size={14} color={colors.textMuted} />
                <Text style={styles.metaText}>{cls.duration}</Text>
              </View>
            </View>

            <Pressable
              style={[styles.joinBtn, !cls.isLive && styles.joinBtnScheduled]}
              onPress={() => handleJoin(cls)}
            >
              <Ionicons
                name={cls.isLive ? 'enter-outline' : 'notifications-outline'}
                size={16}
                color={cls.isLive ? colors.white : colors.navy}
              />
              <Text style={[styles.joinText, !cls.isLive && styles.joinTextScheduled]}>
                {joining === cls.id ? 'Connecting…' : cls.isLive ? 'Join Class' : 'Set Reminder'}
              </Text>
            </Pressable>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },

  header: { marginBottom: spacing.lg },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },

  liveBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.poorSoft, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg, gap: spacing.sm,
  },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.poor },
  liveBannerText: { fontSize: 14, fontWeight: '600', color: colors.poor },

  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md, ...shadow,
  },
  cardLive: { borderWidth: 1.5, borderColor: colors.navy },

  liveTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginBottom: spacing.md,
  },
  liveDotSmall: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.poor },
  liveTagText: { fontSize: 11, fontWeight: '800', color: colors.poor, letterSpacing: 1 },

  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconCircle: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  cardInfo: { flex: 1 },
  courseName: { fontSize: 16, fontWeight: '700', color: colors.text },
  instructorName: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  metaRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: colors.textMuted },

  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.navy, borderRadius: radius.md,
    paddingVertical: spacing.md, gap: spacing.sm,
  },
  joinBtnScheduled: { backgroundColor: colors.surfaceAlt },
  joinText: { fontSize: 14, fontWeight: '700', color: colors.white },
  joinTextScheduled: { color: colors.navy },
});
