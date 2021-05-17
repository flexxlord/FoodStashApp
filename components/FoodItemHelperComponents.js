import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Layout, Button, ButtonGroup, Text } from '@ui-kitten/components';

const styles = StyleSheet.create({
	cardQuantityAdjust: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	cardQuantityButton: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
		borderRadius: 5
	},
	cardQuantityTextWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const QuantityAdjust = ({ onIncrement, onDecrement, quantity, maxWidth = '30%' }) => {
	return (
		<View style={{...styles.cardQuantityAdjust, maxWidth: maxWidth }}>
			<TouchableOpacity onPress={onDecrement} style={styles.cardQuantityButton}>
				<Ionicons name='remove-outline' size={35} color='black' />
			</TouchableOpacity>
			<View style={styles.cardQuantityTextWrapper}>
				<Text>{quantity}</Text>
			</View>
			<TouchableOpacity onPress={onIncrement} style={styles.cardQuantityButton}>
				<Ionicons name='add-outline' size={35} color='black' />
			</TouchableOpacity>
		</View>
	);
}

const ItemControls = ({ onTipsPress, onEditPress, onDeletePress }) => (
	<Layout>
		<ButtonGroup>
			<Button onPress={() => onTipsPress()} status='warning'>
				<Ionicons name='bulb-outline' size={15} color='white' />
			</Button>
			<Button onPress={() => onEditPress()} status='info'>
				<Ionicons name='pencil-outline' size={15} color='white' />
			</Button>
			<Button onPress={() => onDeletePress()} status='danger'>
				<Ionicons name='trash-outline' size={15} color='white' />
			</Button>
		</ButtonGroup>
	</Layout>
);



export { QuantityAdjust, ItemControls };