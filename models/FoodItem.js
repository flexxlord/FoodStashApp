import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

import { default as foodInfo } from '../foods.json';
import utils from '../utils';

import { ExpiryState, DefaultUnits, DefaultMeasurements, DefaultLocations } from './constants';

export default class FoodItem {

	constructor({ name, quantity, originationDate, expiryDate, uuid, unit, location, notifications, tips, general, category }) {
		if (name == null || quantity == null) {
			throw new Error('Name and quantity must not be null when creating FoodItem');
		}
		this.name = name;
		this.quantity = quantity;

		this.originationDate = originationDate || dayjs();

		this.unit = unit || 'items';
		this.location = location || 'fridge';

		this.uuid = uuid || this.genUUID();

		this.notifications = notifications != null ? notifications : true;
		this.expiryDate = expiryDate || null;

		// always recompute these for now
		this.tips = [];
		this.general = '';
		this.category = '';
		this.inferredExpiryMin = null;
		this.inferredExpiryMax = null;

		const info = foodInfo.find(item => {
			return utils.pluralize(item.name.toLowerCase()) === utils.pluralize(name.toLowerCase());
		});
			
		if (info) {

			if (info.tips) {
				this.general = info.tips;
			}
			if (info['proper storage']) {
				this.tips.push({ type: 'Storage', text: info['proper storage'] });
			}
			if (info['expiration']) {
				this.tips.push({ type: 'Expires', text: info['expiration'] });
			}
			if (info['determine ripeness']) {
				this.tips.push({ type: 'Determine', text: info['determine ripeness'] });
			}
			if (info['ripen']) {
				this.tips.push({ type: 'Ripening', text: info['ripen'] });
			}
			if (info['category']) {
				this.category = info['category'];
			}
			if (info.expiration) {
				const parsedRange = utils.parseFoodDateRange(info.expiration);
				if (parsedRange) {
					if (parsedRange.minTime) {
						this.inferredExpiryMin = this.originationDate.add(parsedRange.minTime);
					}
					if (parsedRange.maxTime) {
						this.inferredExpiryMax = this.originationDate.add(parsedRange.maxTime);
					}
				}
			}
		}
	}

	genUUID() {
		return `${this.name}_${this.originationDate.format()}_${dayjs().format()}_${Math.random()}`;
	}

	resetUUID() {
		this.uuid = this.genUUID();
	}

	toJSON() {
		return {
			name: this.name,
			quantity: this.quantity,
			unit: this.unit,
			location: this.location,
			originationDate: this.originationDate.format(),
			expiryDate: this.expiryDate ? this.expiryDate.format() : null,
			// inferredExpiryMin: this.inferredExpiryMin ? this.inferredExpiryMin.format() : null,
			// inferredExpiryMax: this.inferredExpiryMax ? this.inferredExpiryMax.format() : null,
			uuid: this.uuid,
			notifications: this.notifications,
			// general: this.general,
			// tips: this.tips,
			// category: this.category,
		};
	}

	static fromJSON({ name, quantity, originationDate, expiryDate, uuid, unit, location, notifications, general, tips, category, inferredExpiryMin, inferredExpiryMax }) {
		return new FoodItem({
			name: name,
			quantity: quantity,
			unit: unit,
			location: location,
			originationDate: dayjs(originationDate),
			expiryDate: expiryDate ? dayjs(expiryDate) : null,
			// inferredExpiryMin: inferredExpiryMin ? dayjs(inferredExpiryMin) : null,
			// inferredExpiryMax: inferredExpiryMax ? dayjs(inferredExpiryMax) : null,
			uuid: uuid,
			notifications: notifications,
			// general: general,
			// tips: tips,
			// category: category
		});
	}

	isValid() {
		return this.name.length > 0 && this.unit.length > 0 && this.unit !== 'Custom' && this.location.length > 0 && this.location !== 'Custom';
	}

	hasCustomUnit() {
		return !(DefaultMeasurements.includes(this.unit)) && !(DefaultUnits.includes(this.unit));
	}

	hasCustomLocation() {
		return !DefaultLocations.includes(this.location);
	}

	howLong() {
		return this.originationDate.fromNow();
	}

	getExpiryJSDate() {
		return this.expiryDate && this.expiryDate.toDate();
	}

	getDayBeforeJSDate() {
		return this.expiryDate && this.expiryDate.subtract(1, 'day').toDate();
	}

	setExpiryFromJSDate(jsDate) {
		this.expiryDate = dayjs(jsDate);
	}

	expiryPrettyDate() {
		return this.expiryDate && this.expiryDate.format('MMM D (dddd)');
	}

	expiryFromNow() {
		return this.expiryDate && this.expiryDate.fromNow();
	}

	expiryState() {
		if (!this.expiryDate) {
			return false;
		}
		const expiryDays = this.expiryDate.diff(dayjs(), 'day');
		const expiryHours = this.expiryDate.diff(dayjs(), 'hour');
		if (expiryDays === 0 && expiryHours <= 0) {
			return ExpiryState.EXPIRED;
		} else if (expiryDays === 0 && expiryHours > 0) {
			return ExpiryState.EXPIRING_TODAY;
		} else if (expiryDays < 7) {
			return ExpiryState.EXPIRING_THIS_WEEK;
		} else {
			return ExpiryState.EXPIRING_AFTER_WEEK;
		}
	}
}