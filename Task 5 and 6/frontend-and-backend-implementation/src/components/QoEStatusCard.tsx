import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DeliveryMode, QoEMetrics } from '../data/types';
import { modeLabel, qualityColor, qualityLabel, qualitySoftColor } from '../data/qoe';
import { colors } from '../theme/colors';
import { radius, shadow, spacing } from '../theme/typography';

interface QoEStatusCardProps {
  metrics: QoEMetrics;
  currentMode: DeliveryMode;
  recommendedMode: DeliveryMode;
}

export function QoEStatusCard({ metrics, currentMode, recommendedMode }: QoEStatusCardProps) {
  const tint = qualityColor(metrics.quality);
  const soft = qualitySoftColor(metrics.quality);
  const adapting = currentMode !== recommendedMode;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="pulse" size={18} color={colors.white} />
          <Text style={styles.title}>QoE Status</Text>
        </View>
        <View style={[styles.qualityPill, { backgroundColor: soft }]}>
          <View style={[styles.dot, { backgroundColor: tint }]} />
          <Text style={[styles.qualityText, { color: tint }]}>
            {qualityLabel(metrics.quality)}
          </Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <Metric icon="speedometer-outline" value={`${metrics.bandwidthMbps}`} unit="Mbps" label="Bandwidth" />
        <View style={styles.divider} />
        <Metric icon="time-outline" value={`${metrics.latencyMs}`} unit="ms" label="Latency" />
        <View style={styles.divider} />
        <Metric icon="alert-circle-outline" value={`${metrics.packetLossPct}`} unit="%" label="Loss" />
      </View>

      <View style={styles.modeRow}>
        <View style={styles.modeBox}>
          <Text style={styles.modeLabel}>Current Mode</Text>
          <Text style={styles.modeValue}>{modeLabel(currentMode)}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={colors.accentSoft} />
        <View style={styles.modeBox}>
          <Text style={styles.modeLabel}>Recommended</Text>
          <Text style={[styles.modeValue, { color: colors.accentSoft }]}>
            {modeLabel(recommendedMode)}
          </Text>
        </View>
      </View>

      {adapting ? (
        <View style={styles.adaptNote}>
          <Ionicons name="sync" size={13} color={colors.white} />
          <Text style={styles.adaptText}>Adapting delivery to protect your data & playback</Text>
        </View>
      ) : (
        <View style={styles.adaptNote}>
          <Ionicons name="checkmark-circle" size={13} color={colors.accentSoft} />
          <Text style={styles.adaptText}>Delivery optimized for current network</Text>
        </View>
      )}
    </View>
  );
}

function Metric({
  icon,
  value,
  unit,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <View style={styles.metric}>
      <Ionicons name={icon} size={16} color={colors.accentSoft} />
      <Text style={styles.metricValue}>
        {value}
        <Text style={styles.metricUnit}> {unit}</Text>
      </Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { color: colors.white, fontSize: 16, fontWeight: '700', marginLeft: spacing.sm },
  qualityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  qualityText: { fontSize: 12, fontWeight: '800' },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navyDark,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { color: colors.white, fontSize: 17, fontWeight: '800', marginTop: 4 },
  metricUnit: { fontSize: 11, fontWeight: '600', color: colors.accentSoft },
  metricLabel: { color: colors.accentSoft, fontSize: 11, marginTop: 2 },
  divider: { width: 1, height: 34, backgroundColor: colors.navyLight },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  modeBox: { flex: 1 },
  modeLabel: { color: colors.accentSoft, fontSize: 11, fontWeight: '600' },
  modeValue: { color: colors.white, fontSize: 16, fontWeight: '800', marginTop: 2 },
  adaptNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.navyLight,
  },
  adaptText: { color: colors.white, fontSize: 12, marginLeft: 6, flex: 1 },
});
