import { View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from './../../constants/Colors';
import { nodeModuleNameResolver } from 'typescript';
//import "../../global.css"

const CircleIcon = ({ color, children }) => {
  return (
    <View
      style={{
        width: 60, // Szerokość kółka
        height: 60, // Wysokość kółka
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
          height: 100
        },
        tabBarLabelStyle: { display: 'none' }, // Ukrycie etykiet
        tabBarActiveTintColor: Colors.GRAY,
        tabBarInactiveTintColor: Colors.BLACK,
      }}
    >
      <Tabs.Screen 
        name='home'
        options={{
          title: 'SEARCH',
          headerShown: false,
          tabBarIcon: ({ focused  }) => (
            <CircleIcon color={focused ? Colors.MAIN : Colors.GRAY}>
              <Ionicons name="search" size={30} color={Colors.WHITE} />
            </CircleIcon>
          ),
        }} 
      />
      <Tabs.Screen 
        name='maches'
        options={{
          title: 'MATCHES',
          headerShown: false,
          tabBarIcon: ({ focused  }) => (
            <CircleIcon color={focused ? Colors.MAIN : Colors.GRAY}>
              <MaterialIcons name="science" size={30} color={Colors.WHITE} />
            </CircleIcon>
          ),
        }} 
      />
      <Tabs.Screen 
        name='ChatScreen'
        options={{
          title: 'CHAT',
          headerShown: false,
          tabBarIcon: ({ focused  }) => (
            <CircleIcon color={focused ? Colors.MAIN : Colors.GRAY}>
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
          tabBarIcon: ({ focused  }) => (
            <CircleIcon color={focused ? Colors.MAIN : Colors.GRAY}>
              <Ionicons name="person" size={30} color={Colors.WHITE} />
            </CircleIcon>
          ),
        }} 
        
      />
    </Tabs>
  );
}