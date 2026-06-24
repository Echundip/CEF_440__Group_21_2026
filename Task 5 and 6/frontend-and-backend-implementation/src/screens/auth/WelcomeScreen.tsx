import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Logo } from '../../components';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const features = [
  { icon: 'cloud-offline-outline', title: 'Learn offline', text: 'Download lectures, notes and slides for zero-data study.' },
  { icon: 'pulse-outline', title: 'Adaptive quality', text: 'Streams adjust to HD, SD, audio or text as your network changes.' },
  { icon: 'school-outline', title: 'For everyone', text: 'Built for students and instructors in low-bandwidth regions.' },
] as const;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Logo size={264} />
        {/* <Text style={styles.title}>Welcome to{'\n'}EduStream</Text> */}
        <Text style={styles.subtitle}>
          LEARN WITHOUT LIMITS
        </Text>
      </View>

      <View style={styles.features}>
        {features.map((f) => (
          <View key={f.title} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={20} color={colors.navy} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureBody}>{f.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <AppButton label="Login" icon="log-in-outline" onPress={() => navigation.navigate('Login')} />
        <AppButton
          label="Create an account"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl, justifyContent: 'space-between', paddingVertical: spacing.xl },
  header: { alignItems: 'flex-start', marginTop: spacing.xl },
  title: { fontSize: 30, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: spacing.md, lineHeight: 22 },
  features: { marginVertical: spacing.xl },
  feature: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
  featureIcon: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  featureBody: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 19 },
  actions: {},
});
