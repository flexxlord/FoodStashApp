import React from 'react';
import { StyleSheet, View } from 'react-native';

import FoodItem from '../models/FoodItem';
import EditFoodItem from './EditFoodItem';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, Text, useTheme } from '@ui-kitten/components';


const Header = ({ foodItemName, isAdding, ...props }) => (
  <View {...props} style={styles.cardHeader}>
    <Text category='s1'>{isAdding ? (foodItemName.length > 0 ? 'Adding new' : 'Add new item') : 'Editing'} <Text category='s1' style={styles.foodItemName}>{foodItemName}</Text></Text>
  </View>
);

const Footer = ({ onAccept, onDelete, isValid, ...props }) => (
  <View {...props} style={[props.style, styles.footerContainer]}>
    <Button
    	onPress={onAccept}
      	style={styles.footerControl}
      	size='small'
      	disabled={!isValid}>
      	OK
    </Button>
  </View>
);

export default function EditFoodItemCard({
	foodItem,
	height,
	isAdding,
	changeHandlers,
	triggerDelete,
	onAccept,
}) {
	const theme = useTheme();

	return (
		<Card
			style={{...styles.card, ...(isAdding ? { width: '100%' } : {}) }}
			header={() => <Header foodItemName={foodItem.name} isAdding={isAdding}/>}
			footer={() => <Footer onDelete={triggerDelete} onAccept={onAccept} isValid={foodItem.isValid()}/>}
			disabled={true}
		>
			<EditFoodItem
				height={height}
				foodItem={foodItem}
				triggerDelete={triggerDelete}
				{...changeHandlers}
			/>
		</Card>
	);
}

const styles = StyleSheet.create({
	card: {
		padding: 5,
		//margin: 10,
		shadowRadius: 0,
		borderWidth: 2,
		borderRadius: 2
	},
	cardHeader: {
		padding: 10,
	},
	footerContainer: {
	    flexDirection: 'row',
	    justifyContent: 'flex-end',
	    padding: 10,
	},
	foodItemName: {
		fontWeight: 'bold',
		fontSize: 16
	}
});
