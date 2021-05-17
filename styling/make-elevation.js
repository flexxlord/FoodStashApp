export default function makeElevation(elevation) {
	const iosShadowElevation = {
	    shadowOpacity: 0.0015 * elevation + 0.18,
	    shadowRadius: 0.5 * elevation,
	    shadowOffset: {
	        height: 0.6 * elevation,
	    },
	};
	const androidShadowElevation = {
	    elevation,
	};
	return Platform.OS === 'ios' ? iosShadowElevation : androidShadowElevation;
}