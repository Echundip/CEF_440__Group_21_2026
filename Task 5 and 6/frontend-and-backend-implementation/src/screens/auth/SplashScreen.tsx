import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../../components';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Logo size={96} background={colors.white} iconColor={colors.navy} />
        <Text style={styles.appName}>Adaptive Learn</Text>
        <Text style={styles.tagline}>Quality learning on any network</Text>
      </View>
      <ActivityIndicator color={colors.white} style={styles.loader} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, justifyContent: 'center', alignItems: 'center' },
  center: { alignItems: 'center' },
  appName: { color: colors.white, fontSize: 30, fontWeight: '800', marginTop: spacing.xl },
  tagline: { color: colors.accentSoft, fontSize: 14, marginTop: spacing.sm },
  loader: { position: 'absolute', bottom: 64 },
});
