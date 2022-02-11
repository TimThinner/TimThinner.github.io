export default class Configuration {
	constructor() {
		this.backend = 'https://makingcity.vtt.fi';
		this.mongoBackend = 'http://localhost:3000';
		// NOTE: When this is copied to server, use following setting:
		// this.mongoBackend = 'https://makingcity.vtt.fi/authtest/data';
		// 
		// webpage is accessed from:
		// https://makingcity.vtt.fi/authtest/auth/index.html
		//
		this.DEFAULTS = {
			'price_energy_monthly'  : 10.0,
			'price_energy_basic'    :  4.5,
			'price_energy_transfer' :  4.5,
			'heating_temperature_upper'  : 24.0,
			'heating_target_temperature' : 22.0,
			'heating_temperature_lower'  : 20.0,
			'heating_humidity_upper'     : 45,
			'heating_target_humidity'    : 40,
			'heating_humidity_lower'     : 35,
			'water_hot_upper'   : 400,
			'water_hot_target'  : 300,
			'water_hot_lower'   : 100,
			'water_cold_upper'  : 500,
			'water_cold_target' : 400,
			'water_cold_lower'  : 200,
			'energy_upper'   : 60,
			'energy_target'  : 40,
			'energy_lower'   : 20
		};
	}
}
