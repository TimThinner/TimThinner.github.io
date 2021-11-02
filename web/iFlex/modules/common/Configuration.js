export default class Configuration {
	constructor() {
		this.MOCKUP = false; // Not really supported 
		this.mongoBackend = 'http://localhost:3000';
		
		// Should we define different models with timeranges and intervals here?
		// query (interval = undefined) or rollup (interval = 'PTNNN')
		this.defaults = [
			{
				// 3 phases of building electricity and building district heating.
				// These models cover VIEWS A and B.
				model_names: ['BuildingElectricityPL1Model','BuildingElectricityPL2Model','BuildingElectricityPL3Model','BuildingHeatingQE01Model'],
				timeranges: [
					{
						name: 'TR1D',
						interval: undefined, // undefined or 'PT15M'
						timerange: {begin:{value:1,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR1W',
						interval: 'PT30M',
						timerange: {begin:{value:7,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR2W',
						interval: 'PT60M',
						timerange: {begin:{value:14,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR1M',
						interval: 'PT2H',
						timerange: {begin:{value:1,unit:'months'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR6M',
						interval: 'PT12H',
						timerange: {begin:{value:6,unit:'months'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR13M',
						interval: 'PT24H',
						timerange: {begin:{value:13,unit:'months'},end:{value:0,unit:'days'}}
					}
				]
			},
			{
				// To calculate emissions we need factor and 3 phases of building electricity + building district heating (heating factor is CONSTANT).
				// These models cover VIEW C.
				model_names: ['BuildingEmissionFactorForElectricityConsumedInFinlandModel',
					'CControllerBuildingElectricityPL1Model','CControllerBuildingElectricityPL2Model','CControllerBuildingElectricityPL3Model',
					'CControllerBuildingHeatingQE01Model'],
				timeranges: [
					{
						name: 'TR1D',
						interval: 'PT15M',
						timerange: {begin:{value:1,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR1W',
						interval: 'PT30M',
						timerange: {begin:{value:7,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR2W',
						interval: 'PT60M',
						timerange: {begin:{value:14,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR1M',
						interval: 'PT2H',
						timerange: {begin:{value:1,unit:'months'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR6M',
						interval: 'PT12H',
						timerange: {begin:{value:6,unit:'months'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR13M',
						interval: 'PT24H',
						timerange: {begin:{value:13,unit:'months'},end:{value:0,unit:'days'}}
					}
				]
			},
			{
				// Apartment Temperature, Humidity and CO2 level (ppm).
				// These models cover User Temperature VIEW.
				model_names: ['UserTemperatureModel','UserHumidityModel','UserCO2Model'],
				timeranges: [
					{
						name: 'TR1D',
						interval: undefined, // undefined or 'PT15M'
						timerange: {begin:{value:1,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR1W',
						interval: 'PT30M',
						timerange: {begin:{value:7,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR2W',
						interval: 'PT60M',
						timerange: {begin:{value:14,unit:'days'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR1M',
						interval: 'PT2H',
						timerange: {begin:{value:1,unit:'months'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR6M',
						interval: 'PT12H',
						timerange: {begin:{value:6,unit:'months'},end:{value:0,unit:'days'}}
					},
					{
						name: 'TR13M',
						interval: 'PT24H',
						timerange: {begin:{value:13,unit:'months'},end:{value:0,unit:'days'}}
					}
				]
			}
		];
	}
}
