import * as React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import { useFocusEffect } from '@react-navigation/native';

import AppModel from '../models/AppModel';
import FoodItem from '../models/FoodItem';
import EditFoodItemCard from '../components/EditFoodItemCard';
import dayjs from 'dayjs';

import { ExpiryState, DefaultUnits, DefaultMeasurements, DefaultLocations } from '../models/constants';

function AddItemManualScreen({ navigation }) {
	const foodItemStub = () => {
		// stub.hasCustomUnit = () => !(DefaultMeasurements.includes(stub.unit)) && !(DefaultUnits.includes(stub.unit));
		// stub.hasCustomLocation = () => !(DefaultLocations.includes(stub.location));
		// stub.getExpiryJSDate = () => stub.expiryDate && stub.expiryDate.toDate();
		// stub.setExpiryFromJSDate = (jsDate) => { stub.expiryDate = dayjs(jsDate); }

		return {
			name: '',
			quantity: 1,
			expiryDate: null,
			notifications: true,
			unit: 'items',
			location: 'fridge'
		};
	};

	const withGetters = (obj) => {
		return {
			...obj,
			hasCustomUnit: () => !(DefaultMeasurements.includes(obj.unit)) && !(DefaultUnits.includes(obj.unit)),
			hasCustomLocation: () => !(DefaultLocations.includes(obj.location)),
			isValid: () => obj.name.length > 0 && obj.unit.length > 0 && obj.unit !== 'Custom' && obj.location.length > 0 && obj.location !== 'Custom',
			getExpiryJSDate: () => obj.expiryDate && obj.expiryDate.toDate()
		};
	}

	const [newItem, setNewItem] = React.useState(withGetters(foodItemStub()));
	const [refreshIndex, setRefreshIndex] = React.useState(0);
	// const [acceptPressed, setAcceptPressed] = React.useState(false);

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		// if we've already added our current food item we need to make a new one
	// 		// if (AppModel.foodItems.itemWithId(newItem.uuid)) {
	// 		if (acceptPressed && AppModel.foodItems.itemWithId(newItem.uuid)) {
	// 			setNewItem(foodItemStub());
	// 			setAcceptPressed(false);
	// 		}
	// 		// }

	// 		return () => {};
	// 	}, [])
	// );

	const changeHandlers = {
		onChangeFoodName: (newName) => {
			// newItem.name = newName;
			setNewItem(withGetters({...newItem, name: newName }));
			setRefreshIndex(refreshIndex + 1);
		},
		onIncrementQuantity: () => {
			// newItem.quantity += 1;
			setNewItem(withGetters({...newItem, quantity: newItem.quantity + 1 }));
			setRefreshIndex(refreshIndex + 1);
		},
		onDecrementQuantity: () => {
			if (newItem.quantity === 1) {
				// triggerDelete();
			} else {
				// newItem.quantity -= 1;
				setNewItem(withGetters({...newItem, quantity: newItem.quantity - 1 }));
			}
			setRefreshIndex(refreshIndex + 1);
		},
		onChangeDate: (newDate) => {
			// newItem.setExpiryFromJSDate(newDate);
			setNewItem(withGetters({...newItem, expiryDate: dayjs(newDate) }));
			setRefreshIndex(refreshIndex + 1);
		},
		onChangeUnit: (newUnit) => {
			// newItem.unit = newUnit;
			setNewItem(withGetters({...newItem, unit: newUnit }));
			setRefreshIndex(refreshIndex + 1);
		},
		onChangeLocation: (newLocation) => {
			// newItem.location = newLocation;
			setNewItem(withGetters({...newItem, location: newLocation }));
			setRefreshIndex(refreshIndex + 1);
		},
		onChangeNotifications: (newNotificationState) => {
			// newItem.notifications = newNotificationState;
			setNewItem(withGetters({...newItem, notifications: newNotificationState }));
			setRefreshIndex(refreshIndex + 1);
		}
	}

	const onCancel = () => {
		navigation.navigate('Home');
	}

	const onAccept = () => {
		AppModel.foodItems.addFoodItem(new FoodItem(newItem));
		navigation.navigate('FoodList', {
			update: true
		});
		setNewItem(withGetters(foodItemStub()));
	}

	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, alignItems: 'center' }}>
			<EditFoodItemCard
				foodItem={newItem}
				refreshIndex={refreshIndex}
				height={400}
				isAdding={true}
				changeHandlers={changeHandlers}
				triggerDelete={onCancel}
				onAccept={onAccept}
			/>
		</KeyboardAvoidingView>
	);
}

export default function AddItemManualStack({ headerOptions }) {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator screenOptions={{...headerOptions}}>
      		<Stack.Screen name='AddItemManual' component={AddItemManualScreen} options={{ title: 'Add Food' }}/>
    	</Stack.Navigator>
    );
}
