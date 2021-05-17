import React from "react";
import "react-native-gesture-handler";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import colors from "../styling/colors";

import HomeStack from "./Home";
import ItemDetailStack from "./ItemDetail";
import CameraStack from "./Camera";
import AddItemManualStack from "./AddItemManual";
import AboutStack from "./About";

import { useTheme } from "@ui-kitten/components";

const tabConfig = {
  AboutStack: {
    focused: "ios-information-circle",
    nonfocused: "ios-information-circle-outline",
    title: "About",
  },
  HomeStack: {
    focused: "ios-list-circle",
    nonfocused: "ios-list",
    title: "Home",
  },
  AddItemManualStack: {
    focused: "add-circle",
    nonfocused: "add",
    title: "Add Item",
  },
  CameraStack: {
    focused: "camera",
    nonfocused: "camera-outline",
    title: "Receipt",
  },
};

const createTabBarOptions = (theme) => ({
  activeTintColor: theme["color-primary-default"],
  activeBackgroundColor: theme["color-primary-transparent-200"],
  inactiveTintColor: "black",
  labelStyle: {
    fontWeight: "bold",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: "black",
    marginBottom: 10,
  },
  style: {
    minHeight: 80,
    paddingBottom: 10,
  },
});

const showWebpage = async () => {
  let result = await WebBrowser.openBrowserAsync("https://foodstashapp.com");
};

const createTabBarIcon = (route) => {
  return ({ focused, color, size }) => {
    const iconName = (tabConfig[route.name] || tabConfig["HomeStack"])[
      focused ? "focused" : "nonfocused"
    ];

    return <Ionicons name={iconName} size={35} color={color} />;
  };
};

const createTabOptions = (route) => {
  return {
    tabBarIcon: createTabBarIcon(route),
    tabBarLabel: tabConfig[route.name].title,
  };
};

const createHeaderOptions = (theme) => ({
  headerStyle: {
    backgroundColor: theme["color-primary-default"],
    // opacity: 0.8
  },
  headerTintColor: "white",
  headerTitleStyle: {
    opacity: 1.0,
    fontWeight: "bold",
    color: "white",
  },
  headerLeft: () => (
    <TouchableOpacity onPress={showWebpage}>
      <Image
        style={{ width: 30, height: 30, marginLeft: 20 }}
        source={require("../assets/logo.png")}
      />
    </TouchableOpacity>
  ),
});

function BaseTabScreenContainer() {
  const Tab = createBottomTabNavigator();

  const theme = useTheme();
  const headerOptions = createHeaderOptions(theme);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => createTabOptions(route)}
        tabBarOptions={createTabBarOptions(theme)}
        initialRouteName="HomeStack"
      >
        <Tab.Screen name="AboutStack">
          {() => <AboutStack headerOptions={{ ...headerOptions }} />}
        </Tab.Screen>
        <Tab.Screen name="HomeStack">
          {() => <HomeStack headerOptions={{ ...headerOptions }} />}
        </Tab.Screen>
        <Tab.Screen name="CameraStack">
          {() => <CameraStack headerOptions={{ ...headerOptions }} />}
        </Tab.Screen>
        <Tab.Screen name="AddItemManualStack">
          {() => <AddItemManualStack headerOptions={{ ...headerOptions }} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export { BaseTabScreenContainer, createHeaderOptions };
