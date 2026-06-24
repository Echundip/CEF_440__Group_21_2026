import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { AnalyticsScreen } from '../screens/instructor/AnalyticsScreen';
import { InstructorDashboardScreen } from '../screens/instructor/InstructorDashboardScreen';
import { InstructorProfileScreen } from '../screens/instructor/InstructorProfileScreen';
import { ManageCoursesScreen } from '../screens/instructor/ManageCoursesScreen';
import { colors } from '../theme/colors';
import { InstructorTabParamList } from './types';

const Tab = createBottomTabNavigator<InstructorTabParamList>();

const icons: Record<keyof InstructorTabParamList, keyof typeof Ionicons.glyphMap> = {
  InstructorHome: 'home',
  ManageCourses: 'albums',
  Analytics: 'stats-chart',
  InstructorProfile: 'person',
};

const labels: Record<keyof InstructorTabParamList, string> = {
  InstructorHome: 'Home',
  ManageCourses: 'Courses',
  Analytics: 'Analytics',
  InstructorProfile: 'Profile',
};

export function InstructorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarLabel: labels[route.name],
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? icons[route.name] : (`${icons[route.name]}-outline` as keyof typeof Ionicons.glyphMap)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="InstructorHome" component={InstructorDashboardScreen} />
      <Tab.Screen name="ManageCourses" component={ManageCoursesScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="InstructorProfile" component={InstructorProfileScreen} />
    </Tab.Navigator>
  );
}
