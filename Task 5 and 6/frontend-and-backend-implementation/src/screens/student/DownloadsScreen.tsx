import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Screen } from '../../components';
import { downloads } from '../../data/mock';
import { DownloadItem } from '../../data/types';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';

const iconForType: Record<DownloadItem['type'], keyof typeof Ionicons.glyphMap> = {
  PDF: 'document-text',
  Notes: 'reader',
  Lecture: 'videocam',
  Audio: 'headset',
};

export function DownloadsScreen() {
  const totalMb = downloads.reduce((n, d) => n + d.sizeMb, 0);

  return (
    <Screen>
      <Text style={styles.title}>Downloads</Text>
      <Text style={styles.subtitle}>Study offline — no data required</Text>

      <Card style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{downloads.length}</Text>
          <Text style={styles.summaryLabel}>Items</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalMb.toFixed(1)} MB</Text>
          <Text style={styles.summaryLabel}>Used</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>Offline</Text>
          <Text style={styles.summaryLabel}>Available</Text>
        </View>
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        {downloads.map((d) => (
          <Card key={d.id} style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={iconForType[d.type]} size={20} color={colors.navy} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle} numberOfLines={1}>{d.title}</Text>
              <Text style={styles.itemMeta}>{d.course} · {d.type} · {d.sizeMb} MB</Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2, marginBottom: spacing.lg },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  summaryLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconWrap: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  itemTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  itemMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
