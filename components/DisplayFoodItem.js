import React, { useRef } from 'react';
import { StyleSheet, View, TextInput, Platform, TouchableOpacity } from 'react-native';

import colors from '../styling/colors';

import FoodItem from '../models/FoodItem';
import { ExpiryState } from '../models/constants';
import TipCard from './TipCard';
import { Ionicons } from '@expo/vector-icons';
import { Text, Card, ListItem, List, ButtonGroup, Button, useTheme, Layout } from '@ui-kitten/components';

const styleSpec = {
	card: {
		// padding: 5,
		// margin: 10,
		marginHorizontal: 10,
		marginBottom: 10,
		shadowRadius: 0,
		backgroundColor: "rgba(0, 143, 252, 0.16)"
	},
	cardContentWrapper: {
		padding: 10,
	},
	footerContainer: {
	    flexDirection: 'row',
	    justifyContent: 'flex-end',
	},
	footerControl: {
		margin: 5,
	}
}

const styles = StyleSheet.create(styleSpec);

const Footer = ({ onEdit, onDelete, onMoreTips }) => (
  <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white'}}>
  	<View style={{flex: 1}}>
	  	{onMoreTips && <Button
	    	onPress={onMoreTips}
	      	style={styles.footerControl}
	      	size='small'
	      	status='info'>
	      	MORE TIPS
	    </Button>}
   	</View>
    <View style={styles.footerContainer}>
	    <Button
	    	onPress={onEdit}
	      	style={styles.footerControl}
	      	size='small'
	      	status='basic'>
	      	EDIT
	    </Button>
	    <Button
	    	onPress={onDelete}
	      	style={styles.footerControl}
	      	status='danger'
	      	size='small'>
	      	DELETE
	    </Button>
	</View>
  </View>
);

export default function DisplayFoodItem({ foodItem, onEdit, onMoreTips, triggerDelete }) {
	const cardContent = () => {
		if (!foodItem.general) {
			return (
				<Text category='s1'>Added {foodItem.howLong()}.</Text>
			);
		} else {
			return (
				<Text category='s1'>{foodItem.general}</Text>
			)
		}
	}

	return (
		<View style={styles.card}>
			<View style={styles.cardContentWrapper}>
				{cardContent()}
			</View>
			<Footer onEdit={onEdit} onDelete={triggerDelete} onMoreTips={onMoreTips} />
		</View>
	);
}
