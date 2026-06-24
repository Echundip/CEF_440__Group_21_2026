import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, Logo, TextField } from '../../components';
import { RoleToggle } from './RoleToggle';
//import { Role } from '../../data/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../../task 6/backend-implementation/UseAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [role, setRole] = useState<'student' | 'instructor' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const onLogin = () => {
  //   if (role === 'student')    navigation.reset({ index: 0, routes: [{ name: 'StudentTabs' }] });
  //   else if (role === 'admin') navigation.reset({ index: 0, routes: [{ name: 'AdminTabs' }] });
  //   else                       navigation.reset({ index: 0, routes: [{ name: 'InstructorTabs' }] });
  // };

  const { signIn } = useAuth();

async function handleLogin() {
  try {
    await signIn({ email, password });

    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "StudentTabs" }],
    // });
    // Navigation happens automatically via the session listener above
  } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unexpected error occurred.');
      }
    }
}

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>

          <View style={styles.head}>
            <Logo size={200} />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue learning</Text>
          </View>

          <RoleToggle role={role} onChange={setRole} />

          <TextField
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            icon="lock-closed-outline"
            placeholder="••••••••"
            secure
            value={password}
            onChangeText={setPassword}
          />

          <Pressable hitSlop={8} style={styles.forgot}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <AppButton label="Login" icon="log-in-outline" onPress={handleLogin} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Register</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  back: { marginTop: spacing.md },
  head: { alignItems: 'center', marginVertical: spacing.xl },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textMuted, fontSize: 14 },
  link: { color: colors.navy, fontSize: 14, fontWeight: '700' },
});
