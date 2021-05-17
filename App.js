import React from 'react';
import { StyleSheet, View, LogBox } from 'react-native';

import { StatusBar } from 'expo-status-bar';

import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { default as theme } from './theme.json';

import { enableScreens } from 'react-native-screens';
enableScreens();
import DropdownAlert from 'react-native-dropdownalert';
import DropdownHolder from './services/dropdown';

import { BaseTabScreenContainer } from './screens/Navigation.js';

import * as Device from "expo-device";

//import * as Sentry from 'sentry-expo';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import AppLoading from 'expo-app-loading';

import RNUxcam from 'react-native-ux-cam';

console.disableYellowBox = true; 

/*Sentry.init({
	dsn: 'https://3594119a930f4dccba3531d88fbb7686@o509948.ingest.sentry.io/5605050',
	enableInExpoDevelopment: true,
	debug: false
});*/

RNUxcam.optIntoSchematicRecordings();
RNUxcam.setUserIdentity(Device.deviceName || `${Math.random()}`);
RNUxcam.startWithKey('u7cmk33fim2bvgg');

// // Access any @sentry/react-native exports via:
// Sentry.Native.*

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <View width="100%" height="100%">
        <BaseTabScreenContainer />
        <StatusBar style="auto" />
      </View>
      <DropdownAlert ref={ref => DropdownHolder.setDropdown(ref)} closeInterval={10000} showCancel={true} updateStatusBar={false}/>
    </ApplicationProvider>
  );
}
