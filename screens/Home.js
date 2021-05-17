import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FoodList from './FoodList';
import ItemDetail from './ItemDetail';
import MoreTips from './MoreTips';

export default function HomeStack({ headerOptions }) {
	const Stack = createStackNavigator();

	return (
		<Stack.Navigator screenOptions={{...headerOptions}} mode='modal'>
			<Stack.Screen name='FoodList' component={FoodList} options={{ title: 'Home' }}/>
			<Stack.Screen name='MoreTips' component={MoreTips} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}

// <Stack.Screen name='ItemDetail' component={ItemDetail} options={{ title: 'Item Details' }}/>