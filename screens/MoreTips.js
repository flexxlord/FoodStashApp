import * as React from "react";
import { StyleSheet, View ,Image, TouchableOpacity } from "react-native";

import { useFocusEffect } from '@react-navigation/native';

import TipCard from '../components/TipCard';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ListItem, List, ButtonGroup, Button, useTheme, Layout } from '@ui-kitten/components';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";


const styles = StyleSheet.create({
	screenWrapper: {
		flex: 1,
		flexDirection: 'column',
		padding: 10
	},
	header: {
		flex: 0.12,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingHorizontal: 10,
		paddingVertical: 20
	},
	headerText: {
		fontFamily: 'Poppins_500Medium'
	},
	mainWrapper: {
		flex: 0.8,
		padding: 5,
	},
	downButton: {
		backgroundColor: 'rgba(0, 0, 0, 0.00)',
		borderRadius: 5
	},
})

export default function MoreTips({ route, navigation }) {
	const { tips, name } = route.params;

	const theme = useTheme();

	const renderItem = ({ item, index }) => {
		return <TipCard tipType={item.type} tipText={item.text} />;
	}

	return (
		<View style={styles.screenWrapper}>
			<View style={styles.header}>
				<Text category='h4' style={styles.headerText}>Tips for your <Text category='h4' style={{...styles.headerText, color: theme['color-primary-default']}}>{name}</Text></Text>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.downButton}>
					<Ionicons name='chevron-down-outline' size={40} color='black' />
				</TouchableOpacity>
			</View>

			<View style={styles.mainWrapper}>
				<List
					style={{backgroundColor: 'transparent'}}
					data={tips}
					renderItem={renderItem}
					// FlatListProps={{
					// 	persistentScrollbar: true,
					// 	showsHorizontalScrollIndicator: true
					// }}
					// showsHorizontalScrollIndicator={true}
				/>
			</View>
		</View>
 	);
}