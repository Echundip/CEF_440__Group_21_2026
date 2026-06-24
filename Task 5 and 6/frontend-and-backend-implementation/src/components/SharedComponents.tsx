import React, { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors, spacing, radius } from "../theme/theme";


// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
  sub?: string;
  subType?: "up" | "dn";
}

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface CardTitleProps {
  title: string;
}

interface ProgressRowProps {
  label: string;
  right: string;
  pct: number;
  fillColor: string;
}

type StatusType = "Active" | "Pending" | "Suspended";

interface StatusBadgeProps {
  status: StatusType;
}

interface SectionLabelProps {
  text: string;
}

interface MetricItem {
  label: string;
  value: string | number;
  valueColor?: string;
  sub?: string;
  subType?: "up" | "dn";
}

interface MetricGridProps {
  items: MetricItem[];
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

export function MetricCard({
  label,
  value,
  valueColor,
  sub,
  subType,
}: MetricCardProps) {
  const subColor =
    subType === "up"
      ? colors.green
      : subType === "dn"
      ? colors.red
      : colors.text3;

  return (
    <View style={styles.mc}>
      <Text style={styles.mlbl}>{label}</Text>
      <Text
        style={[
          styles.mval,
          { color: valueColor ?? colors.text },
        ]}
      >
        {value}
      </Text>
      {sub ? (
        <Text style={[styles.msub, { color: subColor }]}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Card Title ───────────────────────────────────────────────────────────────

export function CardTitle({ title }: CardTitleProps) {
  return <Text style={styles.cardTitle}>{title}</Text>;
}

// ─── Progress Row ─────────────────────────────────────────────────────────────

export function ProgressRow({
  label,
  right,
  pct,
  fillColor,
}: ProgressRowProps) {
  return (
    <View style={styles.pbWrap}>
      <View style={styles.pbLblRow}>
        <Text style={styles.pbLbl}>{label}</Text>
        <Text style={styles.pbLbl}>{right}</Text>
      </View>

      <View style={styles.pbTrack}>
        <View
          style={[
            styles.pbFill,
            {
              width: `${pct}%`,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    Active: {
      bg: colors.greenLight,
      text: "#15803d",
    },
    Pending: {
      bg: colors.amberLight,
      text: "#b45309",
    },
    Suspended: {
      bg: colors.redLight,
      text: "#b91c1c",
    },
  };

  const s = map[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: s.bg },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: s.text },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

export function SectionLabel({
  text,
}: SectionLabelProps) {
  return <Text style={styles.secLbl}>{text}</Text>;
}

// ─── Metric Grid ──────────────────────────────────────────────────────────────

export function MetricGrid({
  items,
}: MetricGridProps) {
  return (
    <View style={styles.mgrid}>
      {items.map((item, index) => (
        <MetricCard
          key={index}
          {...item}
        />
      ))}
    </View>
  );
}

// Your existing StyleSheet remains unchanged.
const styles = StyleSheet.create({
mc: { 
  flex: 1, backgroundColor: colors.bgCard, borderRadius: radius.md, padding: 10, borderWidth: 1, borderColor: colors.border, margin: 3, 
}, 
  mlbl: { 
    fontSize: 9, color: colors.text3, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2, 
  }, mval: { fontSize: 20, fontWeight: '600', lineHeight: 24, }, msub: { fontSize: 9, color: colors.text3, marginTop: 2, }, card: { backgroundColor: colors.bgCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 11, marginBottom: 8, }, cardTitle: { fontSize: 11, color: colors.text2, fontWeight: '500', marginBottom: 8, }, pbWrap: { marginBottom: 6, }, pbLblRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, }, pbLbl: { fontSize: 10, color: colors.text2, }, pbTrack: { height: 4, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', }, pbFill: { height: '100%', borderRadius: 3, }, badge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.full, alignSelf: 'flex-start', }, badgeText: { fontSize: 9, fontWeight: '500', }, secLbl: { fontSize: 9, fontWeight: '600', letterSpacing: 1.2, color: colors.text3, textTransform: 'uppercase', marginBottom: 8, }, mgrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3, marginBottom: 8, },
});