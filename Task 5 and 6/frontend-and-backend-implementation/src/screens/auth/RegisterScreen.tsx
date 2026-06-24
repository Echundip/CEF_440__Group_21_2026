import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton, TextField } from '../../components';
import { RoleToggle } from './RoleToggle';
import { Role } from '../../data/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/typography';
import { RootStackParamList } from '../../navigation/types';
import { useAuth } from '../../../task 6/backend-implementation/UseAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  

  // const onRegister = () => {
  //   if (role === 'student') {
  //     navigation.reset({ index: 0, routes: [{ name: 'StudentTabs' }] });
  //   } else {
  //     navigation.reset({ index: 0, routes: [{ name: 'InstructorTabs' }] });
  //   }
  // };

  const { signUp } = useAuth();

  async function handleRegister() {
    if (password !== confirm) {
  alert('Passwords do not match.');
  return;
}
  try {
    await signUp({ email, password, fullName: name, role }); // role = 'student' or 'instructor'
    alert('Check your email to confirm your account.');
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
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join the adaptive learning community</Text>
          </View>

          <RoleToggle role={role} onChange={setRole} />

          <TextField label="Full name" icon="person-outline" placeholder="Jane Doe" value={name} onChangeText={setName} />
          <TextField
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextField label="Password" icon="lock-closed-outline" placeholder="••••••••" secure value={password} onChangeText={setPassword} />
          <TextField label="Confirm password" icon="lock-closed-outline" placeholder="••••••••" secure value={confirm} onChangeText={setConfirm} />

          <AppButton label="Create account" icon="person-add-outline" onPress={handleRegister} style={{ marginTop: spacing.sm }} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Login</Text>
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
  head: { marginVertical: spacing.xl },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  footerText: { color: colors.textMuted, fontSize: 14 },
  link: { color: colors.navy, fontSize: 14, fontWeight: '700' },
});
