import React from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import FoodItem from '../models/FoodItem';
import EditFoodItem from './EditFoodItem';
import DeleteAllButton from './DeleteAllButton';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, useTheme, Input } from '@ui-kitten/components';

import makeElevation from '../styling/make-elevation';

export default function FoodListHeaderBar({
	searchText,
	onSearchTextChange,
	onControlsPress,
	removeAllCurrentItems
}) {
	const theme = useTheme();
	// , backgroundColor: theme['color-primary-default']

	const clearSearchIcon = (props) => (
		<TouchableWithoutFeedback onPress={() => onSearchTextChange('')}>
			<Ionicons name='close-outline' size={20} color={'grey'} />
		</TouchableWithoutFeedback>
	)
	return (
		<View style={styles.wrapper}>
			<Input
				placeholder='Search your stash 🔍'
				value={searchText}
				onChangeText={onSearchTextChange}
				accessoryRight={searchText ? clearSearchIcon : () => null}
				style={styles.searchInput}
			/>
			<View style={styles.deleteButtonContainer}>
				<DeleteAllButton removeAllCurrentItems={removeAllCurrentItems} />
			</View>
			<TouchableOpacity onPress={onControlsPress} style={{...styles.controlButton, backgroundColor: theme['color-info-200'], borderRadius: 10 }}>
				<Ionicons name='options-outline' size={35} color='black' style={{margin: 0}}/>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		borderRadius: 10,
		padding: 5,
		height: '10%',
		flexBasis: '10%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#F5F5F5',
		...(makeElevation(3))
	},
	searchInput: {
		width: '65%',
		flexBasis: '65%',
		borderRadius: 10
	},
	controlButton: {
		width: '15%',
		maxHeight: '60%',
		flexBasis: '15%',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	deleteButtonContainer: {
		width: '15%',
		maxHeight: '60%',
		flexBasis: '15%',
		alignItems: 'center',
		justifyContent: 'space-around'
	}
});
