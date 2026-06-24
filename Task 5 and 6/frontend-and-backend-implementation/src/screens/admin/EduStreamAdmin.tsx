import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
} from 'react-native';
import { colors, radius } from '../../theme/theme';
import UsersScreen from './UsersScreen';
import HealthScreen from './HealthScreen';
import AnalyticsScreen from './AnalyticsScreen';
import CoursesScreen from './CoursesScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
//import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from '../../navigation/types';
import { CompositeScreenProps } from '@react-navigation/native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<AdminTabParamList, 'AdminHome'>,
  NativeStackScreenProps<RootStackParamList>
>;


// type Props = NativeStackScreenProps<RootStackParamList, 'AdminTabs'>;


const TABS = [
  { key: 'users',     label: 'Users',     icon: '👥', title: 'User Governance' },
  { key: 'health',    label: 'Health',    icon: '💓', title: 'System Health' },
  { key: 'analytics', label: 'Analytics', icon: '📊', title: 'Analytics' },
  { key: 'courses',   label: 'Courses',   icon: '📚', title: 'Courses' },
];

export default function EduStreamAdmin({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('users');

  const currentTab = TABS.find((t) => t.key === activeTab);

  const renderScreen = () => {
    switch (activeTab) {
      case 'users':     return <UsersScreen />;
      case 'health':    return <HealthScreen />;
      case 'analytics': return <AnalyticsScreen />;
      case 'courses':   return <CoursesScreen />;
      default:          return <UsersScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgNav} />

      {/* ── Top bar ── */}
      <View style={styles.topbar}>
        <View style={styles.appIcon}>
          {/* Simplified logo mark */}
          <Text style={styles.appIconText}>≋</Text>
        </View>
        <View style={styles.topbarMid}>
          <Text style={styles.brand}>EduStream</Text>
          <Text style={styles.pageTitle}>{currentTab?.title}</Text>
        </View>
        <View style={styles.topbarRight}>
          <View style={styles.notifBtn}>
            <Text style={{ fontSize: 13 }}>🔔</Text>
            <View style={styles.nbadge} />
          </View>
          
            <Pressable onPress={() => navigation.navigate('AdminProfile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AD</Text>
            </View>
          </Pressable>
          
        </View>
      </View>

      {/* ── Screen content ── */}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* ── Bottom navigation ── */}
      {/* <View style={styles.bottomNav}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.ni}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.niIcon, active && styles.niIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.niLabel, active && styles.niLabelActive]}>
                {tab.label}
              </Text>
              {active && <View style={styles.ndot} />}
            </TouchableOpacity>
          );
        })}
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // Top bar
  topbar: {
    backgroundColor: colors.bgNav,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: { color: '#fff', fontSize: 18, lineHeight: 22 },
  topbarMid: { flex: 1 },
  brand: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.cyan,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  pageTitle: { fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 18 },
  topbarRight: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  notifBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nbadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
    borderWidth: 1.5,
    borderColor: colors.bgNav,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 10, fontWeight: '600', color: '#fff' },
  // Bottom nav
  bottomNav: {
    backgroundColor: colors.bgNav,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 10,
  },
  ni: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 3,
  },
  niIcon: { fontSize: 20, opacity: 0.4 },
  niIconActive: { opacity: 1 },
  niLabel: { fontSize: 9, color: colors.text3, fontWeight: '500' },
  niLabelActive: { color: colors.accent, fontWeight: '600' },
  ndot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: -1,
  },
});
