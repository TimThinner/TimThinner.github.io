import Controller from '../common/Controller.js';
import GridPageView from './GridPageView.js';
import { 
/*1*/ FingridElectricityProductionFinlandModel,
/*2*/ FingridElectricityConsumptionFinlandModel,
/*3*/ FingridNuclearPowerProductionFinlandModel,
/*4*/ FingridHydroPowerProductionFinlandModel,
/*5*/ FingridWindPowerProductionFinlandModel,
/* FingridCondensingPowerProductionFinlandModel,*/
/*7*/ FingridOtherPowerProductionFinlandModel,
/*8*/ FingridIndustrialCogenerationProductionFinlandModel,
/*9*/ FingridCogenerationDHProductionFinlandModel,
/*10*/ FingridSolarPowerFinlandModel,
/*11*/ FingridTransmissionFinlandCentralSwedenModel,
/*12*/ FingridTransmissionFinlandEstoniaModel,
/*13*/ FingridTransmissionFinlandNorthernSwedenModel,
/*14*/ FingridTransmissionFinlandRussiaModel,
/*15*/ FingridTransmissionFinlandNorwayModel
} from  '../fingrid/FingridModels.js';

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
				//key === 'FingridCondensingPowerProductionFinlandModel' ||
				key === 'FingridOtherPowerProductionFinlandModel' ||
				key === 'FingridIndustrialCogenerationProductionFinlandModel' ||
				key === 'FingridCogenerationDHProductionFinlandModel' ||
				key === 'FingridSolarPowerFinlandModel' ||
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
		const m = new FingridElectricityProductionFinlandModel({name:'FingridElectricityProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/192/event/json'});
		m.subscribe(this);
		this.master.modelRepo.add('FingridElectricityProductionFinlandModel',m);
		this.models['FingridElectricityProductionFinlandModel'] = m;
		
		const m2 = new FingridElectricityConsumptionFinlandModel({name:'FingridElectricityConsumptionFinlandModel',src:'https://api.fingrid.fi/v1/variable/193/event/json'});
		m2.subscribe(this);
		this.master.modelRepo.add('FingridElectricityConsumptionFinlandModel',m2);
		this.models['FingridElectricityConsumptionFinlandModel'] = m2;
		
		const m3 = new FingridNuclearPowerProductionFinlandModel({name:'FingridNuclearPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/188/event/json'});
		m3.subscribe(this);
		this.master.modelRepo.add('FingridNuclearPowerProductionFinlandModel',m3);
		this.models['FingridNuclearPowerProductionFinlandModel'] = m3;
		
		const m4 = new FingridHydroPowerProductionFinlandModel({name:'FingridHydroPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/191/event/json'});
		m4.subscribe(this);
		this.master.modelRepo.add('FingridHydroPowerProductionFinlandModel',m4);
		this.models['FingridHydroPowerProductionFinlandModel'] = m4;
		
		const m5 = new FingridWindPowerProductionFinlandModel({name:'FingridWindPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/181/event/json'});
		m5.subscribe(this);
		this.master.modelRepo.add('FingridWindPowerProductionFinlandModel',m5);
		this.models['FingridWindPowerProductionFinlandModel'] = m5;
		/*
		const m6 = new FingridCondensingPowerProductionFinlandModel({name:'FingridCondensingPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/189/event/json'});
		m6.subscribe(this);
		this.master.modelRepo.add('FingridCondensingPowerProductionFinlandModel',m6);
		this.models['FingridCondensingPowerProductionFinlandModel'] = m6;
		*/
		const m7 = new FingridOtherPowerProductionFinlandModel({name:'FingridOtherPowerProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/205/event/json'});
		m7.subscribe(this);
		this.master.modelRepo.add('FingridOtherPowerProductionFinlandModel',m7);
		this.models['FingridOtherPowerProductionFinlandModel'] = m7;
		
		const m8 = new FingridIndustrialCogenerationProductionFinlandModel({name:'FingridIndustrialCogenerationProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/202/event/json'});
		m8.subscribe(this);
		this.master.modelRepo.add('FingridIndustrialCogenerationProductionFinlandModel',m8);
		this.models['FingridIndustrialCogenerationProductionFinlandModel'] = m8;
		
		const m9 = new FingridCogenerationDHProductionFinlandModel({name:'FingridCogenerationDHProductionFinlandModel',src:'https://api.fingrid.fi/v1/variable/201/event/json'});
		m9.subscribe(this);
		this.master.modelRepo.add('FingridCogenerationDHProductionFinlandModel',m9);
		this.models['FingridCogenerationDHProductionFinlandModel'] = m9;
		
		
		/*
		NOTE: In SOLAR FORECAST case we are giving here just a base src address, it will be appended with start_time and end_time, like this:
		https://api.fingrid.fi/v1/variable/248/events/json?start_time=2021-05-14T15:00:00Z&end_time=2021-05-16T15:00:00Z
		*/
		const m10 = new FingridSolarPowerFinlandModel({name:'FingridSolarPowerFinlandModel',src:'https://api.fingrid.fi/v1/variable/248/events/json?'});
		m10.subscribe(this);
		this.master.modelRepo.add('FingridSolarPowerFinlandModel',m10);
		this.models['FingridSolarPowerFinlandModel'] = m10;
		
		const m11 = new FingridTransmissionFinlandCentralSwedenModel({name:'FingridTransmissionFinlandCentralSwedenModel',src:'https://api.fingrid.fi/v1/variable/89/event/json'});
		m11.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandCentralSwedenModel',m11);
		this.models['FingridTransmissionFinlandCentralSwedenModel'] = m11;
		
		const m12 = new FingridTransmissionFinlandEstoniaModel({name:'FingridTransmissionFinlandEstoniaModel',src:'https://api.fingrid.fi/v1/variable/180/event/json'});
		m12.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandEstoniaModel',m12);
		this.models['FingridTransmissionFinlandEstoniaModel'] = m12;
		
		const m13 = new FingridTransmissionFinlandNorthernSwedenModel({name:'FingridTransmissionFinlandNorthernSwedenModel',src:'https://api.fingrid.fi/v1/variable/87/event/json'});
		m13.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandNorthernSwedenModel',m13);
		this.models['FingridTransmissionFinlandNorthernSwedenModel'] = m13;
		
		const m14 = new FingridTransmissionFinlandRussiaModel({name:'FingridTransmissionFinlandRussiaModel',src:'https://api.fingrid.fi/v1/variable/195/event/json'});
		m14.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandRussiaModel',m14);
		this.models['FingridTransmissionFinlandRussiaModel'] = m14;
		
		const m15 = new FingridTransmissionFinlandNorwayModel({name:'FingridTransmissionFinlandNorwayModel',src:'https://api.fingrid.fi/v1/variable/187/event/json'});
		m15.subscribe(this);
		this.master.modelRepo.add('FingridTransmissionFinlandNorwayModel',m15);
		this.models['FingridTransmissionFinlandNorwayModel'] = m15;
		
		this.models['FingridPowerSystemStateModel'] = this.master.modelRepo.get('FingridPowerSystemStateModel');
		this.models['FingridPowerSystemStateModel'].subscribe(this);
		
		this.models['MenuModel'] = this.master.modelRepo.get('MenuModel');
		this.models['MenuModel'].subscribe(this);
		
		this.timers['GridPageChartView'] = {timer: undefined, interval: 180000, 
			models:[ /* 16 models */
				'FingridPowerSystemStateModel',
				'FingridElectricityProductionFinlandModel',
				'FingridElectricityConsumptionFinlandModel',
				'FingridNuclearPowerProductionFinlandModel',
				'FingridHydroPowerProductionFinlandModel',
				'FingridWindPowerProductionFinlandModel',
				//'FingridCondensingPowerProductionFinlandModel',
				'FingridOtherPowerProductionFinlandModel',
				'FingridIndustrialCogenerationProductionFinlandModel',
				'FingridCogenerationDHProductionFinlandModel',
				//'FingridSolarPowerFinlandModel',
				'FingridTransmissionFinlandCentralSwedenModel',
				'FingridTransmissionFinlandEstoniaModel',
				'FingridTransmissionFinlandNorthernSwedenModel',
				'FingridTransmissionFinlandRussiaModel',
				'FingridTransmissionFinlandNorwayModel'
			]};
		this.timers['GridPageChartViewSolarForecast'] = {timer: undefined, interval: 3600000, 
			models:[
				'FingridSolarPowerFinlandModel'
			]};
			
		this.view = new GridPageView(this);
		// If view is shown immediately and poller is used, like in this case, 
		// we can just call show() and let it start fetching... 
		this.show(); // Try if this view can be shown right now!
	}
}
