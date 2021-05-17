import * as React from 'react';
import { StyleSheet, View, StatusBar, NativeModules, LayoutAnimation, InteractionManager, Image } from 'react-native';
import FoodItemCard from './FoodItemCard';

import baseStyles from '../styling/base-styles';
// import { Ionicons } from '@expo/vector-icons';

import { List, Divider, Text, Modal, Card, Button, ButtonGroup } from '@ui-kitten/components';

import AppModel from '../models/AppModel';
import NotificationService from '../services/notifications';

import { Poppins_600SemiBold } from "@expo-google-fonts/poppins";

// const { UIManager } = NativeModules;

// UIManager.setLayoutAnimationEnabledExperimental &&
//   UIManager.setLayoutAnimationEnabledExperimental(true);

const styles = StyleSheet.create({
	container: {
		padding: 10,
		width: '90%',
		backgroundColor: 'green'
	},
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	modalItemName: {
		fontWeight: 'bold',
		color: '#D73008'
	}
});

export default class FoodItemsListView extends React.Component {
	
	state = {
	  	editingIndex: -1,
	  	refresh: 0,
	  	deleteModalVisible: false,
	  	deleteModalIndex: -1,
	};

	handleCardPress = (index) => {
		// LayoutAnimation.configureNext({
		// 	duration: 300,
		// 	create: {
		// 		type: LayoutAnimation.Types.easeInEaseOut,
		// 	},
		// 	update: {
		// 		type: LayoutAnimation.Types.easeInEaseOut,
		// 	}
		// });
		if (this.state.editingIndex === index) {
			this.setState({ editingIndex: -1 });
		} else {
			this.setState({ editingIndex: index });
		}
	}

	triggerRefresh() {
		this.setState({ refresh: this.state.refresh + 1 });
		InteractionManager.setDeadline(2000);
	    InteractionManager.runAfterInteractions({
	      gen: async () => {
	        await Promise.all([
	      		AppModel.saveFoodsToLocalStorage(),
	        	AppModel.foodItems.refreshNotifications()
	        ])
	      }
	    });
	}

	componentDidMount() {
		this.triggerRefresh();
	}

	componentDidMount() {
		this.triggerRefresh();
	}

	closeModal(shouldDelete) {
		if (shouldDelete) {
			AppModel.foodItems.deleteId(this.state.deleteModalItemUUID);
			this.props.updateTabNames();
		}
		this.setState({
			deleteModalVisible: false,
			deleteModalItemUUID: null
		});
		this.triggerRefresh();
	}

	renderItem = ({ item, index }) => {

		const triggerDelete = () => {
			this.setState({
				deleteModalVisible: true,
				deleteModalItemUUID: item.uuid,
			});
		};

		const changeHandlers = {
			onChangeFoodName: (newName) => {
				item.name = newName;
				this.triggerRefresh();
			},
			onIncrementQuantity: () => {
				item.quantity += 1;
				this.triggerRefresh();
			},
			onDecrementQuantity: () => {
				if (item.quantity === 1) {
					triggerDelete();
				} else {
					item.quantity -= 1;
					this.triggerRefresh();
				}
			},
			onChangeDate: (newDate) => {
				item.setExpiryFromJSDate(newDate);
				this.triggerRefresh();
			},
			onChangeUnit: (newUnit) => {
				item.unit = newUnit;
				this.triggerRefresh();
			},
			onChangeLocation: (newLocation) => {
				item.location = newLocation;
				this.triggerRefresh();
				this.props.updateTabNames();
			},
			onChangeNotifications: (newNotificationState) => {
				item.notifications = newNotificationState;
				this.triggerRefresh();
			}
		}
		
		return (
			<FoodItemCard
				foodItem={item}
				onPress={() => this.handleCardPress(index)}
				isFirst={index === 0}
				isOpen={() => index === this.state.editingIndex}
				onMoreTips={item.tips.length > 0 ? () => this.props.openTips(item) : null}
				changeHandlers={changeHandlers}
				triggerDelete={triggerDelete}
			/>
		);
	}

	render() {
		if (AppModel.foodItems.isEmpty()) {
			return (
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: 30}}>
					<Image
						style={{ flex: 1, opacity: 0.5 }}
				        source={require('../assets/cryingorange.png')}
				        resizeMode='contain'
				    />
				    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50, opacity: 0.7 }}>
				    	<Text category='h6'>No foods in your pantry yet! Tap 'Add Item' to add an item or 'Receipt' to scan your receipt!</Text>
				    </View>
				</View>
			)
		} else if (this.props.foodItems().length === 0) {
			return (
				<View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: 30}}>
				    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50, opacity: 0.7 }}>
				    	<Text category='h6'>No foods match the  current filter. </Text>
				    </View>
				</View>
			)
		}
		const getDeleteName = () => {
			if (this.state.deleteModalItemUUID != null) {
				return AppModel.foodItems.itemWithId(this.state.deleteModalItemUUID).name;
			}
			return '';
		};

		return (
			<View style={baseStyles.containerView}>
				<List
					data={this.props.foodItems()}
					extraData={{...this.state, refreshParent: this.props.refreshIndex}}
					ItemSeparatorComponent={Divider}
					renderItem={this.renderItem}
					keyExtractor={item => item.uuid}
				/>
				<Modal
					visible={this.state.deleteModalVisible}
					backdropStyle={styles.backdrop}
				>
					<Card disabled={true}>
						<Text style={{ fontFamily: "Poppins_600SemiBold" }}> Are you ready to remove <Text style={styles.modalItemName}>{getDeleteName()}</Text> from your pantry?</Text>
						<View style={{flex: 1, flexDirection: 'row', marginTop: 20, justifyContent: 'space-around', alignItems: 'center'}}>
							<Button style={{margin: 10}} onPress={() => this.closeModal(false)}>Not yet...</Button>
							<Button style={{margin: 10}} onPress={() => this.closeModal(true)}>Yes!</Button>
						</View>
					</Card>
				</Modal>

			</View>
		)
	}
}
