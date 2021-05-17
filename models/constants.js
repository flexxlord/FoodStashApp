
const ExpiryState = {
	EXPIRED: 'expired',
	EXPIRING_TODAY: 'expiring_today',
	EXPIRING_THIS_WEEK: 'expiring_this_week',
	EXPIRING_AFTER_WEEK: 'expiring_after_week'
};

const DefaultUnits = [
	'items',
	'bottles',
	'pieces',
	'bunches',
	'jars',
	'loaves',
	'cartons',
	'servings',
	'bags',
	'boxes',
	'containers',
];

const DefaultMeasurements = [
	'ounces',
	'grams',
	'pounds',
	'kilograms',
	'cups',
	'millileters',
	'gallons',
	'liters'
];

const DefaultLocations = [
	'fridge',
	'pantry',
	'cupboard',
	'counter',
];

export { ExpiryState, DefaultUnits, DefaultMeasurements, DefaultLocations };