import * as React from 'react';
import { View, Text, InteractionManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useFocusEffect } from '@react-navigation/native';

import AppModel from '../models/AppModel';
import FoodItemsListView from '../components/FoodItemsListView';
import FoodListHeaderBar from '../components/FoodListHeaderBar';
import FoodItemListControls from '../components/FoodItemListControls';
import { Layout, Tab, TabBar, Modal, Spinner, Card } from '@ui-kitten/components';

import Fuse from 'fuse.js';

export default function FoodListScreen({ navigation, route }) {


	const [initialLoaded, setInitialLoaded] = React.useState(false);
	const [tabNames, setTabNames] = React.useState(['all', ...AppModel.foodItems.getAllLocations()]);
	const [tabIndex, setTabIndex] = React.useState(0);
	// const [sort, setSort] = React.useState('Date added');
	
	const selectValues = ['Date Added', 'Expiration Date'];
	const [sortSelection, setSortSelection] = React.useState('Date Added')

	const [listControlModalVisible, setListControlModalVisible] = React.useState(false);
	const [searchText, setSearchText] = React.useState('');

	const [refreshIndex, setRefreshIndex] = React.useState(0);
	const [refreshedFromNav, setRefreshedFromNav] = React.useState(false);

	const updateTabNames = () => {
		const newTabNames = ['all', ...AppModel.foodItems.getAllLocations()];
		setTabNames(newTabNames);
		setTabIndex(Math.min(tabIndex, newTabNames.length - 1));
	};

	if (route.params && route.params.update) {
		if (!refreshedFromNav) {
			setRefreshIndex(refreshIndex + 1);
			updateTabNames();
			setRefreshedFromNav(true);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			if (!initialLoaded && !AppModel.loadedFromStorage) {
				AppModel.loadFoodsFromLocalStorage().then(() => {
					setInitialLoaded(true);
					AppModel.loadedFromStorage = true;
				});
			}

			setRefreshIndex(refreshIndex + 1);
			updateTabNames();

			InteractionManager.setDeadline(2000);
		    InteractionManager.runAfterInteractions({
		      gen: () => {
		      	return Promise.all([
		      		AppModel.saveFoodsToLocalStorage(),
		        	AppModel.foodItems.refreshNotifications()
		        ]);
		      }
		    });

			return () => {};
		}, [])
	);

	const getCurrentItems = () => {
		let current = [...AppModel.foodItems.getFoodItemsAtLocation(tabNames[tabIndex])];

		if (searchText.length > 0) {
			const names = current.map(item => item.name)
			const fuse = new Fuse(names, {
				includeScore: false,
				threshold: 0.3
			});

			const matchNames = fuse.search(searchText);
			current = matchNames.map(match => current.find(item => item.name === match.item))
		} else {

			current.sort((a, b) => {
				if (sortSelection === 'Date Added') {
					return a.originationDate.diff(b.originationDate);
				} else {
					if (a.expiryDate && b.expiryDate) {
						return a.expiryDate.diff(b.expiryDate);
					} else if (a.expiryDate) {
						return -1;
					} else if (b.expiryDate) {
						return 1;
					} else {
						return 0;
					}
				}
			});
		}

		return current;
	}

	const removeAllCurrentItems = () => {
		AppModel.foodItems.clear();
		setRefreshIndex(refreshIndex + 1);
		updateTabNames();
		InteractionManager.runAfterInteractions({
	      gen: () => Promise.all([
				AppModel.saveFoodsToLocalStorage(),
				AppModel.foodItems.refreshNotifications()
			])
	    });
	}

				// <TabBar
			// 	selectedIndex={tabIndex}
			// 	onSelect={index => setTabIndex(index)}
			// 	style={{marginVertical: 10}}
			// >
			// 	{tabNames.map(name => <Tab title={name.toUpperCase()} key={name}/>)}
			// </TabBar>

	return (
		<Layout style={{ flex: 1, width: '100%', height: '100%' }}>
			<FoodListHeaderBar
				searchText={searchText} 
				onSearchTextChange={setSearchText}
				onControlsPress={() => { setListControlModalVisible(true); }}
				// onSelectChange={(name) => setSort(name)}
				removeAllCurrentItems={removeAllCurrentItems}
			/>
			<FoodItemsListView
				foodItems={getCurrentItems}
				onCardPress={() => navigation.navigate('ItemDetail')}
				selectedLocation={tabNames[tabIndex]}
				updateTabNames={updateTabNames}
				refreshIndex={refreshIndex}
				openTips={(foodItem) => navigation.navigate('MoreTips', { tips: foodItem.tips, name: foodItem.name })}
			/>
			<Modal
				visible={listControlModalVisible}
		        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
		        onBackdropPress={() => {}}
		        style={{
		        	width: '80%'
		        }}
		    >
		        <FoodItemListControls
					removeAllCurrentItems={removeAllCurrentItems}
		        	onSortSelectChange={(newSelection) => setSortSelection(newSelection)}
		        	onAccept={() => setListControlModalVisible(false)}
					selectValues={selectValues}
					initialSortSelection={sortSelection}
		        />
			</Modal>
			<Modal
				visible={!initialLoaded}
				backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
				<Card disabled={true}>
					<Text style={{ fontFamily: "Poppins_600SemiBold" }}>
						Loading your foods...
					</Text>
					<View
				    	style={{
							flex: 1,
				      		flexDirection: "row",
				      		justifyContent: "center",
				      		marginTop: 10,
				    	}}
				  	>
				    	<Spinner />
				  	</View>
				</Card>
			</Modal>
		</Layout>
	)
}