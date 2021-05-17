import FoodItem from "./FoodItem";
import FoodItemList from "./FoodItemList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default class AppModel {
	constructor(props) {
		throw new Error('DON"T CALL THIS CONSTRUCTOR ITS JUST STATIC');
	}

	static foodItems = new FoodItemList();
	static userInfo  = {
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		password: ""
	};

	static async loadFoodsFromLocalStorage() {
		try {
			const foodJSON = JSON.parse(await AsyncStorage.getItem("foodItemList"));
			if (foodJSON == null) {
				AppModel.foodItems = new FoodItemList();
			} else {
				AppModel.foodItems = FoodItemList.fromJSON(foodJSON);
			}
		} catch (err) {
			console.log(err);
			AppModel.foodItems = new FoodItemList();
		}
		return AppModel.foodItems;
	}


	static async loadUserFromSecureStore() {
		try {
			const userJSON = JSON.parse(await SecureStore.getItemAsync("userInfo"));
			if (userJSON == null) {
				AppModel.userInfo = {
					firstName: "",
					lastName: "",
					email: "",
					phoneNumber: "",
					password: ""
				};
			} else {
				AppModel.userInfo = userJSON;
			}
		} catch (err) {
			console.log(err);
			AppModel.userInfo = {
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				password: ""
			};
		}
		return AppModel.userInfo;
	}

	static async saveFoodsToLocalStorage() {
		try {
			const jsonRep = JSON.stringify(AppModel.foodItems.toJSON());

			await AsyncStorage.setItem("foodItemList", jsonRep);
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}

	static async saveUserToSecureStore() {
		try {
			await SecureStore.setItemAsync("userInfo", JSON.stringify(AppModel.userInfo));
			return true;
		} catch (err) {
			console.warn(err);
			return false;
		}
	}

	static addTestItems() {
		AppModel.foodItems.setFoodItemsFromSpec([
			{ name: "Apples", quantity: 4 },
			{ name: "Bananas", quantity: 2, expiryNumDays: 3 },
			{ name: "Grapes", quantity: 10, expiryNumDays: 0, unit: "bunches" },
		]);
	}
}
