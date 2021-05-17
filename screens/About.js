import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Card } from "@ui-kitten/components";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { ScrollView } from "react-native-gesture-handler";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

function AboutScreen() {
  const showWebpage = async () => {
    if (await Linking.canOpenURL("https://foodstashapp.com")) {
      await Linking.openURL("https://foodstashapp.com");
    }
  };
  const showInsta = async () => {
    if (await Linking.canOpenURL("https://instagram.com")) {
      await Linking.openURL("https://instagram.com/foodstashapp");
    }
  };

  //Update below everytime new version gets published
  const version = "1.2.0";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.aboutusheading}>About Us</Text>
      <Text style={styles.aboutustext}>
        Our mission is to help you manage the food you buy, store, and eat. We
        give you personalized tips on how to make your food last longer, based
        on the food that’s in your pantry. We also remind you when food is
        expiring, so that you can plan ahead. Importing food into our app is
        easy - just scan a receipt and you’re good to go. Our tips are backed by
        governmental sources like the USDA, so you can rest assured our
        recommendations are legit.
      </Text>
      <TouchableOpacity style={styles.learnmore} onPress={showWebpage}>
        <Text style={styles.learnmoretext} color="#000">
          Learn more
        </Text>
        <Ionicons name={"chevron-forward-outline"} size={20} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.instacard} onPress={showInsta}>
        <Text style={styles.learnmoretext} color="#000">
          Follow us on Insta
        </Text>
        <Ionicons name={"chevron-forward-outline"} size={20} />
      </TouchableOpacity>
      <Text style={styles.version}>Version: {version}</Text>
    </ScrollView>
  );
}
export default function AboutStack({ headerOptions }) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ ...headerOptions }}>
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  aboutusheading: {
    marginTop: 0.153 * deviceHeight - 100,
    marginStart: 0.101 * deviceWidth,
    fontSize: 34,
    fontFamily: "Poppins_600SemiBold",
  },
  aboutustext: {
    marginTop: 0.02 * deviceHeight,
    marginStart: 0.101 * deviceWidth,
    marginEnd: 0.101 * deviceWidth,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  learnmore: {
    marginStart: 0.101 * deviceWidth,
    width: 0.76 * deviceWidth,
    marginTop: 0.03 * deviceHeight,
    height: 0.067 * deviceHeight,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  learnmoretext: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    width: 0.49 * deviceWidth,
  },
  instacard: {
    marginStart: 0.101 * deviceWidth,
    width: 0.76 * deviceWidth,
    marginTop: 0.03 * deviceHeight,
    height: 0.067 * deviceHeight,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#ffffff",
  },
  version: {
    alignSelf: 'center',
    marginTop: 0.05 * deviceHeight,
    fontFamily: "Poppins_400Regular",
    opacity: 0.4,
  }
});
