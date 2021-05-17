import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Platform, TouchableOpacity, NativeModules, LayoutAnimation } from 'react-native';
import colors from '../styling/colors';

import DisplayFoodItem from './DisplayFoodItem';
import EditFoodItemCard from './EditFoodItemCard';
import FoodItem from '../models/FoodItem';
import { ExpiryState } from '../models/constants';
import { Ionicons } from '@expo/vector-icons';

import { Text, ListItem, useTheme, ButtonGroup, Button, Icon, Layout } from '@ui-kitten/components';

import { QuantityAdjust } from './FoodItemHelperComponents';
// const { UIManager } = NativeModules;

// UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const styles = StyleSheet.create({
	cardQuantityAdjust: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	cardSelectedWrapper: {
		borderWidth: 2,
		borderRadius: 3,
		// margin: 10,
	},
	closedListItem: {
		marginHorizontal: 10,
		marginTop: 10,
		minHeight: 75,
	},
	itemExpiry: {
		flex: 1,
		fontSize: 15,
		fontWeight: '300'
	},
});

const expiryColor = (item, theme) => {
	switch (item.expiryState()) {
		case ExpiryState.EXPIRED:
		case ExpiryState.EXPIRING_TODAY:
			return theme['color-danger-900'];
		case ExpiryState.EXPIRING_THIS_WEEK:
			return theme['color-warning-900'];
		case ExpiryState.EXPIRING_AFTER_WEEK:
			return theme['color-success-900'];
		default:
			throw new Error('invalid expiry state')
	}
};

const createExpiry = (item, theme) => {
	return (
		<Text style={styles.itemExpiry} category='s1'>
			Expires <Text style={{color: expiryColor(item, theme) }} category='s1'>{item.expiryFromNow()}</Text>
		</Text>
	);
};


export default function FoodItemCard({
	foodItem,
	onPress,
	isFirst,
	isOpen,
	onMoreTips,
	changeHandlers,
	triggerDelete,
}) {
	const [cardState, setCardState] = useState('closed');
	// state can be one of 'closed', 'display', or 'edit'
	const theme = useTheme();

	const createQuantityAdjust = () => (
		<QuantityAdjust
			onIncrement={changeHandlers.onIncrementQuantity}
			onDecrement={changeHandlers.onDecrementQuantity}
			quantity={`X ${foodItem.quantity}`}
			maxWidth='30%'
		/>
	);

	const FoodListItem = () => (
		<ListItem
			title={(...props) => {
				return (
					<Text {...props} category='s1'>{foodItem.name} (x{foodItem.quantity} {foodItem.unit})</Text>
				);
			}}
			description={(...props) => {
				if (foodItem.expiryDate == null) {
					return <Text></Text>;
				}
				return (
					<Text {...props} style={styles.itemExpiry} category='s1'>
						Expires <Text {...props} style={{color: expiryColor(foodItem, theme) }} category='s1'>{foodItem.expiryFromNow()}</Text>
					</Text>
				);
			}}
			style={styles.closedListItem}
			accessoryRight={createQuantityAdjust}
			onPress={() => setCardState(cardState === 'display' ? 'closed' : 'display')}
		/>
	);


	switch (cardState) {
		case 'display':
			return (
				<View style={{ ...styles.cardSelectedWrapper, borderColor: theme['color-primary-default'] }}>
					<FoodListItem />
					<DisplayFoodItem foodItem={foodItem} onEdit={() => setCardState('edit')} triggerDelete={triggerDelete} onMoreTips={onMoreTips}/>
				</View>
			);
		case 'edit':
			return (
				<EditFoodItemCard
					height={200}
					foodItem={foodItem}
					changeHandlers={changeHandlers}
					triggerDelete={triggerDelete}
					onAccept={() => setCardState('closed')}
				/>
			);

		case 'closed': // hehe
		default:
			return (
				<FoodListItem />
			);
	}
};