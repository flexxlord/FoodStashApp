import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

async function registerAsync({ reAsk = true }) {
	let token;
	
	if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		
		if (existingStatus !== 'granted' && reAsk) {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			throw new Error('Failed to get push token for push notification - user did not grant permission!');
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		if (!token) {
			throw new Error('Unable to get expo push token');
		}
	} else {
		throw new Error('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: false,
			shouldSetBadge: true,
		})
	});

	return token;
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendAsync({
	title = 'FoodStash Message',
	body = 'Message from FoodStash!',
	data = {},
	reAsk = true,
}) {
	try {
		const expoPushToken = await registerAsync({ reAsk });

		const message = {
			to: expoPushToken,
			sound: 'default',
			title: title,
			body: body,
			data: data,
		};

		await fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Accept-encoding': 'gzip, deflate',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(message),
		});
	} catch (error) {
		console.warn(error);

	}
}

export default { registerAsync, sendAsync };