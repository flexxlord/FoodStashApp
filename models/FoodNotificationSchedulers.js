import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utils from '../utils';
dayjs.extend(duration);
dayjs.extend(relativeTime);


function cancelIds(scheduleIds) {
	const scheduleCancels = scheduleIds.map(scheduleId => Notifications.cancelScheduledNotificationAsync(scheduleId));
	return Promise.all(scheduleCancels);
}

class PerFoodNotificationScheduler {
	// todo - support changing schedules

	// frequencies is list of durations indicating how far before the expiration to trigger
	// e.g. [dayjs.duration(1, 'day'), dayjs.duration(7, 'day')]
	constructor(frequencies) {
		// map from fooditem uuid to handler object
		// each handler object associates frequency keys with expo schedule notification ids that can be used to cancel that id
		// e.g. { 'carrots': [{ duration: dayjs.duration(1, 'day'), scheduleId: 'xxx', ...] }
		this.handlers = new Map();

		this.frequencies = frequencies;

		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: false,
				shouldSetBadge: true,
			})
		});
	}

	async delete(fid) {
		if (this.handlers.has(fid)) {
			const scheduleIds = this.handlers.get(fid);
			try {
				await cancelIds(scheduleIds);
				this.handlers.delete(fid);
			} catch (err) {
				console.warn(`failed to delete schedule for ${fid}`, err);
			}
		} else {
			console.warn(`notificationhandlers tried to rm food id ${fid} that was not there`);
		}
	}

	async addFoodItem(foodItem) {
		const { uuid: fid, notifications, expiryDate, inferredExpiryMin, inferredExpiryMax } = foodItem;
		if (!notifications) {
			return false;
		}

		if (!this.handlers.has(fid)) {
			const toBeScheduled = [];
			if (expiryDate) {
				toBeScheduled.push({
					content: {
						title: `Reminder about your ${foodItem.name.toLowerCase()}.`,
						body: `You asked us to remind you that you have ${foodItem.quantity} of your ${utils.pluralize(foodItem.name.toLowerCase())} remaining. Tap here to look at your pantry and learn more.`
					},
					trigger: expiryDate.toDate()
				});
			} else {
				if (inferredExpiryMin) {
					toBeScheduled.push({
						content: {
							title: `Your ${foodItem.name.toLowerCase()} may be starting to expire!`,
							body: `Data suggests that your ${foodItem.quantity} ${foodItem.unit} may be starting to expire. Tap here to look at your pantry and learn more.`
						},
						trigger: inferredExpiryMin.toDate()
					});
				}
				if (inferredExpiryMax) {
					toBeScheduled.push({
						content: {
							title: `Your ${foodItem.name.toLowerCase()} may be going bad!`,
							body: `Data suggests that your ${foodItem.quantity} ${foodItem.unit} may be going bad soon. Tap here to look at your pantry and learn more.`
						},
						trigger: inferredExpiryMax.toDate()
					});
				}
			}

			// const humanDuration = tilExpiryDuration.humanize(true);
			const scheduleList = [];
			for (const notif of toBeScheduled) {
				
				if (notif.trigger >= new Date(Date.now())) {
					try {
						const scheduleId = await Notifications.scheduleNotificationAsync(notif);
						scheduleList.push(scheduleId);
					} catch (err) {
						console.warn(`setting notifications for food at time ${notif.trigger.toDateString()} failed with error`, err);
					}
				}
			}
			
			
			this.handlers.set(fid, scheduleList);

		} else {
			console.warn(`notificationhandlers tried to add food id ${fid} that was already there`);
		}
	}

	async deleteAll() {
		try {
			const allScheduleIds = [...this.handlers.values()].flat();
			await Notifications.cancelAllScheduledNotificationsAsync();
			this.handlers.clear();
		} catch (err) {
			console.warn(`failed to delete all schedules`, err);
		}
	}

	async update(item) {
		const deleteResult = await this.delete(fid);
		if (deleteResult) {
			return await this.addFoodItem(item);
		}
		return false;
	}

	async setFoodItems(foodItems) {
		try {
			await this.deleteAll();
			await Promise.all(foodItems.map(item => this.addFoodItem(item)));
		} catch (err) {
			console.warn(`error setting all food items`, err);
		}
	}
	// changeFrequencies
}

function defaultScheduler() {
	return new PerFoodNotificationScheduler([
		dayjs.duration(1, 'days'),
		dayjs.duration(0, 'days')
	])
}

export { defaultScheduler, PerFoodNotificationScheduler };