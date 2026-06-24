import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';
import CoursesScreen from '../screens/admin/CoursesScreen';
import EduStreamAdmin from '../screens/admin/EduStreamAdmin';
import HealthScreen from '../screens/admin/HealthScreen';
import UsersScreen from '../screens/admin/UsersScreen';
import { AdminTabParamList } from './types';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="AdminHome" component={EduStreamAdmin}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Users" component={UsersScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Health" component={HealthScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Courses" component={CoursesScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}