import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

import ParsingInProgressModal from "../components/ParsingInProgressModal";
import ImageScreen from "./Image";
import ImagePickerButton from '../components/ImagePickerButton';

import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import parseReceiptImage from "../services/receipt-ocr";


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    alignItems: "flex-end",
    // justifyContent: 'center'
  },
  buttonBottomContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    flex: 0.1,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [cameraRef, setCameraRef] = React.useState(null);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [parsingState, setParsingState] = React.useState("progress");
  const [numItems, setNumItems] = React.useState(0);

  const isFocused = useIsFocused();


  const [type, setType] = React.useState(Camera.Constants.Type.back);
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (!hasPermission == null) {
    return (
      <Text>
        Please allow access to Camera to use the Scan Receipt feature.
      </Text>
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
      if (cameraRef) {
        cameraRef.resumePreview();
      }

      return () => {};
    }, [])
  );

  	const handleImage = async (image) => {
		try {
			if (cameraRef) {
				cameraRef.pausePreview();
			}

			setParsingState("progress");
			setModalVisible(true);

			const numAdded = await parseReceiptImage(image);

		    if (numAdded === 0) {
		    	setParsingState('empty');
		    } else {
		    	setNumItems(numAdded);
		    	setParsingState("success");
		    }

		} catch (err) {
			console.warn(err);
			setParsingState("error");
		}
	}

	const handleOnPress = async () => {
		if (cameraReady && cameraRef) {
			try {
				const image = await cameraRef.takePictureAsync({
					base64: true,
			        // exif: true,
			        quality: 0.3,
			    });

				await handleImage(image);
			} catch (err) {
				console.log(err);
			}
		}
	};

  const handleCloseModal = () => {
    setModalVisible(false);
    if (parsingState === "success") {
      navigation.navigate("FoodList", { update: true });
    } else if (cameraRef) {
      cameraRef.resumePreview();
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          style={styles.camera}
          type={type}
          pictureSize="high"
          onCameraReady={() => setCameraReady(true)}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        >
          <View style={styles.buttonContainer}>
            <View style={styles.buttonBottomContainer}>
              <ImagePickerButton onImage={handleImage}/>
              <TouchableOpacity onPress={handleOnPress}>
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 50,
                    borderColor: "white",
                    height: 50,
                    width: 50,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderRadius: 50,
                      borderColor: "white",
                      height: 40,
                      width: 40,
                      backgroundColor: "white",
                    }}
                  ></View>
                </View>
              </TouchableOpacity>
              <View style={{ width: 25 }}></View>
            </View>
          </View>
        </Camera>
      )}
      <ParsingInProgressModal
        visible={modalVisible}
        parsingState={parsingState}
        numItems={numItems}
        onClosePress={handleCloseModal}
      />
    </View>
  );
}

export default function CameraStack({ headerOptions }) {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ ...headerOptions }}>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: "Scan Receipt" }}
      />
      <Stack.Screen
        name="Image"
        component={ImageScreen}
        options={{ title: "Scanned Image" }}
      />
    </Stack.Navigator>
  );
}
