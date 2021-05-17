import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import FoodItem from '../models/FoodItem';
import { DefaultUnits, DefaultMeasurements, DefaultLocations } from '../models/constants';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button, Input, Text, Datepicker, StyleService, useStyleSheet, Tooltip, Select, SelectItem, IndexPath, Toggle } from '@ui-kitten/components';
import { QuantityAdjust } from './FoodItemHelperComponents'

const EditLabel = ({ text, help }) => {
	const [visible, setVisible] = React.useState(false);
	const styles = useStyleSheet(themedStyles);

	const renderEditLabel = () => (
		<TouchableOpacity onPress={() => setVisible(!visible)}>
			<Text style={styles.editLabel} category='s1'>{text}</Text>
		</TouchableOpacity>
	);

	return (
		<Tooltip
			anchor={renderEditLabel}
			visible={visible}
			onBackdropPress={() => setVisible(false)}
		>
			{help}
		</Tooltip>
	);
};

const titleCase = (text) => {
	if (text.length === 0) {
		return text;
	}
	return `${text.charAt(0).toUpperCase()}${text.substring(1).toLowerCase()}`;
}

const SelectWithCustom = ({ defaultValues, currentValue, fieldName, selectHelp, isCustom, customValid, onChangeCustom }) => {
	const selectValues = defaultValues.concat(['Custom']);
	const selectItems = selectValues.map(name => <SelectItem title={name} key={name} />);
	const propIndex = isCustom ? selectValues.length - 1 : selectValues.indexOf(currentValue);

	const [selectIndex, setSelectIndex] = React.useState(new IndexPath(propIndex));

	const styles = useStyleSheet(themedStyles);

	const renderCustomInput = () => {
		if (!isCustom) { return; }
		return (
			<View style={styles.cardRow}>
				<EditLabel text={`Custom ${titleCase(fieldName)}: `} help={`What you want your custom ${fieldName.toLowerCase()} type to be named`} />
				<Input
					status={customValid ? 'info': 'danger'}
					placeholder={`${titleCase(fieldName)} must not be empty!`}
					onChangeText={onChangeCustom}
					value={currentValue === 'Custom' ? '' : currentValue}
					style={styles.customInput}
				/>
			</View>
		)
	};

	return (
		<React.Fragment>
			<View style={styles.cardRow}>
				<EditLabel text={`${titleCase(fieldName)}: `} help={selectHelp}/>
				<View>
					<Select
						selectedIndex={selectIndex}
						onSelect={indexPath => {
							setSelectIndex(indexPath);
							onChangeCustom(selectValues[indexPath.row]);
						}}
						value={selectValues[selectIndex.row]}
						style={styles.unitSelect}
					>
						{selectItems}
					</Select>
				</View>
			</View>
			{renderCustomInput()}
		</React.Fragment>
	)
	
}

export default function EditFoodItem({
	height,
	foodItem,
	onChangeFoodName,
	onChangeDate,
	onIncrementQuantity,
	onDecrementQuantity,
	onChangeUnit,
	onChangeLocation,
	onChangeNotifications,
	triggerDelete,
}) {

	const styles = useStyleSheet(themedStyles);
	
	return (
		<View style={{minHeight: height}}>
			<View style={styles.cardRow}>
				<EditLabel text='Name: ' help='The name of this food.'/>			
				<Input
					status={foodItem.name.length > 0 ? 'info' : 'danger'}
					placeholder='Name must not be empty!'
					onChangeText={onChangeFoodName}
					value={foodItem.name}
					style={styles.nameInput}
				/>
			</View>
			<View style={styles.cardRow}>
				<EditLabel text='Quantity: ' help='How much of this food you have.'/>
				<QuantityAdjust
					quantity={`${foodItem.quantity} ${foodItem.unit}`}
					onIncrement={onIncrementQuantity}
					onDecrement={onDecrementQuantity}
					maxWidth='50%'
				/>
			</View>
			<SelectWithCustom
				fieldName='Unit'
				defaultValues={DefaultUnits.concat(DefaultMeasurements)}
				currentValue={foodItem.unit}
				selectHelp='What the food should be measured in.'
				isCustom={foodItem.hasCustomUnit()}
				customValid={foodItem.unit.length > 0 && foodItem.location !== 'Custom'}
				onChangeCustom={onChangeUnit}
			/>
			<SelectWithCustom
				fieldName='Location'
				defaultValues={DefaultLocations}
				currentValue={foodItem.location}
				selectHelp="Where you're storing your food."
				isCustom={foodItem.hasCustomLocation()}
				customValid={foodItem.location.length > 0 && foodItem.location !== 'Custom'}
				onChangeCustom={onChangeLocation}
			/>
			<View style={styles.cardRow}>
				<EditLabel text='Expiring: ' help='The date this food will expire.'/>
				<Datepicker
					date={foodItem.getExpiryJSDate()}
					onSelect={onChangeDate}
					placeholder='Set an expiration date'
					min={new Date()}
					status='info'
				/>
			</View>
			<View style={styles.cardRow}>
				<EditLabel text='Notifications: ' help='Whether to send notifications about this food expiring.'/>
				<Toggle
					checked={foodItem.notifications}
					onChange={onChangeNotifications}
				/>
			</View>
		</View>
	);
}

const themedStyles = StyleService.create({
	cardRow: {
		flex: 1,
		marginVertical: 6,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardQuantityAdjust: {
		flex: 0.4,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	nameInput: {
		backgroundColor: 'white',
		width: 200,
	},
	customInput: {
		backgroundColor: 'white',
		width: 150,
	},
	unitSelect: {
		width: 150
	},
	editLabel: {
		color: 'color-primary-default'
	}
});
