import FingridModel from './FingridModel.js';

/*
Electricity production in Finland
This data retrieves the electricity production from all powerplants.
Variable Id 192
Data Period 3 min
Unit MW
*/
export class FingridElectricityProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Electricity consumption in Finland
This data retrieves the electricity consumption.
Variable Id 193
Data Period 3 min
Unit MW
*/
export class FingridElectricityConsumptionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Nuclear power production
Variable Id 188
Data Period 3 min
*/
export class FingridNuclearPowerProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Hydro power production
Hydro power production in Finland based on the real-time measurements in Fingrid's operation control system. 
The data is updated every 3 minutes
*/
export class FingridHydroPowerProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Power system state - real time data
Different states of the power system - traffic lights: 1=green, 2=yellow, 3=red, 4=black, 5=blue
- Green: Power system is in normal secure state.
- Yellow: Power system is in endangered state. The adequacy of the electricity is endangered or the power system doesn't fulfill the security standards.
- Red: Power system is in disturbed state. Load shedding has happened in order to keep the adequacy and security of the power system or there is a remarkable risk to a wide black out.
- Black: An extremely serious disturbance or a wide black out in Finland.
- Blue: The network is being restored after an extremely serious disturbance or a wide blackout

Variable Id 209
Data Period 3 min

*/
export class FingridPowerSystemStateModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Wind power production
Variable Id 181
Data Period 3 min
*/
export class FingridWindPowerProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Condensing power production
Variable Id 189
Data Period 3 min
*/
/*export class FingridCondensingPowerProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}*/
/*
Other production inc. estimated small-scale production and reserve power plants
Variable Id 205
Data Period 3 min
*/
export class FingridOtherPowerProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Industrial cogeneration
Variable Id 202
Data Period 3 min
*/
export class FingridIndustrialCogenerationProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Cogeneration of district heating
Variable Id 201
Data Period 3 min
*/
export class FingridCogenerationDHProductionFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Solar power
Solar power generation forecast - updated hourly
Variable Id 248
Data Period 1 hour
*/
export class FingridSolarPowerFinlandModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Transmission between Finland and Central Sweden
Variable Id 89
Data Period 3 min
*/
export class FingridTransmissionFinlandCentralSwedenModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Transmission between Finland and Estonia
Variable Id 180
Data Period 3 min
*/
export class FingridTransmissionFinlandEstoniaModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Transmission between Finland and Northern Sweden
Variable Id 87
Data Period 3 min
*/
export class FingridTransmissionFinlandNorthernSwedenModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Transmission between Finland and Russia
Variable Id 195
Data Period 3 min
*/
export class FingridTransmissionFinlandRussiaModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
/*
Transmission between Finland and Norway
Variable Id 187
Data Period 3 min
*/
export class FingridTransmissionFinlandNorwayModel extends FingridModel {
	constructor(options) {
		super(options);
	}
}
