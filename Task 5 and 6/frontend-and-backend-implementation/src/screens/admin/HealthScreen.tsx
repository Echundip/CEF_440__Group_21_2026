import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  CardTitle,
  ProgressRow,
  SectionLabel,
  MetricGrid,
} from '../../components/SharedComponents'
import { colors, radius } from '../../theme/theme';

type ServerStatus = 'on' | 'warn' | 'off';
type AlertType = 'danger' | 'warn' | 'info';

const SERVERS: {
  icon: string;
  name: string;
  meta: string;
  status: ServerStatus;
}[] = [
  {
    icon: '🗄',
    name: 'Primary DB · PostgreSQL',
    meta: 'RAM 4.2/8GB · 94 conn',
    status: 'on',
  },
  {
    icon: '☁',
    name: 'Media CDN · Cloudflare',
    meta: 'Cache hit 98% · 12ms',
    status: 'on',
  },
  {
    icon: '🛡',
    name: 'Auth Service · OAuth2',
    meta: '2,341 tokens active',
    status: 'on',
  },
  {
    icon: '⚙',
    name: 'ML Engine · Adaptive AI',
    meta: 'CPU 89% · High load',
    status: 'warn',
  },
  {
    icon: '✉',
    name: 'SMTP Relay · Postfix',
    meta: 'Queue backlog: 412',
    status: 'off',
  },
];

const ALERTS: {
  type: AlertType;
  msg: string;
  time: string;
}[] = [
  {
    type: 'danger',
    msg: 'SMTP relay offline. Email notifications paused.',
    time: '2 min ago · Critical',
  },
  {
    type: 'warn',
    msg: 'ML Engine CPU at 89%. Consider scaling up.',
    time: '14 min ago · Warning',
  },
  {
    type: 'info',
    msg: 'Storage at 78% — full in ~18 days projected.',
    time: '1 hr ago · Info',
  },
];

const statusDotColor: Record<ServerStatus, string> = { on: colors.green, warn: colors.amber, off: colors.red };
const alertBg: Record<AlertType, string> = { danger: colors.redLight, warn: colors.amberLight, info: colors.cyanLight };
const alertText: Record<AlertType, string> = { danger: colors.red, warn: colors.amber, info: colors.cyan };

export default function HealthScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SectionLabel text="Infrastructure" />

      <MetricGrid
        items={[
          { label: 'Uptime', value: '99.8%', valueColor: colors.green, sub: '30-day avg', subType: 'up' },
          { label: 'Response', value: '142ms', valueColor: colors.cyan, sub: '↓ 18ms', subType: 'up' },
          { label: 'CPU Load', value: '67%', valueColor: colors.amber, sub: 'Moderate' },
          { label: 'Sessions', value: '1,204', valueColor: colors.purple, sub: 'Peak hours', subType: 'up' },
        ]}
      />

      <Card>
        <CardTitle title="Server Status" />
        {SERVERS.map((s, i) => (
          <View
            key={i}
            style={[styles.srow, i === SERVERS.length - 1 && styles.srowLast]}
          >
            <View
              style={[
                styles.sicon,
                s.status === 'warn' && { backgroundColor: colors.amberLight },
                s.status === 'off' && { backgroundColor: colors.redLight },
              ]}
            >
              <Text style={styles.siconText}>{s.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sname}>{s.name}</Text>
              <Text style={styles.smeta}>{s.meta}</Text>
            </View>
            <View
              style={[styles.dp, { backgroundColor: statusDotColor[s.status] }]}
            />
          </View>
        ))}
      </Card>

      <Card>
        <CardTitle title="Resource Usage" />
        <ProgressRow label="CPU" right="67%" pct={67} fillColor={colors.amber} />
        <ProgressRow label="RAM" right="54%" pct={54} fillColor={colors.cyan} />
        <ProgressRow label="Storage" right="78%" pct={78} fillColor={colors.accent} />
        <ProgressRow label="Network I/O" right="33%" pct={33} fillColor={colors.green} />
      </Card>

      <Card>
        <CardTitle title="Active Alerts" />
        {ALERTS.map((a, i) => (
          <View
            key={i}
            style={[styles.arow, i === ALERTS.length - 1 && styles.arowLast]}
          >
            <View style={[styles.aicon, { backgroundColor: alertBg[a.type] }]}>
              <Text style={{ color: alertText[a.type], fontSize: 12 }}>
                {a.type === 'danger' ? '⚠' : a.type === 'warn' ? '⚡' : 'ℹ'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.amsg}>{a.msg}</Text>
              <Text style={styles.atime}>{a.time}</Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 11, backgroundColor: colors.bg },
  srow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  srowLast: { borderBottomWidth: 0 },
  sicon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siconText: { fontSize: 14 },
  sname: { fontSize: 12, fontWeight: '500', color: colors.text },
  smeta: { fontSize: 9, color: colors.text3, fontFamily: 'monospace' },
  dp: { width: 7, height: 7, borderRadius: 4 },
  arow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  arowLast: { borderBottomWidth: 0 },
  aicon: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amsg: { fontSize: 11, color: colors.text, lineHeight: 16, flex: 1 },
  atime: { fontSize: 9, color: colors.text3, marginTop: 2 },
});
