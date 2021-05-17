import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// import AppLoading from 'expo-app-loading';

import HomeScreen from './HomeScreen';
import ItemDetailScreen from './ItemDetailScreen';
import CameraScreen from './CameraScreen';
import AddItemManualScreen from './AddItemManualScreen';
import AboutScreen from './AboutScreen';

const createTabBarIcon = (route) => {
  return ({ focused, color, size }) => {
    const tabIconConfig = {
      Home: {
        focused: "ios-information-circle",
        nonfocused: "ios-information-circle-outline",
      },
      About: {
        focused: "ios-list-circle",
        nonfocused: "ios-list",
      },
      AddItemManual: {
        focused: "add-circle",
        nonfocused: "add",
      },
      Camera: {
        focused: "camera",
        nonfocused: "camera-outline",
      },
    };
    // todo add default/missing icon config
    const iconName = (tabIconConfig[route.name] || tabIconConfig["Home"])[
      focused ? "focused" : "nonfocused"
    ];

    return <Ionicons name={iconName} size={size} color={color} />;
  };
};

const createScreenOptions = (route) => {
  return {
    tabBarIcon: createTabBarIcon(route),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray",
    },
  };
};

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <React.Fragment>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => createScreenOptions(route)}
        >
          <Tab.Screen name="Camera" component={CameraScreen}></Tab.Screen>
          <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
          <Tab.Screen
            name="AddItemManual"
            component={AddItemManualScreen}
          ></Tab.Screen>
          <Tab.Screen name="About" component={AboutScreen}></Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </React.Fragment>
  );
}