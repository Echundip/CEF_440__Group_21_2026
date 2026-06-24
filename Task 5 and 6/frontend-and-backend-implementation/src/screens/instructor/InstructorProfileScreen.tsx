import { Ionicons } from '@expo/vector-icons';
//import { CommonActions } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
//import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, Screen, StatTile } from '../../components';
import { courses } from '../../data/mock';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/typography';
import { InstructorTabParamList, RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../../task 6/backend-implementation/UseAuth';
import { Alert } from 'react-native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<InstructorTabParamList, 'InstructorProfile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export function InstructorProfileScreen({ navigation }: Props) {
  const totalStudents = courses.reduce((n, c) => n + c.enrolledStudents, 0);

  const { signOut } = useAuth();

    const logout = () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out of your account?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Log Out",
            style: "destructive",
            onPress: async () => {
              try {
                await signOut();
                // RootNavigator will automatically redirect to the auth flow.
              } catch (error) {
                console.error("Logout failed:", error);
                Alert.alert("Error", "Unable to log out. Please try again.");
              }
            },
          },
        ]
      );
    };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AM</Text>
        </View>
        <Text style={styles.name}>Dr. A. Mbarga</Text>
        <Text style={styles.email}>a.mbarga@ubuea.cm</Text>
        <View style={styles.roleBadge}>
          <Ionicons name="easel-outline" size={13} color={colors.navy} />
          <Text style={styles.roleText}>Instructor</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <StatTile icon="albums-outline" value={`${courses.length}`} label="Courses" />
        <View style={{ width: spacing.md }} />
        <StatTile icon="people-outline" value={`${totalStudents}`} label="Students" tint={colors.good} tintSoft={colors.goodSoft} />
        <View style={{ width: spacing.md }} />
        <StatTile icon="star-outline" value="4.7" label="Rating" tint={colors.moderate} tintSoft={colors.moderateSoft} />
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <Card>
        <Row icon="person-outline" label="Personal information" />
        <Row icon="card-outline" label="Payout settings" border />
        <Row icon="language-outline" label="Language · English" border />
        <Row icon="help-circle-outline" label="Help & support" border />
      </Card>

      <AppButton label="Log out" icon="log-out-outline" variant="outline" onPress={logout} style={{ marginTop: spacing.xl }} />
    </Screen>
  );
}

function Row({ icon, label, border }: { icon: keyof typeof Ionicons.glyphMap; label: string; border?: boolean }) {
  return (
    <View style={[styles.row, border && styles.border]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.navy} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: spacing.md },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.navyLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  email: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceAlt, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, marginTop: spacing.md },
  roleText: { fontSize: 12, fontWeight: '700', color: colors.navy, marginLeft: 5 },
  stats: { flexDirection: 'row', marginTop: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  border: { borderTopWidth: 1, borderTopColor: colors.border },
  rowIcon: { width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
});
