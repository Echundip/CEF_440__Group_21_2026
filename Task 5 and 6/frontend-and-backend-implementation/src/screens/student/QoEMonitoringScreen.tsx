import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Card, StatTile } from '../../components';
import { useQoE } from '../../context/QoEContext';
import { modeLabel, qualityColor, recommendedMode } from '../../data/qoe';
import { NetworkQuality } from '../../data/types';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QoEMonitoring'>;

const networkOptions: { quality: NetworkQuality; label: string }[] = [
  { quality: 'good', label: 'Good' },
  { quality: 'moderate', label: 'Moderate' },
  { quality: 'poor', label: 'Poor' },
];

const bufferingSeries = [2, 1, 4, 3, 6, 2, 1];
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function QoEMonitoringScreen({ navigation }: Props) {
  const { metrics, setQuality } = useQoE();
  const tint = qualityColor(metrics.quality);
  const recommended = recommendedMode(metrics.quality);
  const maxBuffer = Math.max(...bufferingSeries);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.topTitle}>QoE Monitoring</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.body}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: tint }]} />
            <Text style={styles.statusText}>Live connection · {metrics.connectionType}</Text>
          </View>

          <View style={styles.metricsGrid}>
            <StatTile icon="speedometer-outline" value={`${metrics.bandwidthMbps}`} label="Bandwidth (Mbps)" tint={colors.navy} />
            <View style={{ width: spacing.md }} />
            <StatTile icon="time-outline" value={`${metrics.latencyMs}`} label="Latency (ms)" tint={colors.accent} tintSoft={colors.surfaceAlt} />
          </View>
          <View style={[styles.metricsGrid, { marginTop: spacing.md }]}>
            <StatTile icon="alert-circle-outline" value={`${metrics.packetLossPct}%`} label="Packet loss" tint={tint} />
            <View style={{ width: spacing.md }} />
            <StatTile icon="git-network-outline" value={metrics.connectionType.split(' ')[0]} label="Connection" tint={colors.moderate} tintSoft={colors.moderateSoft} />
          </View>

          <Text style={styles.sectionTitle}>Adaptive streaming status</Text>
          <Card>
            <View style={styles.adaptiveRow}>
              <View style={styles.adaptiveBox}>
                <Text style={styles.adaptiveLabel}>Current mode</Text>
                <Text style={styles.adaptiveValue}>{modeLabel(recommended)}</Text>
              </View>
              <Ionicons name="swap-horizontal" size={20} color={colors.accent} />
              <View style={styles.adaptiveBox}>
                <Text style={styles.adaptiveLabel}>Recommended</Text>
                <Text style={[styles.adaptiveValue, { color: colors.accent }]}>{modeLabel(recommended)}</Text>
              </View>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Buffering events (last 7 days)</Text>
          <Card>
            <View style={styles.chart}>
              {bufferingSeries.map((v, i) => (
                <View key={i} style={styles.barCol}>
                  <View style={[styles.bar, { height: 12 + (v / maxBuffer) * 96, backgroundColor: colors.navy }]} />
                  <Text style={styles.barLabel}>{days[i]}</Text>
                </View>
              ))}
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Simulate network</Text>
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
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  statusText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  metricsGrid: { flexDirection: 'row' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  adaptiveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  adaptiveBox: { flex: 1 },
  adaptiveLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  adaptiveValue: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 130 },
  barCol: { alignItems: 'center', flex: 1 },
  bar: { width: 18, borderRadius: 6 },
  barLabel: { fontSize: 11, color: colors.textMuted, marginTop: spacing.sm },
  networkRow: { flexDirection: 'row' },
  networkChip: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, marginRight: spacing.sm },
  networkChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  networkText: { fontSize: 13, fontWeight: '700', color: colors.navy },
  networkTextActive: { color: colors.white },
});
