import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { CourseListScreen } from '../screens/student/CourseListScreen';
import { DashboardScreen } from '../screens/student/DashboardScreen';
import { DownloadsScreen } from '../screens/student/DownloadsScreen';
import { ProfileScreen } from '../screens/student/ProfileScreen';
import { colors } from '../theme/colors';
import { StudentTabParamList } from './types';

const Tab = createBottomTabNavigator<StudentTabParamList>();

const icons: Record<keyof StudentTabParamList, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'home',
  Courses: 'book',
  Downloads: 'cloud-download',
  Profile: 'person',
};

export function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? icons[route.name] : (`${icons[route.name]}-outline` as keyof typeof Ionicons.glyphMap)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Courses" component={CourseListScreen} />
      <Tab.Screen name="Downloads" component={DownloadsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
