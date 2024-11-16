import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from './../../constants/Colors';
import { nodeModuleNameResolver } from 'typescript';

const CircleIcon = ({ color, children }) => {
  return (
    <View
      style={{
        width: 50, // Szerokość kółka
        height: 50, // Wysokość kółka
        borderRadius: 30, // Aby uzyskać okrągły kształt
        backgroundColor: color, // Kolor tła kółka
        justifyContent: 'center', // Wyśrodkowanie ikonki
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs 
  screenOptions={{
    tabBarStyle: { 
      height: 60,
      backgroundColor: '#27272a',
      borderWidth: 0,
      shadowColor: '#000', // Shadow color
      shadowOpacity: 0.25, // Shadow opacity
      shadowRadius: 3.5, // How blurred the shadow is
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      elevation: 5, // Elevation for Android
      paddingBottom: 5,
    },
    tabBarLabelStyle: { display: 'none' }, // Hide labels
    tabBarActiveTintColor: Colors.GRAY,
    tabBarInactiveTintColor: Colors.ZINC_INACTIVE
  }}
>
  <Tabs.Screen 
    name='home'
    options={{
      title: 'SEARCH',
      headerShown: false,
      tabBarIcon: ({ focused }) => (
        <CircleIcon color={focused ? Colors.MAIN : Colors.ZINC_INACTIVE}>
          <Ionicons name="search" size={30} color={Colors.WHITE} />
        </CircleIcon>
      ),
    }} 
  />
  <Tabs.Screen 
    name='ChatScreen'
    options={{
      title: 'CHAT',
      headerShown: false,
      tabBarIcon: ({ focused }) => (
        <CircleIcon color={focused ? Colors.MAIN : Colors.ZINC_INACTIVE}>
          <Ionicons name="chatbox" size={30} color={Colors.WHITE} />
        </CircleIcon>
      ),
    }} 
  />
  <Tabs.Screen 
    name='profile'
    options={{
      title: 'PROFILE',
      headerShown: true,
      tabBarIcon: ({ focused }) => (
        <CircleIcon color={focused ? Colors.MAIN : Colors.ZINC_INACTIVE}>
          <Ionicons name="person" size={30} color={Colors.WHITE} />
        </CircleIcon>
      ),
    }} 
  />
  <Tabs.Screen 
    name='ChatDetails'
    options={{
      headerShown: false,
      tabBarButton: () => null, // Hide tab button
    }} 
  />
  <Tabs.Screen 
    name='maches'
    options={{
      headerShown: false,
      tabBarButton: () => null, // Hide tab button
    }} 
  />
</Tabs>
  );
}