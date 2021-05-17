import FoodItem from './FoodItem';
import * as Scheduling from './FoodNotificationSchedulers';

export default class FoodItemList {
	constructor(foodItems = [], scheduler = null) {
		this.foodItems = foodItems;
		this.notificationScheduler = scheduler || Scheduling.defaultScheduler();
	}

	numItems() {
		return this.foodItems.length;
	}

	isEmpty() {
		return this.foodItems.length === 0;
	}

	deleteAt(index) {
		const foodItem = this.foodItems[index];
		this.foodItems.splice(index, 1);
		// return this.notificationScheduler.delete(foodItem.uuid);
	}

	deleteId(uuid) {
		const ind = this.foodItems.findIndex(item => item.uuid === uuid);
		if (ind !== -1) {
			this.deleteAt(ind);
		}
	}

	clear() {
		this.foodItems = [];
		// return this.notificationScheduler.deleteAll();
	}

	at(index) {
		return this.foodItems[index];
	}

	itemWithId(uuid) {
		return this.foodItems.find(item => item.uuid === uuid);
	}

	addFoodItem(foodItem) {
		this.foodItems.push(foodItem);
		// return this.notificationScheduler.addFoodItem(foodItem);
	}

	addFoodItemFromSpec(spec) {
		const foodItem = new FoodItem(spec);
		this.foodItems.push(foodItem);
		// return this.notificationScheduler.addFoodItem(foodItem);
	}

	getFoodItems() {
		return this.foodItems;
	}

	getFoodItemsAtLocation(location) {
		if (location.toLowerCase() === 'all') {
			return this.foodItems;
		}
		return this.foodItems.filter(item => item.location.toLowerCase() === location.toLowerCase());
	}

	getAllLocations() {
		const locations = this.foodItems.map(item => item.location);
		return [...new Set(locations)];
	}

	setFoodItems(foodItems) {
		this.foodItems = foodItems;
		// return this.notificationScheduler.setFoodItems(this.foodItems);
	}

	setFoodItemsFromSpec(specs) {
		this.foodItems = specs.map(spec => new FoodItem(spec));
		// return this.notificationScheduler.setFoodItems(this.foodItems);
	}

	addFoodItems(foodItems) {
		this.foodItems.push(...foodItems);
		// return this.notificationScheduler.setFoodItems(this.foodItems);
	}

	addFoodItemsFromSpec(specs) {
		this.foodItems.push(...specs.map(spec => new FoodItem(spec)));
		// return this.notificationScheduler.setFoodItems(this.foodItems);
	}

	mergeInFoodItems(toMerge) {
		toMerge.forEach(item => {
			const match = this.foodItems.find(existing => existing.name.toLowerCase() === item.name.toLowerCase());
			if (match) {
				match.quantity += item.quantity;
			} else {
				this.foodItems.push(item);
			}
		})
	}

	refreshNotifications() {
		return this.notificationScheduler.setFoodItems(this.foodItems);
	}

	toJSON() {
		return this.foodItems.map(item => item.toJSON());
	}

	static fromJSON(foodItemsData) {
		return new FoodItemList(foodItemsData.map(itemData => FoodItem.fromJSON(itemData)));
	}
}