import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

import { Ionicons } from '@expo/vector-icons';

export default function ImagePickerButton({ onImage }) {

	const pickImage = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				// allow editing screenshots?
				allowsEditing: false,
				aspect: [4, 3],
				quality: 0.3,
				base64: true
			});

			/*if (Platform.OS === 'android') {
				const pendingResults = await ImagePicker.getPendingResultAsync();
				if (pendingResults.length === 1 && !pendingResults[0].message) {
					result = pendingResults[0];
				} else {
					throw new Error('Android pending result issue ' + pendingResults.length === 1 ? pendingResults[0].message : '');
				}
			}*/

			if (!result.cancelled) {
				onImage(result);
			}
		} catch (err) {
			console.log(err.message);
			alert('Something went wrong with the image picker.');
		}
	};

	const onButtonPress = async () => {
		const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
		if (existingStatus !== 'granted') {
			const { status: requestedStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (requestedStatus !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
				return;
			}
		}
		pickImage();
	}



	return (
		<TouchableOpacity onPress={onButtonPress}>
			<Ionicons name='images-outline' size={40} color='white' />
		</TouchableOpacity>
	);
}