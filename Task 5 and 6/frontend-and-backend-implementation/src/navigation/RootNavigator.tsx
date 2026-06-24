import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../../task 6/backend-implementation/UseAuth';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';

import { InstructorTabs } from './InstructorTabs';
import { StudentTabs } from './StudentTabs';
import { AdminTabs } from './AdminTabs';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 1. NOT LOGGED IN → AUTH FLOW
  if (!session) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  // 2. LOGGED IN → ROLE ROUTING
  const role = profile?.role;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'admin' ? (
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
      ) : role === 'instructor' ? (
        <Stack.Screen name="InstructorTabs" component={InstructorTabs} />
      ) : (
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
      )}
    </Stack.Navigator>
  );
}