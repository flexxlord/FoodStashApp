import * as React from "react";
import { StyleSheet, Text, View ,Image} from "react-native";

import { useFocusEffect } from '@react-navigation/native';

export default function ImageScreen({ route, navigation }) {
	const { photo } = route.params;
 
	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		if (photo !== null) {
	// 			console.log(photo);
	// 		}
	// 		return () => {};
	// 	}, [])
	// );

	return (
		<View style={{ flex: 1, alignItems:"center", justifyContent:"center" }}>
			<Image source={{ uri: photo.uri }} style={{width:380,height:550}}/>
		</View>
 	);
}