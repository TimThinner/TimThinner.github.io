import Controller from '../common/Controller.js';
import GridPageView from './GridPageView.js';
/*
import { 
FingridElectricityProductionFinlandModel,
FingridElectricityConsumptionFinlandModel,
FingridNuclearPowerProductionFinlandModel,
FingridHydroPowerProductionFinlandModel,
FingridWindPowerProductionFinlandModel,
FingridCondensingPowerProductionFinlandModel,
FingridOtherPowerProductionFinlandModel,
FingridIndustrialCogenerationProductionFinlandModel,
FingridCogenerationDHProductionFinlandModel,
FingridSolarPowerFinlandModel,
FingridTransmissionFinlandCentralSwedenModel,
FingridTransmissionFinlandEstoniaModel,
FingridTransmissionFinlandNorthernSwedenModel,
FingridTransmissionFinlandRussiaModel,
FingridTransmissionFinlandNorwayModel
} from  '../energydata/FingridModels.js';
*/

/*
Electricity production in Finland
This data retrieves the electricity production from all powerplants.
Variable Id 192
Data Period 3 min
Unit MW

Electricity consumption in Finland
This data retrieves the electricity consumption.
Variable Id 193
Data Period 3 min
Unit MW

Nuclear power production
Variable Id 188
Data Period 3 min

Hydro power production
Hydro power production in Finland based on the real-time measurements in Fingrid's operation control system. 
Variable Id 191
The data is updated every 3 minutes

Power system state - real time data
Different states of the power system - traffic lights: 1=green, 2=yellow, 3=red, 4=black, 5=blue
- Green: Power system is in normal secure state.
- Yellow: Power system is in endangered state. The adequacy of the electricity is endangered or the power system doesn't fulfill the security standards.
- Red: Power system is in disturbed state. Load shedding has happened in order to keep the adequacy and security of the power system or there is a remarkable risk to a wide black out.
- Black: An extremely serious disturbance or a wide black out in Finland.
- Blue: The network is being restored after an extremely serious disturbance or a wide blackout
Variable Id 209
Data Period 3 min

Wind power production
Variable Id 181
Data Period 3 min

Condensing power production
Variable Id 189
Data Period 3 min

Other production inc. estimated small-scale production and reserve power plants
Variable Id 205
Data Period 3 min

Industrial cogeneration
Variable Id 202
Data Period 3 min

Cogeneration of district heating
Variable Id 201
Data Period 3 min

Solar power
Solar power generation forecast - updated hourly
Variable Id 248
Data Period 1 hour

Transmission between Finland and Central Sweden
Variable Id 89
Data Period 3 min

Transmission between Finland and Estonia
Variable Id 180
Data Period 3 min

Transmission between Finland and Northern Sweden
Variable Id 87
Data Period 3 min

Transmission between Finland and Russia
Variable Id 195
Data Period 3 min

Transmission between Finland and Norway
Variable Id 187
Data Period 3 min
*/
import FingridModel from  '../energydata/FingridModel.js';
export default class GridPageController extends Controller {
	
	constructor(options) {
		super(options);
	}
	
	remove() {
		super.remove();
		// We must remove all models that were created here at the init():
		// Currently this app does NOT remove Controllers. 
		// They are all created at the load and stay that way, so init() is called ONLY once.
		// BUT this is not how dynamic system should optimally behave.
		// So I just add model removal here, to enable this in the future.
		Object.keys(this.models).forEach(key => {
			if (key === 'FingridElectricityProductionFinlandModel' ||
				key === 'FingridElectricityConsumptionFinlandModel' ||
				key === 'FingridNuclearPowerProductionFinlandModel' ||
				key === 'FingridHydroPowerProductionFinlandModel' ||
				key === 'FingridWindPowerProductionFinlandModel' ||
				key === 'FingridOtherPowerProductionFinlandModel' ||
				key === 'FingridIndustrialCogenerationProductionFinlandModel' ||
				key === 'FingridCogenerationDHProductionFinlandModel' ||
				key === 'FingridTransmissionFinlandCentralSwedenModel' ||
				key === 'FingridTransmissionFinlandEstoniaModel' ||
				key === 'FingridTransmissionFinlandNorthernSwedenModel' ||
				key === 'FingridTransmissionFinlandRussiaModel' ||
				key === 'FingridTransmissionFinlandNorwayModel') {
				
				this.master.modelRepo.remove(key);
			}
		});
	}
	
