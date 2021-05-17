import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import { Layout, Text, Card, useTheme } from '@ui-kitten/components';
import { LinearGradient } from 'expo-linear-gradient';

const colorsForTip = (theme) => ({
	Ripening: {
		headerColor: 'yellow',
		gradientColors: [theme['color-warning-transparent-600'], theme['color-warning-transparent-500'], theme['color-warning-transparent-400']],
		headerText: '⏩ 🍓 Ripening'
	},
	Determine: {
		headerColor: 'blue',
		gradientColors: [theme['color-info-transparent-600'], theme['color-info-transparent-500'], theme['color-info-transparent-400']],
		headerText: '⏩ 🍓 Checking Ripeness'
	},
	Storage: {
		headerColor: 'pink',
		gradientColors: [theme['color-danger-transparent-600'], theme['color-danger-transparent-500'], theme['color-danger-transparent-400']],
		headerText: '🥡 Storage'
	},
	Expires: {
		headerColor: 'green',
		gradientColors: [theme['color-success-transparent-600'], theme['color-success-transparent-500'], theme['color-success-transparent-400']],
		headerText: '🕒 Expiration'
	}
});

const Header = ({ text, backgroundColor }) => (
	<View style={{...styles.cardHeader, backgroundColor: backgroundColor }}>
    	<Text category='s1'>{text}</Text>
  	</View>
);

export default function TipCard({
	tipType, // one of 'Ripening', 'Freshness', 'Storage', 'Timing'?? 
	tipText
}) {
	const theme = useTheme();
	const { headerColor, headerText, gradientColors } = colorsForTip(theme)[tipType];
	if (3 === 3) {
		// ['#4c669f', '#3b5998', '#192f6a']
		return (
			<View elevation={5} style={styles.shadowWrapper}>
				<LinearGradient colors={gradientColors} start={{ x: 0.1, y: 0.2 }} end={{ x: 0.9, y: 0.8 }} style={styles.wrapper} elevation={5}>
					<Text style={{...styles.headerText, color: theme['color-primary-800']}} category='h6'>{headerText}</Text>
					<Text style={{...styles.tipText, color: theme['color-primary-800']}} category='s1'>{tipText}</Text>
				</LinearGradient>
			</View>
		)
	}

	return (
		<Card
			disabled={true}
			header={() => <Header text={headerText} backgroundColor={headerColor} />}
			style={styles.cardContent}
		>
			<Text category='p1'>{tipText}</Text>
		</Card>
	)
}

const styles = StyleSheet.create({
	cardHeader: {
		padding: 10
	},
	wrapper: {
		padding: 15,
		marginTop: 10,
		borderRadius: 5,
		shadowRadius: 0,
	},
	shadowWrapper: {
		backgroundColor: '#fff',
		shadowColor: "#000000",
	    shadowOpacity: 0.8,
	    shadowRadius: 2,
	    shadowOffset: {
	      height: 1,
	      width: 1
	    }
	},
	headerText: {
		color: 'white',
		marginBottom: 10
	},
	tipText: {
		color: 'white'
	},
	cardContent: {
		padding: 0,
		marginTop: 10,
	}
})