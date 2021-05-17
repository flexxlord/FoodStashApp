import dayjs from 'dayjs';

const utils = {
	titleCase: (text) => {
		if (text.length === 0) {
			return text;
		}
		return `${text.charAt(0).toUpperCase()}${text.substring(1).toLowerCase()}`;
	},
	pluralize: (text) => {
		return text.endsWith('s') ? text : text + 's'
	},
	parseFoodDateRange: (text) => {
		try {
			if (text.includes(' to ')) {
				const [start, to, end, unit] = text.split(' ');
				const unitPlural = unit.endsWith('s') ? unit : unit + 's';

				return {
					minTime: dayjs.duration({ [unitPlural]: parseInt(start, 10) }),
					maxTime: dayjs.duration({ [unitPlural]: parseInt(end, 10) }),
				};
			} else {
				const [end, unit] = text.split(' ');
				const unitPlural = unit.endsWith('s') ? unit : unit + 's';

				return {
					maxTime: dayjs.duration({ [unitPlural]: parseInt(end, 10) })
				};
			}
		} catch (err) {
			console.warn(err);
			return null;
		}
	}
}

export default utils;