	init() {
		const m = new FingridModel({name:'FingridElectricityProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/192/event/json'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridElectricityProductionFinlandModel',m);
		this.models['FingridElectricityProductionFinlandModel'] = m;
		
		const m2 = new FingridModel({name:'FingridElectricityConsumptionFinlandModel',src:'https://api.fingrid.fi/v1/variable/193/event/json'});
		m2.subscribe(this);
		this.master.modelRepo.add('FingridElectricityConsumptionFinlandModel',m2);
		this.models['FingridElectricityConsumptionFinlandModel'] = m2;
		
		const m3 = new FingridModel({name:'FingridNuclearPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/188/event/json'});
		m3.subscribe(this);
		this.master.modelRepo.add('FingridNuclearPowerProductionFinlandModel',m3);
		this.models['FingridNuclearPowerProductionFinlandModel'] = m3;
		
		const m4 = new FingridModel({name:'FingridHydroPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/191/event/json'});
		m4.subscribe(this);
		this.master.modelRepo.add('FingridHydroPowerProductionFinlandModel',m4);
		this.models['FingridHydroPowerProductionFinlandModel'] = m4;
		
		const m5 = new FingridModel({name:'FingridWindPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/181/event/json'});
		m5.subscribe(this);
		this.master.modelRepo.add('FingridWindPowerProductionFinlandModel',m5);
		this.models['FingridWindPowerProductionFinlandModel'] = m5;
		/*
		const m6 = new FingridCondensingPowerProductionFinlandModel({name:'FingridCondensingPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/189/event/json'});
		m6.subscribe(this);
		this.master.modelRepo.add('FingridCondensingPowerProductionFinlandModel',m6);
		this.models['FingridCondensingPowerProductionFinlandModel'] = m6;
		*/
		const m7 = new FingridModel({name:'FingridOtherPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/205/event/json'});
		m7.subscribe(this);
		this.master.modelRepo.add('FingridOtherPowerProductionFinlandModel',m7);
		this.models['FingridOtherPowerProductionFinlandModel'] = m7;
		
		const m8 = new FingridModel({name:'FingridIndustrialCogenerationProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/202/event/json'});
		m8.subscribe(this);
		this.master.modelRepo.add('FingridIndustrialCogenerationProductionFinlandModel',m8);
		this.models['FingridIndustrialCogenerationProductionFinlandModel'] = m8;
		
		const m9 = new FingridModel({name:'FingridCogenerationDHProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/201/event/json'});
		m9.subscribe(this);
		this.master.modelRepo.add('FingridCogenerationDHProductionFinlandModel',m9);
		this.models['FingridCogenerationDHProductionFinlandModel'] = m9;
		
		/*
		NOTE: In SOLAR FORECAST case we are giving here just a base src address, it will be appended with start_time and end_time, like this:
		https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T15:00:00Z&end_time=2021-05-16T15:00:00Z
		*/
		//const m10 = new FingridSolarPowerFinlandModel({name:'FingridSolarPowerFinlandModel',src:'https://api.fingrid.fi/v1/variable/248/events/json?'});
		//m10.subscribe(this);
		//this.master.modelRepo.add('FingridSolarPowerFinlandModel',m10);
		//this.models['FingridSolarPowerFinlandModel'] = m10;
		
		const m11 = new FingridModel({name:'FingridTransmissionFinlandCentralSwedenModel',src:'https://api.fingrid.fi/v1/variable/89/event/json'});
		m11.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandCentralSwedenModel',m11);
		this.models['FingridTransmissionFinlandCentralSwedenModel'] = m11;
		
		const m12 = new FingridModel({name:'FingridTransmissionFinlandEstoniaModel',src:'https://api.fingrid.fi/v1/variable/180/event/json'});
		m12.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandEstoniaModel',m12);
		this.models['FingridTransmissionFinlandEstoniaModel'] = m12;
		
		const m13 = new FingridModel({name:'FingridTransmissionFinlandNorthernSwedenModel',src:'https://api.fingrid.fi/v1/variable/87/event/json'});
		m13.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandNorthernSwedenModel',m13);
		this.models['FingridTransmissionFinlandNorthernSwedenModel'] = m13;
		
		const m14 = new FingridModel({name:'FingridTransmissionFinlandRussiaModel',src:'https://api.fingrid.fi/v1/variable/195/event/json'});
		m14.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandRussiaModel',m14);
		this.models['FingridTransmissionFinlandRussiaModel'] = m14;
		
		const m15 = new FingridModel({name:'FingridTransmissionFinlandNorwayModel',src:'https://api.fingrid.fi/v1/variable/187/event/json'});
		m15.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandNorwayModel',m15);
		this.models['FingridTransmissionFinlandNorwayModel'] = m15;
		
		
		
		
		this.models['FingridPowerSystemStateModel'] = this.master.modelRepo.get('FingridPowerSystemStateModel');
		this.models['FingridPowerSystemStateModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.timers['GridPageChartView'] = {timer: undefined, interval: 180000, // 3 minute interval
			models:[ /* 14 models */
				'FingridPowerSystemStateModel',
				'FingridElectricityProductionFinlandModel',
				'FingridElectricityConsumptionFinlandModel',
				'FingridNuclearPowerProductionFinlandModel',
				'FingridHydroPowerProductionFinlandModel',
				'FingridWindPowerProductionFinlandModel',
				'FingridOtherPowerProductionFinlandModel',
				'FingridIndustrialCogenerationProductionFinlandModel',
				'FingridCogenerationDHProductionFinlandModel',
				'FingridTransmissionFinlandCentralSwedenModel',
				'FingridTransmissionFinlandEstoniaModel',
				'FingridTransmissionFinlandNorthernSwedenModel',
				'FingridTransmissionFinlandRussiaModel',
				'FingridTransmissionFinlandNorwayModel'
			]};
		this.view = new GridPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
