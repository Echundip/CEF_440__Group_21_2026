import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QoEMetrics } from '../data/types';
import { qualityColor, qualityLabel, qualitySoftColor } from '../data/qoe';
import { spacing, radius } from '../theme/typography';

interface NetworkStatusBannerProps {
  metrics: QoEMetrics;
}

export function NetworkStatusBanner({ metrics }: NetworkStatusBannerProps) {
  const tint = qualityColor(metrics.quality);
  const soft = qualitySoftColor(metrics.quality);
  const icon =
    metrics.quality === 'good' ? 'wifi' : metrics.quality === 'moderate' ? 'cellular' : 'cellular-outline';

  return (
    <View style={[styles.banner, { backgroundColor: soft }]}>
      <Ionicons name={icon} size={18} color={tint} />
      <Text style={[styles.text, { color: tint }]}>
        Network: {qualityLabel(metrics.quality)}
      </Text>
      <Text style={[styles.detail, { color: tint }]}>
        {metrics.bandwidthMbps} Mbps · {metrics.connectionType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  text: { fontSize: 13, fontWeight: '800', marginLeft: spacing.sm },
  detail: { fontSize: 12, fontWeight: '600', marginLeft: 'auto' },
});
