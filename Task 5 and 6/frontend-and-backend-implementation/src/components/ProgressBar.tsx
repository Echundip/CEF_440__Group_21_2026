import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius } from '../theme/typography';

interface ProgressBarProps {
  progress: number; // 0..1
  color?: string;
  track?: string;
  height?: number;
}

export function ProgressBar({ progress, color = colors.navy, track = colors.surfaceAlt, height = 8 }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { backgroundColor: track, height, borderRadius: height }]}>
      <View
        style={[styles.fill, { backgroundColor: color, width: `${pct * 100}%`, borderRadius: height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden', borderRadius: radius.pill },
  fill: { height: '100%' },
});
