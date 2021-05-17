import { StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

const baseStyles = StyleSheet.create({
	containerView: {
		flex: 1,
		// marginTop: Constants.statusBarHeight || 0
	}
});

export default baseStyles;