import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GroupsScreen from './GroupsScreen';
import ProfileScreen from './ProfileScreen';
import ActivityScreen from './ActivityScreen';
import Colors from '../utils/Colors';

const Tab = createBottomTabNavigator();

const Home = ({ route }) => {
  const { email } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary, // Active icon color
        tabBarInactiveTintColor: 'gray', // Inactive icon color
        headerShown: false, // Hide header for all screens
        tabBarShowLabel: false, // Hide labels
      }}
    >
      <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="group" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
